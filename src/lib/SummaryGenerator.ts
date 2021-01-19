import * as fs from 'fs'
import * as path from 'path'
import {MDInfo} from './MDInfo'
import {SchemaFolder, SchemaInfo} from './SchemaInfo'

export class SummaryGenerator {
  schemasPath: string

  mdsPath: string

  rootSchemaFolder: SchemaFolder

  mdFiles: MDInfo[]

  // Public methods
  constructor(schemasPath: string, mdsPath: string) {
    this.schemasPath = schemasPath
    this.mdsPath = mdsPath
    this.rootSchemaFolder = new SchemaFolder(schemasPath)
    this.mdFiles = []
    SchemaInfo.init(mdsPath)
  }

  writeSummaryFromMDs(): string {
    this.collectMDFiles(this.mdsPath)
    const content = this.genSummaryFromMDs()
    this.writeSummary(content)
    return content
  }

  writeSummaryFromSchemas(): string {
    this.collectSchemas()
    const content = this.genSummaryFromSchemas()
    this.writeSummary(content)
    return content
  }

  // Private methods

  private initSummaryLines(lines: string[]) {
    lines.push('# Schema summary')
    lines.push('[Index](README.md)')
  }

  private writeSummary(content: string) {
    fs.writeFileSync(path.join(this.mdsPath, 'SUMMARY.md'), content, {encoding: 'UTF8'})
  }

  // MD files

  private collectMDFiles(rootPath: string) {
    this.mdFiles = []
    this.scanMDFolder(rootPath)
  }

  private scanMDFolder(folderPath: string): number {
    let mdCount = 0

    try {
      fs.readdirSync(folderPath).forEach(f => {
        const fullPath = path.join(folderPath, f)

        if (fs.statSync(fullPath).isDirectory()) {
          this.scanMDFolder(fullPath)
        } else if (f.match(/.*\.md/)) {
          const mdInfo = MDInfo.fromFile(fullPath)
          if (mdInfo) {
            this.mdFiles.push(mdInfo)
            mdCount++
          }
        }
      })
    } catch (error) {
      // maybe handle some errors here, but for now...
      throw error
    }

    return mdCount
  }

  private genSummaryFromMDs(): string {
    const lines: string[] = []
    this.initSummaryLines(lines)

    this.mdFiles.forEach(f => {
      lines.push(`[${f.title}](${path.basename(f.fullPath)})`)
    })

    return lines.join('\n')
  }

  // Schemas

  private collectSchemas() {
    this.rootSchemaFolder = new SchemaFolder(this.schemasPath)
    this.scanSchemaDir(this.rootSchemaFolder, this.schemasPath)
  }

  private genSummaryFromSchemas(): string {
    const lines: string[] = []
    this.initSummaryLines(lines)

    // if the root folder has schemas in it then start there, otherwise go down a level

    if (this.rootSchemaFolder.schemas.length > 0) {
      this.genSchemaFolderContent(this.rootSchemaFolder, 0, lines)
    } else {
      this.rootSchemaFolder.subFolders.forEach(f => {
        this.genSchemaFolderContent(f, 0, lines)
      })
    }

    return lines.join('\n')
  }

  genSchemaFolderContent(schemaFolder: SchemaFolder, level: number, lines: string[]) {
    lines.push(''.padStart(level, '  ') + `- [${path.basename(schemaFolder.fullPath)}]()`)
    schemaFolder.schemas.forEach(schema => {
      lines.push(''.padStart(level + 2, '  ') + `- [${schema.title}](${schema.mdFilename})`)
    })

    schemaFolder.subFolders.forEach(f => {
      this.genSchemaFolderContent(f, level + 2, lines)
    })
  }

  private scanSchemaDir(schemaFolder: SchemaFolder, dirPath: string): number {
    let schemaCount = 0

    try {
      fs.readdirSync(dirPath).forEach(f => {
        const fullPath = path.join(dirPath, f)

        if (fs.statSync(fullPath).isDirectory()) {
          const sub = new SchemaFolder(fullPath)
          const subschemaCount = this.scanSchemaDir(sub, fullPath)
          if (subschemaCount > 0) {
            schemaFolder.subFolders.push(sub)
            schemaCount += subschemaCount
          }
        } else {
          let schemaInfo: SchemaInfo | undefined

          if (f.match(/.*\.schema\.y[a]?ml/)) {
            // only load YAML schemas if there is no JSON version
            const jsonPath = fullPath.replace(/(.*)\.schema\.y[a]?ml/, `$1.schema.json`)
            if (!fs.existsSync(jsonPath)) {
              schemaInfo = SchemaInfo.fromFile(fullPath)
            }
          } else if (f.match(/.*\.schema\.json/)) {
            schemaInfo = SchemaInfo.fromFile(fullPath)
          }

          if (schemaInfo) {
            schemaFolder.schemas.push(schemaInfo)
            schemaCount++
          }
        }
      }
      )
    } catch (error) {
      // maybe handle some errors here one day, but for now...
      throw error
    }

    return schemaCount
  }
}
