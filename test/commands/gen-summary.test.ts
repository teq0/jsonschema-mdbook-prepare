import {expect, test} from '@oclif/test'

describe('gen-summary', () => {
  test
  .stdout()
  .command(['gen-summary'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['gen-summary', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
