// This script look for outdated ecosystem library files.

const fs = require('fs')
const libs = fs.readdirSync('./lib')
const apps = fs.readdirSync('../').filter((file) => { return file.toLowerCase() !== 'periodic' })

// Load latest

const latest = {}

for (const lib of libs) {
  latest[lib] = fs.readFileSync(`./lib/${lib}`, 'utf8')
}

for (const app of apps) {
  const folderpath = `../${app}/scripts/lib`
  if (!fs.existsSync(folderpath)) {
    continue
  }

  console.log(`\nChecking ${app}..`)

  for (const lib of libs) {
    const libpath = `${folderpath}/${lib}`
    if (fs.existsSync(libpath)) {
      const libtxt = fs.readFileSync(libpath, 'utf8')
      const liblatest = latest[lib]
      if (libtxt !== liblatest) {
        console.warn(`- ${lib} is outdated!`)
      }
    }
  }
}

console.log('\nDone.')
