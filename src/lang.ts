import path from 'path'
import mkdir from 'mkdirp'
import { exec, fs } from './utils'

const SRC_FILE_PLACEHOLDER = '{{src-file}}'
const BIN_FILE_PLACEHOLDER = '{{bin-file}}'

function mountCommand(rawCommand: string | string[], srcFile: string, binFile = '') {
  const strCommand = Array.isArray(rawCommand)
    ? rawCommand.join(' ')
    : rawCommand

  return strCommand
    .replace(SRC_FILE_PLACEHOLDER, srcFile)
    .replace(BIN_FILE_PLACEHOLDER, binFile)
}

async function runCommand(mountedCommand: string) {
  const [output, error] = await exec(mountedCommand)

  if (error) {
    console.error(error)
  }

  return error
    ? output || error.message
    : output
}

interface Language {
  name: string
  srcFileExt: string
  binFileExt?: string
  compilation?: string | string[]
  execution: string | string[]
  run: (inputFileName: string, sourceCode: string) => Promise<string>
}

const languages: Language[] = [
  {
    name: 'js',
    srcFileExt: 'js',
    execution: ['node', SRC_FILE_PLACEHOLDER],
    async run(inputFileName: string, sourceCode: string) {
      const srcFile = `${inputFileName}.${this.srcFileExt}`
      const command = mountCommand(this.execution, srcFile)
      await mkdir(path.dirname(srcFile))
      await fs.writeFile(srcFile, sourceCode)
      const output = await runCommand(command)

      return output
    },
  },
]

export default languages
