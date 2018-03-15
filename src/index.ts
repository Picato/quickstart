import * as fs from 'fs'
import * as path from 'path'
import * as url from 'url'
import { generation } from './config'
import type from './lib/_.type'

const exec = require('child_process').exec
declare let global: any

class MyArray extends Array {
  push(data: any) {
    if (data !== undefined && data !== null) {
      return super.push(data)
    }
    return -1
  }
}

function format(file: string, cb?: Function) {
  exec(`tsfmt -r "${file}"`, (error, stdout, stderr) => {
    if (error !== null) {
      return console.log(`exec error: ${error}`)
    }
    if (cb) cb(file)
  })
}

function writeFile(file, cnt, isFormat?) {
  fs.writeFileSync(file, cnt)
  // format(file, (file) => {
  //     format(file)
  // })
}

function gen(tables: any) {
  for (let tblName in tables) {
    const TblName = tblName[0].toUpperCase() + tblName.substr(1)
    const table = tables[tblName]
    let meta: {
      cols: type<any>[]
      isGotFile: any
    } = {
        cols: [],
        isGotFile: false
      }
    for (let colName in table) {
      const colType = table[colName]
      let colObject: type<any>
      if (typeof colType === 'function') {
        colObject = colType.required()
      } else {
        colObject = colType
      }
      if (colObject.constructor.name === 'FileType') meta.isGotFile = colObject
      colObject.fieldName = colName
      meta.cols.push(colObject)
    }
    genGUIProvider(tblName, TblName, meta)
    genGUI(tblName, TblName, meta)
    genUIRoutes(tblName, TblName, meta)
  }
  // genGUIMenu(Object.keys(tables))
  createRoutes()
}
async function createRoutes() {
  console.log('Apply routes')
  let routes = []
  let fnames = []
  fs.readdirSync(path.join('..', 'src/router')).forEach(f => {
    if (f.endsWith('Routes.js')) {
      const fname = f.substr(0, f.indexOf('.'))
      routes.push(`import ${fname} from '@/router/${f}'`)
      fnames.push(`...${fname}`)
    }
  })
  routes.push('')
  routes.push(`export default [${fnames.join(', ')}]`)
  routes.push('')
  await writeFile(path.join('..', 'src/router/Admin.js'), routes.join('\n'))
}
function genGUI(tblName: string, TblName: string, meta: {
  cols: type<any>[]
  isGotFile: any
}) {
  let $form = new MyArray()
  let $referImport = new MyArray()
  let $referData = new MyArray()
  let $referInit = new MyArray()
  let $titleTable = new MyArray()
  let $contentTable = new MyArray()
  let $dfValue = {}
  for (let col of meta.cols) {
    let frms: any = col.form()
    if (frms instanceof Array) {
      $referImport.push(frms[0])
      $referData.push(frms[1])
      $referInit.push(frms[2])
      $form.push(`          ${frms[3]}`)
    } else {
      $form.push(`          ${frms}`)
    }
    if (col._dfValue !== undefined) {
      $dfValue[col.fieldName] = col._dfValue
    }
    $titleTable.push(col.titleTable())
    $contentTable.push(col.contentTable())
  }
  if ($referImport.length > 0) $referImport.splice(0, 0, '')
  if ($referData.length > 0) $referData.splice(0, 0, '')
  if ($referInit.length > 0) $referInit.push('')
  let content: string = fs.readFileSync(path.join(__dirname, '..', 'template', '[Tbl].vue')).toString()
  content = content.replace(/\$\{tbl\}/g, tblName)
  content = content.replace(/\$\{Tbl\}/g, TblName)
  content = content.replace(/\$\{\$dfValue\}/g, type.ostringify($dfValue, null, ' ').replace(/"/g, "'"))
  content = content.replace(/\$\{\$form\}/g, $form.join('\n'))
  content = content.replace(/\$\{\$referImport\}/g, $referImport.join('\n'))
  content = content.replace(/\$\{\$referData\}/g, $referData.join(',\n'))
  content = content.replace(/\$\{\$referInit\}/g, $referInit.join('\n'))
  content = content.replace(/\$\{\$titleTable\}/g, $titleTable.join('\n'))
  content = content.replace(/\$\{\$contentTable\}/g, $contentTable.join('\n'))
  const fgui = path.join(__dirname, '..', '..', 'src', 'components', TblName + '.vue')
  try {
    fs.statSync(fgui)
    console.warn(`#WARN\t${fgui} is existed`)
  } catch (e) {
    writeFile(fgui, content, true)
  }
}

function genGUIProvider(tblName: string, TblName: string, meta: {
  cols: type<any>[]
  isGotFile: any
}) {
  let content: string = fs.readFileSync(path.join(__dirname, '..', 'template', '[Tbl]Provider.js')).toString()
  content = content.replace(/\$\{tbl\}/g, tblName)
  content = content.replace(/\$\{Tbl\}/g, TblName)
  const fguipro = path.join(__dirname, '..', '..', 'src', 'providers', TblName + '.js')
  try {
    fs.statSync(fguipro)
    console.warn(`#WARN\t${fguipro} is existed`)
  } catch (e) {
    writeFile(fguipro, content, true)
  }
}

function genUIRoutes(tblName: string, TblName: string, meta: {
  cols: type<any>[]
  isGotFile: any
}) {
  let content: string = fs.readFileSync(path.join(__dirname, '..', 'template', '[Tbl]Routes.js')).toString()
  content = content.replace(/\$\{tbl\}/g, tblName)
  content = content.replace(/\$\{Tbl\}/g, TblName)
  const fguirou = path.join(__dirname, '..', '..', 'src', 'router', TblName + 'Routes.js')
  try {
    fs.statSync(fguirou)
    console.warn(`#WARN\t${fguirou} is existed`)
  } catch (e) {
    writeFile(fguirou, content, true)
  }
}
function genGUIMenu(tblNames: string[]) {
  let content: string = fs.readFileSync(path.join(__dirname, '..', 'template', 'Menu.vue')).toString()
  content = content.replace(/\$\{\$menu\}/g, tblNames.map(e => `< router - link to= "${e}" tag= "a" class="item" active- class="active" >
      <span class="icon" >
        <i class="fa fa-question-circle" > </i>
          < /span>
          < span class="name" > ${e} </span>
            < /router-link>`).join('\n'))
  const fguipro = path.join(__dirname, '..', '..', 'src', 'components', 'template', 'Menu.vue')
  try {
    fs.statSync(fguipro)
    console.warn(`#WARN\t${fguipro} is existed`)
  } catch (e) {
    writeFile(fguipro, content, true)
  }
}

gen(generation.Tables)