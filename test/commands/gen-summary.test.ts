import * as mockfs from 'mock-fs'
import {expect, test} from '@oclif/test'
import * as fs from 'fs'
import * as path from 'path'

const mockFolders = () => {
  const mockfsConf = {
    'package.json': mockfs.load(path.resolve(__dirname, '../../package.json')),
    'tsconfig.json': mockfs.load(path.resolve(__dirname, '../../tsconfig.json')),
    '.eslintrc': mockfs.load(path.resolve(__dirname, '../../.eslintrc')),
    'bin': mockfs.load(path.resolve(__dirname, '../../bin')),
    'src': mockfs.load(path.resolve(__dirname, '../../src')),
    'test': mockfs.load(path.resolve(__dirname, '../../test')),
    'node_modules': mockfs.load(path.resolve(__dirname, '../../node_modules')),
    '.nyc_output': mockfs.load(path.resolve(__dirname, '../../.nyc_output')),
  }

  mockfs(mockfsConf, {createCwd: false})
}

describe('gen-summary', () => {
  const schemasPath = 'test/samples'
  const mdPath = 'test/doc/src'
  const summaryPath = 'test/doc/src/SUMMARY.md'

  test
  .do(() => {
    mockFolders()

    // make sure SUMMARY.md doesn't exist
    try {
      fs.unlinkSync(summaryPath)
    }
    catch (error) {}
  })
  .finally(() => {
    mockfs.restore()
  })
  .stdout()
  .command(['gen-summary', '-s', schemasPath, '-m', mdPath])
  .it('runs gen-summary in schema mode and creates SUMMARY.md', ctx => {
    expect(fs.existsSync(summaryPath)).to.be.true
  })

  test
  .do(() => {
    mockFolders()

    // make sure SUMMARY.md doesn't exist
    try {
      fs.unlinkSync(summaryPath)
    }
    catch (error) {}
  })
  .finally(() => {
    mockfs.restore()
  })
  .stdout()
  .command(['gen-summary', '-a', '-s', schemasPath, '-m', mdPath])
  .it('runs gen-summary in md mode and creates SUMMARY.md', ctx => {
    expect(fs.existsSync(summaryPath)).to.be.true
  })
})
