import {expect, test} from '@oclif/test'

describe('fix-sidebar', () => {
  test
  .stdout()
  .command(['fix-sidebar'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['fix-sidebar', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
