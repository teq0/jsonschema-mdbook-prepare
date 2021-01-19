import * as path from 'path'
import * as fs from 'fs'
import * as yaml from 'js-yaml'

class ReadMeIndex {
  private _content: string

  constructor(filePath: string) {
    this._content = fs.readFileSync(filePath, 'utf8')
  }

  findMDFileName(schemaId: string): string | undefined {
    /* eslint no-useless-escape: "off" */
    const escapedId = schemaId.replace('.', '\.')
    const res = this._content.match(`\\(\\./(.*\.md)[^\`]*\`${escapedId}\``)

    if (res && res?.length >= 2) {
      if (res?.[1]) {
        return res[1]
      }
    }

    return undefined
  }
}

export class SchemaFolder {
  fullPath: string

  subFolders: SchemaFolder[]

  schemas: SchemaInfo[]

  constructor(fullPath: string) {
    this.fullPath = fullPath
    this.subFolders = []
    this.schemas = []
  }
}

export class SchemaInfo {
  id: string

  title: string

  mdFilename: string

  private static _mdIndex: ReadMeIndex

  public static init(mdPath: string) {
    SchemaInfo._mdIndex = new ReadMeIndex(path.join(mdPath, 'README.md'))
  }

  constructor(id: string, title: string, mdFilename: string) {
    this.id = id
    this.title = title
    this.mdFilename = mdFilename
  }

  public static fromFile(filePath: string): SchemaInfo {
    const buf = fs.readFileSync(filePath, 'utf8')
    let jbuf = ''
    const fileExt = path.extname(filePath)
    switch (fileExt) {
    case '.json': {
      jbuf = buf
      break
    }

    case '.yaml':
    case '.yml': {
      const ybuf = yaml.load(buf)
      jbuf = JSON.stringify(ybuf)
      break
    }

    default:
      throw new Error(`Unknown file extension: ${fileExt}`)
    }

    const j = JSON.parse(jbuf)
    const id = j.$id
    const title = j.title

    // find the name of the .md file from the jsonschema2md generated README.md
    const mdPath = SchemaInfo._mdIndex.findMDFileName(id) || ''

    return new SchemaInfo(id, title, mdPath)
  }
}
