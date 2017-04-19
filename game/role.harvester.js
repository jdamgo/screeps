// Harvester Creep


/* ********** ********** Role Interface ********** ********** */

function run(creep) {
  // check if still in spawning stage
  if (creep.spawning)
    return

  const mem = creep.memory

  // transfer energy
  // TODO rework; where to transfer energy to?
  if (creep.carry.energy === creep.carryCapacity) {
    const harvestTarget = creep.room.find(FIND_MY_SPAWNS)[0]
    switch (creep.transfer(harvestTarget, RESOURCE_ENERGY)) {
    case OK:
      break
    case ERR_NOT_IN_RANGE:
      creep.moveTo(harvestTarget)
      break
    default:
      throw new Error()
    }
  }

  // harvest energy
  if (creep.carry.energy < creep.carryCapacity) {
    const harvestSource = ID(mem.harvestSourceId)
    switch (creep.harvest(harvestSource)) {
    case OK:
    case ERR_NOT_ENOUGH_RESOURCES:
      break
    case ERR_NOT_IN_RANGE:
      creep.moveTo(harvestSource)
      break
    default:
      throw new Error(`Harvesting failed! (${creep.harvest(harvestSource)})`)
    }
  }

  // notify lifetime expiration
  if (creep.ticksToLive < MAX_CREEP_SIZE * CREEP_SPAWN_TIME)
    creep.say(`⭕ dying`)
}


/* ********** ********** Exports ********** ********** */

module.exports = {
  /* *** Role Interface *** */
  run,
}
