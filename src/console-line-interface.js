// Console Line Interface


/* ********** ********** Imports ********** ********** */

/* ***** Project ***** */

const sourceManager = require('manager.source')


/* ********** ********** Source Management ********** ********** */

/**
 * Register a source for harvesting.
 *
 * @public
 * @todo asfg
 *
 * @param {Source|Source.ID} source - Source object or ID of source to register.
 *
 */
function registerSource(source) {
  // get source object if argument is ID
  if (typeof source === 'string')
    source = Game.getObjectById(source)

  // TODO register the source
  sourceManager.addSource(source)
}

/**
 * Deregister a source from harvesting.
 *
 * @public
 *
 * @param {Source|Source.ID} source - Source object or ID of source to register.
 *
 */
function deregisterSource(source) {
  // get source object if argument is ID
  if (typeof source === 'string')
    source = Game.getObjectById(source)

  // TODO deregister the source
  sourceManager.removeSource(source)
}


/* ********** ********** Exports ********** ********** */

module.exports = function () {
  /* ********** Memory ********** */
  Memory.reset = function () {
    Memory = {}
  }

  /* ********** Player ********** */
  global.Player = {
    // XXX testing
    test() {
      Memory.reset()
      for (const source of Game.rooms.sim.find(FIND_SOURCES))
        Player.exploitSource(source)

      Player.test = null
    },

      /* *** Source Management *** */
    exploitSource: registerSource,
    dropSource: deregisterSource,
  }

  // XXX testing
  if (Player.test)
    Player.test()
}
