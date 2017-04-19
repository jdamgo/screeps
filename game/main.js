
/* ********** ********** Imports ********** ********** */

/* ***** Project ***** */

const hfv = require('helper-func-vars')
const cli = require('console-line-interface')

const sourceManager = require('manager.source')
const spawnManager = require('manager.spawn')


/* ********** ********** ??? ********** ********** */

module.exports.loop = function () {
  hfv()
  cli()

  sourceManager.loop()
  spawnManager.loop()

  // TODO move to creep manager
  for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName]
    const script = require(`role.${creep.memory.role}`)

    script.run(creep)
  }
}
