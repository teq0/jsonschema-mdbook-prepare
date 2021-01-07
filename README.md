jsonschema-mdbook-prepare
=========================

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/jsonschema-mdbook-prepare.svg)](https://npmjs.org/package/jsonschema-mdbook-prepare)
[![Downloads/week](https://img.shields.io/npm/dw/jsonschema-mdbook-prepare.svg)](https://npmjs.org/package/jsonschema-mdbook-prepare)
[![License](https://img.shields.io/npm/l/jsonschema-mdbook-prepare.svg)](https://github.com/teq0/jsonschema-mdbook-prepare/blob/master/package.json)

<!-- toc -->
* [Overview](#overview)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Overview

In order to publish JSON Schema documentation to a website, we use [jsonschema2md](https://github.com/adobe/jsonschema2md) to first generate the schema documentation in Markdown, then [mdBook](https://github.com/rust-lang/mdBook) to create the human-readable HTML website.

`mdBook` takes a file, `SUMMARY.md`, to tell it what markdown files it needs to include, as well as to create a sidebar menu with the table of contents.

`jsonschema2md` generates a lot of files, including ones for the top-level schemas but also many smaller files for each object and property. Including all of these in `SUMMARY.md` generates an extremely cluttered TOC menu, however `mdBook` will only generate HTML files for the Markdown files listed in `SUMMARY.md`, so only including the top-level schema documents results in lots of broken links.

The solution is to do two passes, one using a `SUMMARY.md` containing all the files, and a second pass with a tailored `SUMMARY.md` containing just the top-level schemas, and structured by folder, to generate the desired TOC menu. 

After the first pass, we take a copy of the generated HTML files, since `mdBook` cleans the target folder before each pass. Then after the second pass we copy the additional files created in the first pass back into the final target folder.

There is an additional problem in that the files generated in the first pass contain the cluttered TOC menu with _all_ the files in it, and the menu content is included in every file (i.e. not contained a single shared file), so we need to go through the additional files to replace their menu with the short, structured one generated in the second pass of `jsonschema2md`.

`jsonschema-mdbook-prepare` is a CLI program that has two commands, `gen-summary` and `fix-sidebar`.

# Usage
<!-- usage -->
```sh-session
$ npm install -g jsonschema-mdbook-prepare
$ jsonschema-mdbook-prepare COMMAND
running command...
$ jsonschema-mdbook-prepare (-v|--version|version)
jsonschema-mdbook-prepare/0.0.0 darwin-x64 node-v14.15.3
$ jsonschema-mdbook-prepare --help [COMMAND]
USAGE
  $ jsonschema-mdbook-prepare COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
  - [`jsonschema-mdbook-prepare gen-summary`](#jsonschema-mdbook-prepare-gen-summary)
  - [`jsonschema-mdbook-prepare fix-sidebar`](#jsonschema-mdbook-prepare-fix-sidebar)
  - [`jsonschema-mdbook-prepare help [COMMAND]`](#jsonschema-mdbook-prepare-help-command)

## `jsonschema-mdbook-prepare gen-summary`

`mdBook` expects a [specific format](https://rust-lang.github.io/mdBook/format/summary.html) for `SUMMARY.md`, and each file needs both a title and a path e.g.

```markdown
- [Address v1.0](address-v-1.md)
```

The `gen-summary` command has an optional flag, `- a`, that determines whether it should include all the Markdown files (first pass) or just the top-level schemas (second pass).

For top-level schemas we expect a `title` property at the top level of the schema definition itself, and for the second pass this is used. This isn't entirely straightforward, because `jsonschema2md` doesn't maintain an explicit 1-to-1 relationship between the Markdown filenames and the JSON Schema filenames. Instead it uses [github-slugger](https://github.com/Flet/github-slugger) to ensure unique file names.

So in order to find the right Markdown file for a given schema we look up the generated `README.md`, which contains a list of the top-level schemas with links to the specific Markdown files e.g.

```markdown
# README

## Top-level Schemas

-   [Address v1.0](./address-v1.md "An address similar to http&#x3A;//microformats") – `https://example.com/Address-v1.0`
-   [Address v1.1](./address-v1-1.md "An address similar to http&#x3A;//microformats") – `https://example.com/Address-v1.1`

etc...
```

For all the other fine-grained documents there's generally no title property, so for the first pass we rely on a segment of the Markdown that `jsonschema2md` places in every file that serves as a title e.g.

    ```txt
    https://example.com/Address-v1.1#/properties/country-name
    ```

This obviously somewhat brittle as a change to this format in the future will break this functionality. On the other hand it doesn't really matter, because the TOC menu created in the first pass is discarded, the only important piece of data is the path to the Markdown file.

```
USAGE
  $ jsonschema-mdbook-prepare gen-summary [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/gen-summary.ts](https://github.com/teq0/jsonschema-mdbook-prepare/blob/v0.0.0/src/commands/gen-summary.ts)_

## `jsonschema-mdbook-prepare fix-sidebar`

The generated HTML files each contain the sidebar menu in a section that (currently) looks like

```html

        <nav id="sidebar" class="sidebar" aria-label="Table of contents">
            <div class="sidebar-scrollbox">
                <ol class="chapter"><li class="chapter-item expanded affix "><a href="index.html">Index</a></li><li class="chapter-item expanded "><div><strong aria-hidden="true">1.</strong> FolderA</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="address-v1.html"><strong aria-hidden="true">1.1.</strong> Address v1.0</a></li></li></ol></li></ol>
            </div>
            <div id="sidebar-resize-handle" class="sidebar-resize-handle"></div>
        </nav>
```

The menu content is in the `<ol class="chapter">...</ol>` element.

`fix-sidebar` takes the path to the final (second pass) content, reads the sidebar content from `index.html` (which will always exist), then goes through the `.html` files in the temporary directory that were copied from the first pass, and replaces that element. It does _not_ copy the modified files back. See the `Makefile` for an example of an end-to-end process.

```
USAGE
  $ jsonschema-mdbook-prepare fix-sidebar [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/fix-sidebar.ts](https://github.com/teq0/jsonschema-mdbook-prepare/blob/v0.0.0/src/commands/fix-sidebar.ts)_

## `jsonschema-mdbook-prepare help [COMMAND]`

display help for jsonschema-mdbook-prepare

```
USAGE
  $ jsonschema-mdbook-prepare help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.1/src/commands/help.ts)_
<!-- commandsstop -->
