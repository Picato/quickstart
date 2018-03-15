import * as fs from 'fs'
import * as path from 'path'

let rootFolder = process.argv[2]

let TblName

if (process.argv[3]) {
  const TblNames = process.argv[3].split('/')
  TblName = TblNames[TblNames.length - 1]
} else if (rootFolder) {
  TblName = rootFolder
  rootFolder = 'app'
}

TblName.split(',').forEach(TblName => {
  gen(rootFolder, TblName)
})

function gen(rootFolder, TblName) {
  if (!rootFolder || !TblName) throw new Error('Need root folder and component name')

  TblName = TblName[0].toUpperCase() + TblName.substr(1)
  let tblName = TblName[0].toLowerCase() + TblName.substr(1)

  const genFile = (fgui, content) => {
    try {
      fs.statSync(fgui)
      console.warn(`#WARN\t${fgui} is existed`)
    } catch (e) {
      fs.writeFileSync(fgui, content)
    }
  }

  if (rootFolder === 'base') {
    const fgui = path.join(__dirname, '..', '..', 'src', 'components', rootFolder, TblName + '.vue')
    genFile(fgui, `<template>

</template>

<script>
export default {
  name: 'B${TblName}'
}
</script>

<style>

</style>
`)
  } else if (rootFolder === 'app') {
    const fgui = path.join(__dirname, '..', '..', 'src', 'components', rootFolder, TblName + '.vue')
    genFile(fgui, `<template>

</template>

<script>
import { $find, $show, $date, $match, $default } from '@/filters/Core'

export default {
  name: 'A${TblName}',
  filters: { $find, $show, $date, $match, $default },
  providers: ['${TblName}'],
  data() {
    return {}
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {}
  }
}
</script>

<style>

</style>
`)
    const fprovider = path.join(__dirname, '..', '..', 'src', 'providers', TblName + '.js')
    genFile(fprovider, `import axios from 'axios'
import AppConfig from '@/AppConfig'

export default {
}
`)
  } else {
    throw new Error(`Could not generate with rootFolder ${rootFolder}`)
  }

}

