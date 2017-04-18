
const sourcesManager = require('manager.sources')
const spawnsManager = require('manager.spawns')

const harvesterRole = require('role.harvester')


module.exports.loop = function () {
  for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName]
    switch (creep.role) {
    case 'harvester':
      harvesterRole.run(creep)
      break
    default:
      throw new Error()
    }
  }

  sourcesManager.loop()
  spawnsManager.loop()
}
