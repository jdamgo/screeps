/**
 * @module MemoryLibrary
 */

/**
 * {@link http://docs.screeps.com/global-objects.html#Memory-object|Screeps API}
 * @global
 * @namespace Memory
 */


/* ********** ********** Types ********** ********** */

/**
 * A managed source.
 * @global
 * @typedef {Object} ManagedSource
 *
 * @property {ID} id - The sources game ID. ({@link http://docs.screeps.com/api/#Source.id|Source.id})
 * @property {Name} harvester - The assigned harvester creep's name. ({@link http://docs.screeps.com/api/#Creep.name|Creep.name})
 *
 * @todo remove property 'id'
 */


/* ********** ********** Properties ********** ********** */

/**
 * A dictionary containing the managed sources using their game ID's as keys.
 * @var {Object.<ID, ManagedSource>} Memory.managedSources
 */

/**
 * A queue containing the room-independent requested creeps for spawning.
 * @var {Object.<ID, ManagedSource>} Memory.spawnQueue
 */


/* ********** ********** Functions ********** ********** */

/**
 * Resets the players memory.
 * @memberof Memory
 * @public
 * @static
 */
function reset() {
  Memory = {}
}


/* ********** ********** Exports ********** ********** */

module.exports = function () {
  Memory.reset = reset
}
