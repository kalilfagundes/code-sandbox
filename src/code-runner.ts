import path from 'path'
import mkdir from 'mkdirp'
import { exec, fs } from './utils'
import { SRC_FILE, BIN_FILE } from './languages'

import type { Language } from './languages'

function mountCommand(rawCommand: string | string[], srcFile: string, binFile = '') {
  const strCommand = Array.isArray(rawCommand)
    ? rawCommand.join(' ')
    : rawCommand

  return strCommand
    .replace(SRC_FILE, srcFile)
    .replace(BIN_FILE, binFile)
}

async function runSourceCode(key: string, code: string, lang: Language) {
  const baseFileName = `${process.env.SANDBOX_DIR}/${key}/${lang.name}`
  const srcFileName = `${baseFileName}.${lang.srcFileExt}`
  const binFileName = lang.compilation && lang.binFileExt
    ? `${baseFileName}.${lang.binFileExt}`
    : srcFileName

  await mkdir(path.dirname(srcFileName))
  await fs.writeFile(srcFileName, code)

  if (lang.compilation) {
    const compilationCommand = mountCommand(lang.compilation, srcFileName, binFileName)
    const [output, error] = await exec(compilationCommand)

    if (error) {
      console.error(error)
      return output || error.message
    }
  }

  const executionCommand = mountCommand(lang.execution, binFileName)
  const [output, error] = await exec(executionCommand)

  if (error) {
    console.error(error)
    return output || error.message
  }

  return output
}

export default runSourceCode
