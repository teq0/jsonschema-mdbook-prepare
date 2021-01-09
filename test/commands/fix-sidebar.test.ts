import * as mockfs from 'mock-fs'
import {expect, test} from '@oclif/test'
import * as path from 'path'

const newSidebar = `                      <ol class="chapter"><li class="chapter-item expanded affix "><a href="index.html" class="active">Index</a></li></ol>`

const mockSidebarFolders = () => {
  const mockfsConf = {
    'package.json': mockfs.load(path.resolve(__dirname, '../../package.json')),
    'tsconfig.json': mockfs.load(path.resolve(__dirname, '../../tsconfig.json')),
    '.eslintrc': mockfs.load(path.resolve(__dirname, '../../.eslintrc')),
    'bin': mockfs.load(path.resolve(__dirname, '../../bin')),
    'src': mockfs.load(path.resolve(__dirname, '../../src')),
    'test': mockfs.load(path.resolve(__dirname, '../../test')),
    'node_modules': mockfs.load(path.resolve(__dirname, '../../node_modules')),
    '.nyc_output': mockfs.load(path.resolve(__dirname, '../../.nyc_output')),

    'tmp/doc/book': {
      'index.html': `
<!DOCTYPE HTML>
<html lang="en" class="sidebar-visible no-js light">
    <head>
        <!-- Book generated using mdBook -->
        <meta charset="UTF-8">
        <title>Index - Sample Schemas</title>
        <!-- Custom HTML head -->
        <!-- content removed -->
        <link rel="stylesheet" href="css/print.css" media="print">
    </head>
    <body>
        <!-- Provide site root to javascript -->
        <script type="text/javascript">
            var path_to_root = "";
            var default_theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "navy" : "light";
        </script>

        <!-- content removed -->

        <nav id="sidebar" class="sidebar" aria-label="Table of contents">
            <div class="sidebar-scrollbox">
${newSidebar}
            </div>
            <div id="sidebar-resize-handle" class="sidebar-resize-handle"></div>
        </nav>

        <div id="page-wrapper" class="page-wrapper">
            <div class="page">
              <!-- content removed -->
            </div>
    </body>
</html>
      `,
    },
    'tmp/doc/book-extrafiles': {
      'address-v1.html': `
<!DOCTYPE HTML>
<html lang="en" class="sidebar-visible no-js light">
    <head>
        <!-- Book generated using mdBook -->
        <meta charset="UTF-8">
        <title>https://example.com/Address-v1.0 - Sample Schemas</title>
        <!-- Custom HTML head -->
        <!-- content removed -->
        <link rel="stylesheet" href="css/print.css" media="print">
    </head>
    <body>
        <!-- Provide site root to javascript -->
        <script type="text/javascript">
            var path_to_root = "";
            var default_theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "navy" : "light";
        </script>

        <!-- content removed -->

        <nav id="sidebar" class="sidebar" aria-label="Table of contents">
            <div class="sidebar-scrollbox">
                <ol class="chapter"><li class="chapter-item expanded affix "><a href="index.html">Index</a></li><li class="chapter-item expanded affix "><a href="address-v1-dependencies.html">https://example.com/Address-v1.0#/dependencies</a></li><li class="chapter-item expanded affix "><a href="address-v1-properties-country-name.html">https://example.com/Address-v1.0#/properties/country-name</a></li>/ol>
            </div>
            <div id="sidebar-resize-handle" class="sidebar-resize-handle"></div>
        </nav>

        <div id="page-wrapper" class="page-wrapper">
            <div class="page">
              <!-- content removed -->
            </div>
    </body>
</html>
  `,
      'address-v1-1.html': `
<!DOCTYPE HTML>
<html lang="en" class="sidebar-visible no-js light">
    <head>
        <!-- Book generated using mdBook -->
        <meta charset="UTF-8">
        <title>https://example.com/Address-v1.1 - Sample Schemas</title>
        <!-- Custom HTML head -->
        <!-- content removed -->
        <link rel="stylesheet" href="css/print.css" media="print">
    </head>
    <body>
        <!-- Provide site root to javascript -->
        <script type="text/javascript">
            var path_to_root = "";
            var default_theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "navy" : "light";
        </script>

        <!-- content removed -->

        <nav id="sidebar" class="sidebar" aria-label="Table of contents">
            <div class="sidebar-scrollbox">
                <ol class="chapter"><li class="chapter-item expanded affix "><a href="index.html">Index</a></li><li class="chapter-item expanded affix "><a href="address-v1-1-dependencies.html">https://example.com/Address-v1.1#/dependencies</a></li><li class="chapter-item expanded affix "><a href="address-v1-1-properties-country-name.html">https://example.com/Address-v1.1#/properties/country-name</a></li>/ol>
            </div>
            <div id="sidebar-resize-handle" class="sidebar-resize-handle"></div>
        </nav>

        <div id="page-wrapper" class="page-wrapper">
            <div class="page">
              <!-- content removed -->
            </div>
    </body>
</html>
  `,
    },
  }

  // mockfs.restore()
  mockfs(mockfsConf, {createCwd: false})
}

describe('fix-sidebar', () => {
  test
  .do(() => {
    mockSidebarFolders()
  })
  .finally(() => {
    mockfs.restore()
  })
  .stdout()
  .command(['fix-sidebar', '-s', 'tmp/doc/book', '-d', 'tmp/doc/book-extrafiles'])
  .it('runs fix-sidebar against test/doc and updates 2 files', ctx => {
    expect(ctx.stdout).to.contain('2 files updated.')
  })
})
