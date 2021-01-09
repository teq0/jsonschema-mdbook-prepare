import * as fs from 'fs'

export class MDInfo {
  fullPath: string

  title: string

  constructor(fullPath: string, title: string) {
    this.fullPath = fullPath
    this.title = title
  }

  static fromFile(filePath: string): MDInfo | undefined {
    const content = fs.readFileSync(filePath, 'utf8')
    // extract the relevant id
    const res = content.match(/``txt\n(\S+)\n```/)

    if (res && res?.length >= 2) {
      if (res?.[1]) {
        return new MDInfo(filePath, res[1])
      }
    }

    return undefined
  }
}
