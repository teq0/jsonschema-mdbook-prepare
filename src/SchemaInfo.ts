import * as path from 'path';
import * as fs from 'fs';

class ReadMeIndex {
  private _content: string

  constructor(filePath: string) {
    this._content = fs.readFileSync(filePath, 'utf8')
  }

  findMDFileName(schemaId: string): string | undefined{
    const escapedId = schemaId.replace('.', '\.');
    const res = this._content.match(`\\(\\./(.*\.md)[^\`]*\`${escapedId}\``);

    if (res && res?.length >= 2) {
      if (res?.[1]) {
        return res[1];
      }
    }

    return undefined;
  }
}

export class SchemaFolder {
  fullPath: string;
  subFolders: SchemaFolder[];
  schemas: SchemaInfo[];

  constructor(fullPath: string) {
    this.fullPath = fullPath;
    this.subFolders = [];
    this.schemas = [];
  }
}

export class SchemaInfo {
  id: string;
  title: string;
  mdFilename: string;
  private static mdIndex: ReadMeIndex;

  public static init(mdPath: string) {
    SchemaInfo.mdIndex = new ReadMeIndex(path.join(mdPath, 'README.md'));
  }

  constructor(id: string, title: string, mdFilename: string) {
    this.id = id;
    this.title = title;
    this.mdFilename = mdFilename;
  }

  public static fromFile(filePath: string): SchemaInfo {
    const filename = path.basename(filePath);
    const j = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const id = j["$id"];
    const title = j["title"];

    // find the name of the .md file from the jsonschema2md generated README.md
    const mdPath = SchemaInfo.mdIndex.findMDFileName(id) || '';

    return new SchemaInfo(id, title, mdPath);
  }
}
