import mkdir from 'mkdirp'
import { dirname } from 'path'
import { writeFile } from './utils/fs.js'
import exec from './utils/exec.js'

const SRC_FILE_PLACEHOLDER = '{{src-file}}'
const BIN_FILE_PLACEHOLDER = '{{bin-file}}'

function mountCommand(rawCommand, srcFile, binFile = null) {
  let strCommand = ''

  if (Array.isArray(rawCommand)) {
    strCommand = rawCommand.join(' ')
  }

  return strCommand
    .replace(SRC_FILE_PLACEHOLDER, srcFile)
    .replace(BIN_FILE_PLACEHOLDER, binFile)
}

async function runCommand(mountedCommand) {
  try {
    return await exec(mountedCommand)
  } catch (error) {
    console.log(error)
    return error.message
  }
}

const languages = {
  c: {},
  go: {},
  java: {},
  js: {
    srcFileExt: 'js',
    binFileExt: null,
    compilation: null,
    execution: ['node', SRC_FILE_PLACEHOLDER],
    async run(inputFileName, sourceCode) {
      const srcFile = `${inputFileName}.${this.srcFileExt}`
      const command = mountCommand(this.execution, srcFile)
      await mkdir(dirname(srcFile))
      await writeFile(srcFile, sourceCode)
      const output = await runCommand(command)

      return output
    },
  },
  kotlin: {},
  pascal: {},
  php: {},
  python: {},
}

export default languages
