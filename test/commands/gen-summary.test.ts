import {expect, test} from '@oclif/test'
import * as fs from 'fs'

describe('gen-summary', () => {
  const schemasPath = 'test/samples'
  const mdPath = 'test/doc/src'
  const summaryPath = 'test/doc/src/SUMMARY.md'

  test
  .do(ctx => {
    // make sure SUMMARY.md doesn't exist
    try {
      fs.unlinkSync(summaryPath)
    }
    catch (error) {}
  })
  .stdout()
  .command(['gen-summary', '-s', schemasPath, '-m', mdPath])
  .it('runs gen-summary in schema mode and creates SUMMARY.md', ctx => {
    expect(fs.existsSync(summaryPath)).to.be.true
  })

  test
  .do(() => {
    // make sure SUMMARY.md doesn't exist
    try {
      fs.unlinkSync(summaryPath)
    }
    catch (error) {}
  })
  .stdout()
  .command(['gen-summary', '-a', '-s', schemasPath, '-m', mdPath])
  .it('runs gen-summary in md mode and creates SUMMARY.md', ctx => {
    expect(fs.existsSync(summaryPath)).to.be.true
  })
})
