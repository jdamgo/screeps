// Source Manager
/** @module Manager.Source */


/* ********** ********** Imports ********** ********** */

/* ***** Internal ***** */

const spawnManager = require('manager.spawn')


/* ********** ********** Variables ********** ********** */

/**
 * An object of managed sources source with their game IDs as hash keys.
 *
 * @typedef {Object} Memory.managedSources
 *
 */
if (!Memory.managedSources)
  Memory.managedSources = {}


/* ********** ********** JSDoc Definitions ********** ********** */

/**
 * A managed source.
 *
 * @typedef {Object} ManagedSource
 *
 * @property {Source.ID} id - The games source object ID.
 * @property {Creep.NAME|String} harvesterName - The assigned harvester name or the string 'REQUESTED' if one is requested.
 *
 */


/* ********** ********** Functions ********** ********** */

/**
 * Add a source to the managed sources.
 *
 * @public
 *
 * @param {Source} source - The source to manage.
 *
 */
function addSource(source) {
  // check arguments
  if (!(source instanceof Source))
    throw new Error('Argument is not a source!')

  // add source to managed sources
  Memory.managedSources[source.id] = { id: source.id }
}

/**
 * Remove a source from the managed sources.
 *
 * @public
 *
 * @param {Source} source - The source not to manage any more.
 *
 */
function removeSource(source) {
  // check arguments
  if (!(source instanceof Source))
    throw new Error('Argument is not a source!')

  delete Memory.managedSources[source.id]
}

// TODO rework; move to harvester file
/**
 * Generate the body parts array for a harvester creep based on the source.
 *
 * @private
 *
 * @param {ManagedSource} source - The harvest source for the creep.
 * @returns {Array} The list of body parts for the harvester.
 *
 */
function getHarvesterBody(source) {
  // list of body parts
  const body = []
  // get max costs
  let remainingEnergy = ID(source.id).room.energyCapacityAvailable

  // substract costs for CARRY and MOVE parts
  remainingEnergy -= BODYPART_COST[CARRY] + BODYPART_COST[MOVE]
  // fill remaining body with WORK parts
  const workforce = ID(source.id).energyCapacity / (ID(source.id).ticksToRegeneration || global.ENERGY_REGEN_TIME) / HARVEST_POWER
  for (let cnt = 0; cnt < workforce; cnt++) {
    if (remainingEnergy - BODYPART_COST[WORK] < 0)
      break
    body.push(WORK)
    remainingEnergy -= BODYPART_COST[WORK]
  }
  // add the (already in calculation included) CARRY and MOVE parts
  body.push(CARRY)
  body.push(MOVE)

  return body
}

/**
 * Manage a given source. (Tick Action)
 *
 * @instance
 * @private
 *
 * @param {ManagedSource} source - The source to manage.
 *
 */
function manageSource(source) {
  // TODO temp
  /*
  if (source.harvesterName === 'REQUESTED')
    source.harvesterName = Game.spawns.Spawn1.spawning
  */

  // check if source has a harvester registered
  if (!source.harvesterName) { // eslint-disable-line
    if (false) {  // eslint-disable-line
      // ********** BEGIN ********** TODO alternate block

      if (Game.spawns['Spawn1'].canCreateCreep(getHarvesterBody(source), undefined) !== OK || Game.spawns['Spawn1'].spawning)
        return
      console.log(JSON.stringify(source), source.harvesterName)

      Game.spawns['Spawn1'].createCreep(
          getHarvesterBody(source),
          undefined,
          {
            role: 'harvester',
            harvestSource: source.id,
          })

      source.harvesterName = 'REQUESTED'
      // ********** END **********
    } else {
      // request a new harvester
      spawnManager.requestCreep(getHarvesterBody(source), {
        room: ID(source.id).room,
        memory: {
          role: 'harvester',
          harvestSourceId: source.id,
        },
        callback(creepName) {
          console.log(`${source.id} harvested by ${creepName}`)
          source.harvesterName = creepName
          console.log(source.harvesterName)
        },
      })

      source.harvesterName = 'REQUESTED'
    }
  }
}


/* ********** ********** Manager Interface ********** ********** */

function loop() {
  // manage all registered sources
  for (const sourceId in Memory.managedSources) {
    const source = Memory.managedSources[sourceId]
    manageSource(source)
  }
}


/* ********** ********** Exports ********** ********** */

module.exports = {
  /* *** Manager Interface *** */
  loop,

  /* *** Functions *** */
  addSource,
  removeSource,
}
