import path from 'path'
import mkdir from 'mkdirp'
import { exec, fs } from './utils'
import { TARGET_FILE } from './languages'

import type { Language } from './languages'

function mountCommand(rawCommand: string | string[], targetFile: string) {
  const strCommand = Array.isArray(rawCommand)
    ? rawCommand.join(' ')
    : rawCommand

  return strCommand.replace(TARGET_FILE, targetFile)
}

async function runSourceCode(key: string, code: string, lang: Language) {
  const baseFileName = `${process.env.SANDBOX_DIR}/${lang.name}_${key}`
  const srcFileName = `${baseFileName}.${lang.srcFileExt}`
  const binFileName = lang.compilation && lang.binFileExt
    ? `${baseFileName}.${lang.binFileExt}`
    : srcFileName

  await mkdir(path.dirname(srcFileName))
  await fs.writeFile(srcFileName, code)

  if (lang.compilation) {
    const compilationCommand = mountCommand(lang.compilation, `${baseFileName}.${lang.srcFileExt}`)
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
