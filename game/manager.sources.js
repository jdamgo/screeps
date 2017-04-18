// Sources Manager

/* Memory Access
 *  - Memory.managedSources
 *  - Creep.harvestTarget
 */


/* ********** ********** Imports ********** ********** */

/* ***** Internal ***** */

const spawnsManager = require('manager.spawns')


/* ********** ********** Variables ********** ********** */
// XXX


/* ********** ********** JSDoc Definitions ********** ********** */

/**
 * The complete Triforce, or one or more components of the Triforce.
 *
 * @typedef {Object} ManagedSource
 *
 * @property {Source} object - The games source object.
 * @property {Number} neededWorkforce - The number of WORK parts needed for max. harvesting efficiency.
 * @property {Creep|String} harvester - The assigned harvester of the source or 'REQUESTED' if one is requested.
 * @property {StructureContainer} container - The container to transfer the harvested energy to.
 */


/* ********** ********** Functions ********** ********** */

/**
 * Add a source to the list of managed sources.
 *
 * @public
 *
 * @param {Source} source - The source to manage.
 */
function addSource(source) {
  // add source to managed sources
  Memory.managedSources.push({
    object: source,
    neededWorkforce: source.energyCapacity / source.ticksToRegeneration / HARVEST_POWER,
  })
}

/**
 * Remove a source from the list of managed sources.
 *
 * @public
 *
 * @param {Source} source - The source not to manage any more.
 */
function removeSource(source) {
  for (let idx = 0; idx < Memory.managedSources.length; idx++)
    if (Memory.managedSources[idx].object.id === source.id) {
      Memory.managedSources.splice(idx, 1)
      break
    }
}

/**
 * Generate the body parts list for a harvester creep based on the source.
 *
 * @private
 *
 * @param {ManagedSource} source - The harvest source for the creep.
 * @returns {Array} The list of body parts for the harvester.
 */
function getHarvesterBody(source) {
  // list of body parts
  const body = []
  // get max costs
  let remainingEnergy = source.object.room.energyCapacity

  // substract costs for CARRY and MOVE parts
  remainingEnergy -= BODYPART_COST.CARRY + BODYPART_COST.MOVE
  // fill remaining body with WORK parts
  for (let cnt = 0; cnt < source.neededWorkforce; cnt++) {
    if (remainingEnergy - BODYPART_COST.WORK < 0)
      break
    body.push(WORK)
    remainingEnergy -= BODYPART_COST.WORK
  }
  // add the (already in calculation included) CARRY and MOVE parts
  body.push(CARRY)
  body.push(MOVE)

  return body
}

/**
 * Manage a given source. (Tick Action)
 *
 * @private
 *
 * @param {ManagedSource} source - The source to manage.
 */
function manageSource(source) {
  /* TODO not working 'findInRange' not present
  // check if source has a container registered
  if (!source.container) {
    // search for a container nearby (within max. 2 tiles range)
    const availableContainers = source.object.pos.findInRange(FIND_MY_STRUCTURES, 2, { structureType: STRUCTURE_CONTAINER })
    // register container if found
    if (availableContainers.length > 0) {
      source.container = availableContainers[0]
      if (source.harvester != null)
        source.harvester.memory.harvestTarget = availableContainers[0]
    }
  }
  */

  // check if source has a harvester registered
  if (!source.harvester) {
    // request a new harvester
    spawnsManager.requestCreep(getHarvesterBody(source), {
      room: source.object.room,
      memory: {
        role: 'harvester',
        harvestSource: source.object,
      },
      callback(creep) {
        source.harvester = creep
      },
    })
    source.harvester = 'REQUESTED'
  }
}


/* ********** ********** Manager Interface ********** ********** */

function loop() {
  // check if manager is initialized
  if (!Memory.managedSources)
    Memory.managedSources = []

  // manage all registered sources
  for (const source of Memory.managedSources)
    manageSource(source)
}


/* ********** ********** Exports ********** ********** */

module.exports = {
  /* *** Manager Interface *** */
  loop,

  /* *** Functions *** */
  addSource,
  removeSource,
}
