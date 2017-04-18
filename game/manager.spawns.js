// Spawns Manager

/* Memory Access
 *  - Memory.spawnQueue
 *  - Room.spawnQueue
 */


/* ********** ********** Variables ********** ********** */
// XXX


/* ********** ********** JSDoc Definitions ********** ********** */

/**
 * Called when a spawn starts spawning a requested creep.
 *
 * @callback requestCreepCallback
 *
 * @param {Creep} creep - The creep created by the spawn.
*/


/* ********** ********** Functions ********** ********** */

/**
 * Request the spawning of a creep.
 *
 * @public
 *
 * @param {Array} body - A list of body parts for the creep.
 * @param {Object} [opts] - Options for the spawning.
 * @param {Room} [opts.room] - The room the creep should be spawned in.
 * @param {String} [opts.name] - The name of the creep.
 * @param {Object} [opts.memory] - The initial memory of the creep.
 * @param {requestCreepCallback} [opts.callback] - On creep spawning started callback.
 */
function requestCreep(body, opts) {
  // select target spawn queue
  let queue
  if (opts.room) {
    // room specific spawn queue

    // TODO why???
    if (!opts.room.memory)
      opts.room.memory = Memory.rooms[opts.room.name]
    console.log('asdf')

    if (!opts.room.memory.spawnQueue)
      opts.room.memory.spawnQueue = []
    queue = opts.room.memory.spawnQueue
  } else {
    // global specific spawn queue
    if (!Memory.spawnQueue)
      Memory.spawnQueue = []
    queue = Memory.spawnQueue
  }

  // add requested creep info to spawn queue
  queue.push({
    body,
    room: opts.room,
    name: opts.name,
    memory: opts.memory,
    callback: opts.callback,
  })
}

/**
 * Manage a given spawn. (Tick Action)
 *
 * @private
 *
 * @param {StructureSpawn} spawn - The spawn to manage.
 */
function manageSpawn(spawn) {
  // check if spawn is busy
  if (!spawn.spawning)
    // check all possible spawn queues
    spawnQueueDispatchLoop:
    for (const queue of [spawn.room.memory.spawnQueue, Memory.spawnQueue])
      if (queue && queue.length > 0) {
        const creepInfo = queue[0]
        // check if spawn can create a creep (if not continue to next spawn queue)
        switch (spawn.canCreateCreep(creepInfo.body, creepInfo.name)) {
        case OK:
          break
        case ERR_NOT_ENOUGH_ENERGY:
          // do not spawn (wait for sufficient energy)
          break spawnQueueDispatchLoop
        default:
          throw new Error()
        }
        // start spawning the requested creep and remove it from the queue
        queue.shift()
        spawn.createCreep(creepInfo.body, creepInfo.name, creepInfo.memory)
        // notify requester about spawning
        if (creepInfo.callback)
          creepInfo.callback(spawn.spawning)
        break
      }
}


/* ********** ********** Manager Interface ********** ********** */

function loop() {
  // manage all spawns
  for (const spawnName in Game.spawns) {
    const spawn = Game.spawns[spawnName]
    manageSpawn(spawn)
  }
}


/* ********** ********** Module Export ********** ********** */

module.exports = {
  /* *** Manager Interface *** */
  loop,

  /* *** Functions *** */
  requestCreep,
}
