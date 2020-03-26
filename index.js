// This script look for outdated ecosystem library files.

const fs = require('fs')
const libs = fs.readdirSync('./lib')
const apps = fs.readdirSync('../').filter((file) => { return file.toLowerCase() !== 'periodic' })

// Load latest

const latest = {}
const res = {}

for (const lib of libs) {
  latest[lib] = fs.readFileSync(`./lib/${lib}`, 'utf8')
}

for (const app of apps) {
  const folderpath = `../${app}/scripts/lib`
  res[app] = {}
  if (!fs.existsSync(folderpath)) {
    continue
  }
  for (const lib of libs) {
    const libpath = `${folderpath}/${lib}`
    if (fs.existsSync(libpath)) {
      const libtxt = fs.readFileSync(libpath, 'utf8')
      const liblatest = latest[lib]
      res[app][lib] = libtxt === liblatest
    }
  }
}

console.log(`\nScanned ${apps.length} applications.\n`)

for (const id in res) {
  if (Object.keys(res[id]).length === 0) { continue }
  const equals = Object.values(res[id]).reduce((acc, item) => { return acc + (item ? 1 : 0) }, 0)
  const total = Object.keys(res[id]).length
  if (equals === total) {
    console.log(`${id} is OK.`)
    continue
  }
  console.log(`${id} has ${total - equals}/${total} outdated libraries.`)
  for (const lib in res[id]) {
    if (res[id][lib]) { continue }
    console.log(`! [${lib}] is outdated.`)
  }
}
