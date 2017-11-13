import * as _ from 'lodash'
import * as fs from 'fs'
import * as path from 'path'
import * as url from 'url'
import { generation } from '../config'
import Type from './_.type'

const exec = require('child_process').exec
declare let global: any

console.log(path.join(generation.RootProject, 'package.json'))

const AppConfig: any = JSON.parse(fs.readFileSync(path.join(generation.RootProject, 'package.json')).toString()).config
const urlApp = url.parse(AppConfig.url)
AppConfig.host = urlApp.host

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

function writeFile(file, cnt, isFormat) {
  fs.writeFileSync(file, cnt)
  format(file, (file) => {
    format(file)
  })
}

function gen(tables: any) {
  for (let tblName in tables) {
    const TblName = tblName[0].toUpperCase() + tblName.substr(1)
    const table = tables[tblName]
    let meta = {
      cols: [] as Type<any>[],
      isGotFile: false as any
    }
    for (let colName in table) {
      const colType = table[colName]
      let colObject: Type<any>
      if (typeof colType === 'function') {
        colObject = colType.required()
      } else {
        colObject = colType
      }
      if (colObject.constructor.name === 'FileType') meta.isGotFile = colObject
      colObject.fieldName = colName
      meta.cols.push(colObject)
    }
    genService(tblName, TblName, meta)
    genController(tblName, TblName, meta)
    // genSpec(tblName, TblName, meta)
    // genHttp(tblName, TblName, meta)
    const fhttp = path.join(generation.RootProject, '.gencode')
    writeFile(fhttp, fs.readFileSync('config.ts'), true)
  }
}

function genHttp(tblName: string, TblName: string, meta: {
  cols: Type<any>[]
  isGotFile: any
}) {
  let $fields = {}
  let $files = []
  let contentType = 'application/json'
  for (let col of meta.cols) {
    if (col.constructor.name === 'FileType') {
      contentType = 'multipart/form-data'
    }
    _.merge($fields, col.genHttpField())
  }

  // let content: string = fs.readFileSync(path.join(__dirname, '..', 'template', '[tbl].http')).toString()
  // content = content.replace(/\$\{tbl\}/g, tblName)
  // content = content.replace(/\$\{Tbl\}/g, TblName)
  // content = content.replace(/\$\{contentType\}/g, contentType)
  // content = content.replace(/\$\{port\}/g, AppConfig.port)
  // content = content.replace(/\$\{fields\}/g, $fields.join(',\n\t\t\t'))
  let content = []
  content.push(`http://test.clipvnet.com/test-api?cmd=${new Buffer(JSON.stringify({
    "url": `${AppConfig.host}/${tblName}`,
    "method": "POST",
    "_headers": [{}],
    "_data": $fields,
    "title": `Add ${TblName}`,
    "contentType": `${contentType}`
  })).toString('ascii')}`)

  // content.push(`${JSON.stringify({
  //   "url": `${AppConfig.host}/${tblName}`,
  //   "method": "POST",
  //   "_headers": [{}],
  //   "_data": JSON.stringify($fields),
  //   "title": `Add ${TblName}`,
  //   "contentType": `${contentType}`
  // })}`)


  const fhttp = path.join(generation.RootProject, 'http', `${tblName}.http`)
  fs.writeFileSync(fhttp, content.join('\n\n'))
}

function genSpec(tblName: string, TblName: string, meta: {
  cols: Type<any>[]
  isGotFile: any
}) {
  let $fields = []
  let $files = []
  for (let col of meta.cols) {
    if (col.constructor.name === 'FileType') {
      $files.push(col.genSpecField())
    } else {
      $fields.push(col.genSpecField())
    }
  }

  let content: string = fs.readFileSync(path.join(__dirname, '..', '..', 'template', '[tbl].spec.js')).toString()
  content = content.replace(/\$\{tbl\}/g, tblName)
  content = content.replace(/\$\{Tbl\}/g, TblName)
  content = content.replace(/\$\{fields\}/g, $fields.join(',\n'))
  content = content.replace(/\$\{files\}/g, $files.join(',\n'))

  if ($files.length === 0) {
    content = content.replace(/>>>file[^]*?<<<file/g, '')
    content = content.replace(/>>>field[^]*?<<<field/g, '')
    if ($fields.length === 0) {
      content = content.replace(/>>>data[^]*?<<<data/g, '')
    } else {
      content = content.replace(/[>,<]{3}data/g, '')
    }
  } else {
    content = content.replace(/>>>data[^]*?<<<data/g, '')
    content = content.replace(/[>,<]{3}file/g, '')
    if ($fields.length === 0) {
      content = content.replace(/>>>field[^]*?<<<field/g, '')
    } else {
      content = content.replace(/[>,<]{3}field/g, '')
    }
  }

  const fspec = path.join(generation.RootProject, 'src', 'test', 'spec', `${tblName}.spec.ts`)
  try {
    fs.statSync(fspec)
    console.warn(`#WARN\t${fspec} is existed`)
  } catch (e) {
    writeFile(fspec, content, true)
  }
}

