
function run(creep) {
  const mem = creep.memory

    // repair container
  if (mem.harvestTarget && mem.harvestTarget.hits <= mem.harvestTarget.hitsMax - REPAIR_POWER)
    switch (creep.repair(mem.harvestTarget)) {
    case OK:
    case ERR_NOT_ENOUGH_RESOURCES:
      break
    case ERR_NOT_IN_RANGE:
      creep.moveTo(mem.harvestTarget)
      break
    default:
      throw new Error()
    }

    // harvest energy
  if (creep.carry.energy < creep.carryCapacity)
    switch (creep.harvest(mem.harvestSource)) {
    case OK:
      break
    case ERR_NOT_IN_RANGE:
      creep.moveTo(mem.harvestSource)
      break
    default:
      throw new Error()
    }

    // transfer energy
  if (creep.carry.energy === creep.carryCapacity)
    if (mem.harvestTarget)
      switch (creep.transfer(mem.harvestTarget, RESOURCE_ENERGY)) {
      case OK:
        break
      case ERR_NOT_IN_RANGE:
        creep.moveTo(mem.harvestTarget)
        break
      default:
        throw new Error()
      }

    // notify lifetime expiration
  if (creep.ticksToLive < MAX_CREEP_SIZE * CREEP_SPAWN_TIME)
    creep.say(`⭕ dying -${creep.ticksToLive}`)
}


module.exports = { run }
