/**
 * Module that manages the players spawns.
 * @module SpawnManager
 */


/* ********** ********** Type Definitions ********** ********** */

/**
 * Callback for notifying about the start of a creep's spawn process.
 * @callback spawningCreepCallback
 *
 * @param {StructureSpawn} spawn - The spawn spawning the new creep.
 * @param {Name} creepName - The new creep's name.
 */


/* ********** ********** Functions ********** ********** */

/**
 * Request the spawning of a creep.
 * @public
 * @static
 *
 * @param {Array} body - An array describing the new creep’s body.
 * @param {Object} [opts] - An object containing additional spawning options.
 * @param {Room} [opts.room] - The room the new creep should be spawned in.
 * @param {String} [opts.name] - The name of the new creep.
 * @param {Object} [opts.memory] - The initial memory of the new creep.
 * @param {spawningCreepCallback} [opts.callback] - A function called when a spawn starts spawning the new creep.
 */
function requestCreep(body, opts) {
  let queue
  if (opts && opts.room) {
    if (!opts.room.memory.spawnQueue)
      opts.room.memory.spawnQueue = []
    queue = opts.room.memory.spawnQueue
  } else {
    if (!Memory.spawnQueue)
      Memory.spawnQueue = []
    queue = Memory.spawnQueue
  }

  queue.push({
    body,
    name: opts.name,
    memory: opts.memory,
    callback: opts.callback,
  })
}

/**
 * Calculate the costs needed to spawn a creep with the specified body.
 * @private
 * @static
 *
 * @param {Array.<String>} body - The creep's body.
 * @returns {Number} Returns the costs to spawn the creep.
 */
function getCreepBodyCosts(body) {
  let costs = 0
  for (const part of body)
    costs += BODYPART_COST[part]
  return costs
}

/**
 * Dispatches a request from the spawn queue if possible.
 * @private
 * @static
 *
 * @param {StructureSpawn} spawn - The dispatching spawn.
 */
function spawnCreep(spawn) {
  for (const queue of [spawn.room.memory.spawnQueue, Memory.spawnQueue])
    if (queue && queue.length > 0) {
      const creepInfo = queue[0]
      const creepName = spawn.createCreep(
          creepInfo.body,
          creepInfo.name,
          creepInfo.memory)
      if (typeof creepName === 'string') {
        queue.shift()
        if (creepInfo.callback)
          creepInfo.callback(spawn, creepName)
      } else if (creepName !== ERR_NOT_ENOUGH_ENERGY || getCreepBodyCosts(creepInfo.body) > spawn.room.energyCapacityAvailable) {
        queue.shift()
        throw new Error(`Cannot spawn creep! (${ERR(creepName)})`)
      }
    }
}

/**
 * Manage a given spawn.
 * @private
 * @static
 *
 * @param {StructureSpawn} spawn - The spawn to manage.
 */
function manageSpawn(spawn) {
  if (!spawn.spawning)
    spawnCreep(spawn)
}


/* ********** ********** Manager Interface ********** ********** */

/**
 * The manager function called every tick.
 * @public
 * @static
 */
function loop() {
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