function genController(tblName: string, TblName: string, meta: {
  cols: Type<any>[]
  isGotFile: any
}) {
  let $bodyIn = new MyArray()
  let $bodyUp = new MyArray()
  for (let col of meta.cols) {
    $bodyIn.push(col.assignInController())
    $bodyUp.push(col.assignUpController())
  }

  let content: string = fs.readFileSync(path.join(__dirname, '..', '..', 'template', '[Tbl]Controller.ts')).toString()
  content = content.replace(/\$\{tbl\}/g, tblName)
  content = content.replace(/\$\{Tbl\}/g, TblName)
  content = content.replace(/\$\{\$bodyIn\}/g, $bodyIn.join(',\n'))
  content = content.replace(/\$\{\$bodyUp\}/g, $bodyUp.join(',\n'))
  if (!generation.Auth) {
    content = content.replace(/>>>auth[^]*?<<<auth/g, '')
  } else {
    content = content.replace(/[>,<]{3}auth/g, '')
  }
  if (!meta.isGotFile) {
    content = content.replace(/>>>file[^]*?<<<file/g, '')
    content = content.replace(/[>,<]{3}normal/g, '')
  } else {
    content = content.replace(/>>>normal[^]*?<<<normal/g, '')
    if (meta.isGotFile._config.resize) meta.isGotFile._config.resize = `$Native(${TblName}Service.IMAGE_SIZES)`
    content = content.replace(/[>,<]{3}file/g, '')
    content = content.replace(/\$\{file-opts\}/g, meta.isGotFile ? Type.ostringify(meta.isGotFile._config) : '')
  }
  const fcontroller = path.join(generation.RootProject, 'src', 'controller', TblName + 'Controller.ts')
  try {
    fs.statSync(fcontroller)
    console.warn(`#WARN\t${fcontroller} is existed`)
  } catch (e) {
    writeFile(fcontroller, content, true)
  }
}

function genService(tblName: string, TblName: string, meta: {
  cols: Type<any>[]
  isGotFile: any
}) {
  let $bean = new MyArray()
  let $validateIn = new MyArray()
  let $validateUp = new MyArray()
  for (let col of meta.cols) {
    $bean.push(col.genBeanCollection())
    $validateIn.push(col.validateInsert('body'))
    $validateUp.push(col.validateUpdate('body'))
  }

  let content: string = fs.readFileSync(path.join(__dirname, '..', '..', 'template', '[Tbl]Service.ts')).toString()
  content = content.replace(/\$\{tbl\}/g, tblName)
  content = content.replace(/\$\{Tbl\}/g, TblName)
  content = content.replace(/\$\{\$bean\}/g, $bean.join('\n'))
  content = content.replace(/\$\{\$validateIn\}/g, $validateIn.join('\n'))
  content = content.replace(/\$\{\$validateUp\}/g, $validateUp.join('\n'))

  if (!meta.isGotFile) {
    content = content.replace(/>>>file[^]*?<<<file/g, '')
    content = content.replace(/[>,<]{3}normal/g, '')
  } else {
    content = content.replace(/>>>normal[^]*?<<<normal/g, '')
    content = content.replace(/\$\{file-field\}/g, meta.isGotFile.fieldName)
    content = content.replace(/\$\{file-resize\}/g, Type.ostringify(meta.isGotFile._config.resize))
    content = content.replace(/[>,<]{3}file/g, '')
  }
  const fservice = path.join(generation.RootProject, 'src', 'service', TblName + 'Service.ts')
  try {
    fs.statSync(fservice)
    console.warn(`#WARN\t${fservice} is existed`)
  } catch (e) {
    writeFile(fservice, content, true)
  }
}

gen(generation.Tables)
