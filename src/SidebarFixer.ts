import * as fs from 'fs'
import * as path from 'path'

export default class SidebarFixer {
  private _sourceFolder: string

  private _destFolder: string

  private _sidebarContent: string

  private _sidebarRegex: RegExp

  constructor(sourceFolder: string, destFolder: string) {
    this._sourceFolder = sourceFolder
    this._destFolder = destFolder
    this._sidebarContent = ''
    this._sidebarRegex = new RegExp(`(<div class="sidebar-scrollbox">\\n)(\\s*<ol class="chapter">.*ol>\\n)`)
  }

  updateSidebars(): number {
    const indexPath = path.join(this._sourceFolder, 'index.html')
    const indexContent = fs.readFileSync(indexPath, 'utf8')
    // extract the desired sidebar
    const res = indexContent.match(this._sidebarRegex)
    let fileCount = 0

    if (res && res?.length >= 3) {
      if (res?.[2]) {
        this._sidebarContent = res[2]
        fileCount = this.updateFolder(this._destFolder)
      }
    }

    return fileCount
  }

  private updateFolder(folderPath: string): number {
    let fileCount = 0

    try {
      fs.readdirSync(folderPath).forEach(f => {
        const fullPath = path.join(folderPath, f)

        if (fs.statSync(fullPath).isDirectory()) {
          fileCount += this.updateFolder(fullPath)
        } else if (f.match(/.*\.html/)) {
          this.updateFile(fullPath)
          fileCount++
        }
      })
    }
    catch (error) {
      // maybe handle some errors here one day, but for now...
      throw error
    }

    return fileCount
  }

  private updateFile(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf8')
    const newContent = content.replace(this._sidebarRegex, `$1${this._sidebarContent}`)
    fs.writeFileSync(filePath, newContent, {encoding: 'UTF8'})
  }
}
