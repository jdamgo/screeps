/**
 * Module defining the entry point for Screeps.
 * @module main
 */


/* ********** ********** Imports ********** ********** */

/* ***** Project ***** */

const libraryModules = [
  require('lib.memory'),
  require('lib.player'),
]
const spawnManager = require('manager.spawn')


/* ********** ********** Types ********** ********** */

/**
 * Screeps Object ID
 * @global
 * @typedef {String} ID
 */

/**
 * Screeps Object Name
 * @global
 * @typedef {String} Name
 */


/* ********** ********** Functions ********** ********** */

/**
 * Get an object with the specified unique ID.
 * @global
 * @function ID
 *
 * @param {ID} id - The unique identificator.
 * @returns {Object|null} Returns an object instance or null if it cannot be found.
 *
 * @see {@link http://docs.screeps.com/api/#Game.getObjectById|Game.getObjectById}
 */

/**
 * Get a string representation of the error.
 * @global
 * @function ERR
 *
 * @param {Number} errcode - The unique error code.
 * @returns {String} Returns the constants name of the error with the corresponding error code.
 *
 * @see {@link http://docs.screeps.com/api/#Constants|Constants}
 */
function getErrorName(errcode) {
  switch (errcode) {
  case 0: return 'OK'
  case -1: return 'ERR_NOT_OWNER'
  case -2: return 'ERR_NO_PATH'
  case -3: return 'ERR_NAME_EXISTS'
  case -4: return 'ERR_BUSY'
  case -5: return 'ERR_NOT_FOUND'
  case -6: return 'ERR_NOT_ENOUGH_(ENERGY | RESOURCES | EXTENSIONS)'
  case -7: return 'ERR_INVALID_TARGET'
  case -8: return 'ERR_FULL'
  case -9: return 'ERR_NOT_IN_RANGE'
  case -10: return 'ERR_INVALID_ARGS'
  case -11: return 'ERR_TIRED'
  case -12: return 'ERR_NO_BODYPART'
  case -14: return 'ERR_RCL_NOT_ENOUGH'
  case -15: return 'ERR_GCL_NOT_ENOUGH'
  default: throw new Error(`Invalid error code! (${errcode})`)
  }
}


/* ********** ********** Test Functions and Variables ********** ********** */

const _test = {
  // eslint-disable-next-line no-empty-function
  onetime() {
    Memory.reset()
    for (const source of Game.rooms.sim.find(FIND_SOURCES))
      Player.exploit(source)
  },

  // eslint-disable-next-line no-empty-function
  loop() {
  },
}

function test() {
  if (!Memory._testCalled) {
    _test.onetime()
    Memory._testCalled = true
  }
  _test.loop()
}


/* ********** ********** Screeps Interface ********** ********** */

/**
 * The games player loop function called every tick.
 * @public
 * @static
 */
function loop() {
  global.ID = Game.getObjectById
  global.ERR = getErrorName

  for (const libraryLoop of libraryModules)
    libraryLoop()

  spawnManager.loop()

  /* TODO move to creep manager
  for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName]
    const script = require(`role.${creep.memory.role}`)

    script.run(creep)
  }
  */

  test()
}


/* ********** ********** Module Exports ********** ********** */

module.exports = {
  /* *** Screeps Interface *** */
  loop,
}
