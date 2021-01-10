import * as mockfs from 'mock-fs'
import {expect, test} from '@oclif/test'
import * as fs from 'fs'
import * as path from 'path'

const mockFolders = () => {
  const mockfsConf = {
    'package.json': mockfs.load(path.resolve(__dirname, '../../package.json')),
    'tsconfig.json': mockfs.load(path.resolve(__dirname, '../../tsconfig.json')),
    'src': mockfs.load(path.resolve(__dirname, '../../src')),
    'test': mockfs.load(path.resolve(__dirname, '../../test')),
    'node_modules': mockfs.load(path.resolve(__dirname, '../../node_modules')),
    '.nyc_output': mockfs.load(path.resolve(__dirname, '../../.nyc_output')),

    'tmp': {
      'schemas': {
        'folder1': {
          'Address-v1.0.schema.json': `
  {
    "$id": "https://example.com/Address-v1.0",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "dependencies": {
        "extended-address": [
            "street-address"
        ],
        "post-office-box": [
            "street-address"
        ]
    },
    "description": "An address similar to http://microformats.org/wiki/h-card",
    "properties": {
        "country-name": {
            "type": "string"
        },
        "extended-address": {
            "type": "string"
        },
        "locality": {
            "type": "string"
        },
        "post-office-box": {
            "type": "string"
        },
        "postal-code": {
            "type": "string"
        },
        "region": {
            "type": "string"
        },
        "street-address": {
            "type": "string"
        }
    },
    "required": [
        "locality",
        "region",
        "country-name"
    ],
    "title": "Address v1.0",
    "type": "object"
}`,
        },
      },
      'doc': {
        'book': {

        },
        'md': {
          'README.md': `
    # README

    ## Top-level Schemas

    -   [Address v1.0](./address-v1.md "An address similar to http&#x3A;//microformats") – \`https://example.com/Address-v1.0\`

    ## Other Schemas

    ### Objects

    -   [Address v1.0](./card-v1-properties-address-v10.md "An address similar to http&#x3A;//microformats") – \`https://example.com/Address-v1.0#/properties/adr\`

    ### Arrays

    ## Version Note

    The schemas linked above follow the JSON Schema Spec version: \`http://json-schema.org/draft-07/schema#\`
`,
          'address-v1.md' : `
# Address v1.0 Schema

\`\`\`txt
https://example.com/Address-v1.0
\`\`\`

An address similar to <http://microformats.org/wiki/h-card>


| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                 |
| :------------------ | ---------- | -------------- | ------------ | :---------------- | --------------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [Address-v1.0.schema.json](../out/FolderA/Address-v1.0.schema.json "open original schema") |

## Address v1.0 Type

\`object\` ([Address v1.0](address-v1.md))

# Address v1.0 Properties

| Property                              | Type     | Required | Nullable       | Defined by                                                                                                                     |
| :------------------------------------ | -------- | -------- | -------------- | :----------------------------------------------------------------------------------------------------------------------------- |
| [country-name](#country-name)         | \`string\` | Required | cannot be null | [Address v1.0](address-v1-properties-country-name.md "https&#x3A;//example.com/Address-v1.0#/properties/country-name")         |
| [extended-address](#extended-address) | \`string\` | Optional | cannot be null | [Address v1.0](address-v1-properties-extended-address.md "https&#x3A;//example.com/Address-v1.0#/properties/extended-address") |
| [locality](#locality)                 | \`string\` | Required | cannot be null | [Address v1.0](address-v1-properties-locality.md "https&#x3A;//example.com/Address-v1.0#/properties/locality")                 |
| [post-office-box](#post-office-box)   | \`string\` | Optional | cannot be null | [Address v1.0](address-v1-properties-post-office-box.md "https&#x3A;//example.com/Address-v1.0#/properties/post-office-box")   |
| [postal-code](#postal-code)           | \`string\` | Optional | cannot be null | [Address v1.0](address-v1-properties-postal-code.md "https&#x3A;//example.com/Address-v1.0#/properties/postal-code")           |
| [region](#region)                     | \`string\` | Required | cannot be null | [Address v1.0](address-v1-properties-region.md "https&#x3A;//example.com/Address-v1.0#/properties/region")                     |
| [street-address](#street-address)     | \`string\` | Optional | cannot be null | [Address v1.0](address-v1-properties-street-address.md "https&#x3A;//example.com/Address-v1.0#/properties/street-address")     |

<!-- rest of content removed for brevity -->
`,
          'address-v1-properties.md': `
# Untitled undefined type in Address v1.0 Schema

\`\`\`txt
https://example.com/Address-v1.0#/properties
\`\`\`




| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                   |
| :------------------ | ---------- | -------------- | ----------------------- | :---------------- | --------------------- | ------------------- | -------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [Address-v1.0.schema.json\*](../out/FolderA/Address-v1.0.schema.json "open original schema") |

## properties Type

unknown

`,
        },
        'book-pass1': {

        }
      },
    },
  }

  mockfs(mockfsConf, {createCwd: false})
}

describe('gen-summary', () => {
  const schemasPath = 'tmp/schemas'
  const mdPath = 'tmp/doc/md'
  const summaryPath = 'tmp/doc/md/SUMMARY.md'

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
    // more tests needed to check the actual content
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
    // more tests needed to check the actual content
  })
})
