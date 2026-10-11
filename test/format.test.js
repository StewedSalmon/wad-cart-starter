import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Checks the 'Style' rules from AGENTS.md against every .js file in src/ and test/.
const rootDirectory = join(dirname(fileURLToPath(import.meta.url)), '..')
const sourceDirectories = ['src', 'test']
const singleQuote = '\u0027'
const doubleQuote = '\u0022'
const backtick = '`'

test('package.json declares ES modules', () => {
  const manifest = JSON.parse(readFileSync(join(rootDirectory, 'package.json'), 'utf8'))
  assert.equal(manifest.type, 'module')
})

test('source files use ES module syntax, not CommonJS', () => {
  assertNoViolations(findViolations((file, source, { code }) =>
    patternViolations(file, code, /\brequire\s*\(|\bmodule\.exports\b/, 'use import/export instead of CommonJS')
  ))
})

test('indentation uses 2 spaces per level and no tabs', () => {
  assertNoViolations(findViolations((file, source) =>
    source.split('\n').flatMap((line, index) => {
      const indent = line.match(/^\s*/)[0]
      const isBlank = line.trim() === ''
      const isValid = !indent.includes('\t') && indent.length % 2 === 0
      return isBlank || isValid ? [] : [report(file, index + 1, 'indentation must use 2 spaces per level and no tabs')]
    })
  ))
})

test('string literals use single quotes', () => {
  assertNoViolations(findViolations((file, source, { nonSingleQuoteLines }) =>
    nonSingleQuoteLines.map((line) => report(file, line, 'use single quotes for strings'))
  ))
})

test('lines do not end with a semicolon', () => {
  assertNoViolations(findViolations((file, source, { code }) =>
    code.split('\n').flatMap((line, index) =>
      line.trimEnd().endsWith(';') ? [report(file, index + 1, 'remove the semicolon at the end of the line')] : []
    )
  ))
})

test('variables and functions use camelCase', () => {
  assertNoViolations(findViolations((file, source, { code }) =>
    namedViolations(file, code, /\b(?:const|let|var|function)\s+([A-Za-z_$][\w$]*)/g, /^[a-z][a-zA-Z0-9]*$/, 'camelCase')
  ))
})

test('classes use PascalCase', () => {
  assertNoViolations(findViolations((file, source, { code }) =>
    namedViolations(file, code, /\bclass\s+([A-Za-z_$][\w$]*)/g, /^[A-Z][a-zA-Z0-9]*$/, 'PascalCase')
  ))
})

function listSourceFiles() {
  return sourceDirectories.flatMap((directory) =>
    readdirSync(join(rootDirectory, directory))
      .filter((entry) => entry.endsWith('.js'))
      .map((entry) => join(directory, entry))
  )
}

function findViolations(check) {
  return listSourceFiles().flatMap((file) => {
    const source = readFileSync(join(rootDirectory, file), 'utf8').replace(/\r\n/g, '\n')
    return check(file, source, parseSource(source))
  })
}

function assertNoViolations(violations) {
  assert.deepEqual(violations, [], '\n' + violations.join('\n'))
}

function report(file, line, message) {
  return file + ':' + line + ' ' + message
}

function patternViolations(file, code, pattern, message) {
  return code.split('\n').flatMap((line, index) =>
    pattern.test(line) ? [report(file, index + 1, message)] : []
  )
}

function namedViolations(file, code, pattern, allowed, style) {
  return [...code.matchAll(pattern)]
    .filter((match) => !allowed.test(match[1]))
    .map((match) => report(file, lineNumberAt(code, match.index), match[1] + ' should use ' + style))
}

function lineNumberAt(text, index) {
  return text.slice(0, index).split('\n').length
}

function blankOut(text) {
  return text.replace(/[^\n]/g, ' ')
}

// Returns the source with comments and string contents blanked out (same length, same newlines),
// plus the line numbers of strings that do not use single quotes.
function parseSource(source) {
  let code = ''
  const nonSingleQuoteLines = []
  let index = 0

  while (index < source.length) {
    const char = source[index]
    const next = source[index + 1]
    let end = index + 1

    if (char === '/' && next === '/') {
      end = source.indexOf('\n', index)
      end = end === -1 ? source.length : end
      code += blankOut(source.slice(index, end))
    } else if (char === '/' && next === '*') {
      end = source.indexOf('*/', index + 2)
      end = end === -1 ? source.length : end + 2
      code += blankOut(source.slice(index, end))
    } else if (char === singleQuote || char === doubleQuote || char === backtick) {
      end = index + 1
      while (end < source.length && source[end] !== char) {
        end += source[end] === '\\' ? 2 : 1
      }
      end = Math.min(end + 1, source.length)
      if (char !== singleQuote) {
        nonSingleQuoteLines.push(lineNumberAt(source, index))
      }
      code += blankOut(source.slice(index, end))
    } else {
      code += char
    }

    index = end
  }

  return { code, nonSingleQuoteLines }
}
