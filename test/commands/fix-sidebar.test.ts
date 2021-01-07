import {expect, test} from '@oclif/test'

describe('fix-sidebar', () => {
  // TODO: replace with mock-fs so it's not so brittle and doesn't depend on running jsonschema2md
  test
  .stdout()
  .command(['fix-sidebar', '-s', 'test/doc/book', '-d', 'test/doc/book-extrafiles'])
  .it('runs fix-sidebar against test/doc and updates 74 files', ctx => {
    expect(ctx.stdout).to.contain('74 files updated.')
  })
})
