/**
 * @module PlayerLibrary
 */

/**
 * @global
 * @namespace Player
 */


/* ********** ********** Imports ********** ********** */

/* ***** Project ***** */

const errmsg = require('errmsg')
const spawnManager = require('manager.spawn')


/* ********** ********** Resource Management ********** ********** */

/**
 * Register a source or mineral for harvesting.
 * @memberof Player
 * @public
 * @static
 *
 * @param {Source|Mineral|ID} resource - The resource object (or its game ID) to register for harvesting.
 */
function exploit(resource) {
  if (typeof resource === 'string')
    resource = Game.getObjectById(resource)
  if (!(resource instanceof RoomObject))
    throw new Error(errmsg.argInst('resource', 'RoomObject'))

  if (resource instanceof Source) {
    void null // TODO implement
    console.log(`exploit source @ ${resource.room} (${resource.pos.x},${resource.pos.y})`)
  } else if (resource instanceof Mineral) {
    void null // TODO implement
    console.log(`exploit mineral @ ${resource.room} (${resource.pos.x},${resource.pos.y})`)
  } else {
    throw new Error(errmsg.argInst('resource', 'Source or Mineral'))
  }
}

/**
 * Deregister a source or mineral from harvesting.
 * @memberof Player
 * @public
 * @static
 *
 * @param {Source|Mineral|ID} resource - The resource object (or its game ID) to deregister from harvesting.
 */
function drop(resource) {
  if (typeof resource === 'string')
    resource = Game.getObjectById(resource)
  if (!(resource instanceof RoomObject))
    throw new Error(errmsg.argInst('resource', 'RoomObject'))

  if (resource instanceof Source) {
    void null // TODO implement
    console.log(`drop source @ ${resource.room.name} (${resource.pos.x},${resource.pos.y})`)
  } else if (resource instanceof Mineral) {
    void null // TODO implement
    console.log(`drop mineral @ ${resource.room.name} (${resource.pos.x},${resource.pos.y})`)
  } else {
    throw new Error(errmsg.argInst('resource', 'Source or Mineral'))
  }
}


/* ********** ********** Spawn Management ********** ********** */

/**
 * Request the spawning of a creep.
 * @memberof Player
 * @public
 * @static
 *
 * @param {Array|String} body - An array or string describing the new creep’s body. (If string use the first uppercase letter of each part except for CLAIM, which is identified by 'L')
 * @param {Object} [opts] - An object containing additional spawning options.
 * @param {Room|Name} [opts.room] - The room (or its name) the new creep should be spawned in.
 * @param {String} [opts.name] - The name of the new creep.
 * @param {Object} [opts.memory] - The initial memory of the new creep.
 */
function newCreep(body, opts) {
  if (typeof body === 'string') {
    const bodyString = body
    body = []
    for (const part of bodyString)
      switch (part) {
      case 'W': body.push(WORK); break
      case 'M': body.push(MOVE); break
      case 'C': body.push(CARRY); break
      case 'A': body.push(ATTACK); break
      case 'R': body.push(RANGED_ATTACK); break
      case 'H': body.push(HEAL); break
      case 'T': body.push(TOUGH); break
      case 'L': body.push(CLAIM); break
      default: throw new Error(`Invalid body part! (${part})`)
      }
  } else if (!Array.isArray(body)) {
    throw new Error(errmsg.argType('body', 'array', body))
  }

  if (opts && typeof opts !== 'object')
    throw new Error(errmsg.argType('opts', 'object', body))

  if (!opts)
    opts = {}
  if (typeof opts.room === 'string')
    opts.room = Game.rooms[opts.room]
  opts.callback = (spawn, creepName) => { console.log(`spawn creep ${creepName} @ ${spawn.name} (${spawn.room.name})`) }
  spawnManager.requestCreep(body, opts)
}

/* ********** ********** Functions ********** ********** */

function checkFlags() {
  let flag

  flag = Game.flags['.exploit'] || Game.flags['.drop']
  if (flag) {
    const resource = flag.room.lookForAt(LOOK_SOURCES, flag.pos)[0] || flag.room.lookForAt(LOOK_MINERALS, flag.pos)[0]
    if (resource)
      Player[flag.name.slice(1)](resource)
    else
      console.warn('NO RES FOUND')
    flag.remove()
  }
}


/* ********** ********** Exports ********** ********** */

module.exports = function () {
  global.Player = {
    /* *** Resource Management *** */
    exploit,
    drop,

    /* *** Spawn Management *** */
    newCreep,
  }

  /* *** loop *** */
  console.log('lib.player')
  checkFlags()
}
