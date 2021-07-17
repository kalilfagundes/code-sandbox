import path from 'path'
import mkdir from 'mkdirp'
import { exec, fs } from './utils'
import { SRC_DIR, SRC_FILE, BIN_DIR, BIN_FILE } from './languages'

import type { Language } from './languages'

function mountCommand(rawCommand: string, srcFile: string, binFile = srcFile) {
  const strCommand = Array.isArray(rawCommand)
    ? rawCommand.join(' ')
    : rawCommand

  return strCommand
    .replace(SRC_DIR, path.dirname(srcFile))
    .replace(SRC_FILE, srcFile)
    .replace(BIN_DIR, path.dirname(srcFile))
    .replace(BIN_FILE, binFile)
}

async function runSourceCode(key: string, code: string, lang: Language) {
  const baseFilePath = `${process.env.SANDBOX_DIR}/key_${key}/${lang.name}`
  const srcFileName = `${baseFilePath}/src${lang.srcFileExt}`
  const binFileName = lang.compilation && `${baseFilePath}/bin${lang.binFileExt ?? ''}`

  await mkdir(baseFilePath)
  await fs.writeFile(srcFileName, code)

  if (lang.compilation) {
    const compilationCommand = mountCommand(lang.compilation, srcFileName, binFileName)
    const [output, error] = await exec(compilationCommand)

    if (error) {
      console.log('Failed compiling:')
      console.error(error)
      return output || error.message
    }
  }

  const executionCommand = mountCommand(lang.execution, binFileName ?? srcFileName)
  const [output, error] = await exec(executionCommand)

  if (error) {
    console.log('Failed executing:')
    console.error(error)
    return output || error.message
  }

  return output
}

export default runSourceCode
