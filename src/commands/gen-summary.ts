import {Command, flags} from '@oclif/command'
import * as fs from 'fs'
import {SummaryGenerator} from '../lib/SummaryGenerator'

export default class GenSummary extends Command {
  static description = 'Generates a concise SUMMARY.md for mdbook for content generated using jsonschema2md. Book index will contain just the top level schemas, grouped by folder.'

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),

    schemaPath: flags.string({char: 's', description: 'path-to-schemas', required: true}),
    mdPath: flags.string({char: 'm', description: 'path-to-md-files (generated by jsonschema2md)', required: true}),
    allFiles: flags.boolean({char: 'a', description: 'Generate for all .md files, not just top-level schemas'}),
  }

  static args = []

  async run() {
    const {args, flags} = this.parse(GenSummary)

    if (!fs.existsSync(flags.schemaPath)) {
      this.error(`Schemas path does not exist: ${flags.schemaPath}`, {exit: 2})
    }

    if (!fs.existsSync(flags.mdPath)) {
      this.error(`Markdown files path does not exist: ${flags.mdPath}`, {exit: 2})
    }

    const gen = new SummaryGenerator(flags.schemaPath, flags.mdPath)
    if (flags.allFiles) {
      gen.writeSummaryFromMDs()
    } else {
      gen.writeSummaryFromSchemas()
    }
  }
}
