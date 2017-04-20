
/* ********** ********** Imports ********** ********** */

/* ***** Node.js ***** */
const fs = require('fs')
const path = require('path')


const BASE_DIR = path.join('../src')
const INCL_FILES = [path.join(BASE_DIR, '.eslintrc'), path.join(BASE_DIR, '.eslint/api.yml')]
const EXCL_FILES = [path.join(BASE_DIR, '.eslint/api.yml')]
const INCL_PATTERN = '*.js$'
const EXCL_PATTERN = ''


/* ********** ********** Functions ********** ********** */

function getSourceFiles(basePath) {
  const sourceFiles = []

  for (let itemPath of fs.readdirSync(basePath)) {
    itemPath = path.join(basePath, itemPath)

    const itemStat = fs.lstatSync(itemPath)
    if (itemStat.isFile())
      itemPath = [itemPath]
    else if (itemStat.isDirectory())
      itemPath = getSourceFiles(itemPath)
    else
      continue


    for (const file of itemPath) {
      console.log(file)

      if ((!INCL_FILES || INCL_FILES.indexOf(file) >= 0) &&
          (!EXCL_FILES || EXCL_FILES.indexOf(file) < 0))
        sourceFiles.push(file)
    }
  }

  return sourceFiles

  /*
  (!INCL_FILES || INCL_FILES.indexOf(f) >= 0) &&
  (!INCL_PATTERN || f.match(INCL_PATTERN)) &&
  (!EXCL_FILES || EXCL_FILES.indexOf(f) < 0) &&
  (!EXCL_PATTERN || !f.match(EXCL_PATTERN)))
  */
}


/* ********** ********** Script ********** ********** */

console.log(getSourceFiles(BASE_DIR))
