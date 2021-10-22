import path from 'path'
import mkdir from 'mkdirp'
//<<<<<<< refactor/response-format
import { Language, CodeRun, CodeRunOutput } from './types'
//=======
import { ExecOptions } from 'child_process'
import { Language, CodeRun } from './types'
//>>>>>>> main
import { removeDir, writeFile } from '../utils/fs'
import stopwatch from '../utils/stopwatch'
import { exec } from '../utils/system'

const SANDBOX_DIR = process.env.SANDBOX_DIR ?? '/tmp/sandbox'
const SANDBOX_TIMEOUT = Number(process.env.SANDBOX_TIMEOUT ?? 0)

/**
 * Save source code in a temporary text file
 */
async function saveSourceCode(lang: Language, targetDir: string, code: string) {
  const srcFile = path.resolve(targetDir, `${lang.id}.${lang.srcFileExt}`)
  await writeFile(srcFile, code)

  return srcFile
}

/**
 * Save input text in a temporary file
 */
async function saveParams(targetDir: string, paramIndex: number, inputText: string) {
  const paramFile = path.resolve(targetDir, `input_${paramIndex}.txt`)
  await writeFile(paramFile, inputText)

  return paramFile
}

/**
 * Execute the entire service:
 * 1. Save source code in a file
 * 2. Save input text in files, if any
 * 3. Compile the source code, if needed
 * 4. Execute the source code or binary files
 *
 * On any exceptions, return early outputs
 */
async function execute(
  codeRunId: string,
  lang: Language,
  targetDir: string,
  code: string,
  params: string[],
): Promise<CodeRun> {
  const srcFile = await saveSourceCode(lang, targetDir, code)
  const binFile = lang.compilationScript
    ? path.resolve(targetDir, `${lang.id}.${lang.binFileExt}`)
    : srcFile
  const inputFiles = await Promise.all(
    params.map((text, index) => saveParams(targetDir, index + 1, text)),
  )

  function getExecOptions(paramFile = ''): ExecOptions {
    return {
      cwd: targetDir,
      timeout: SANDBOX_TIMEOUT,
      env: {
        ...process.env,
        BASE_DIR: targetDir,
        SRC_FILE: srcFile,
        BIN_FILE: binFile,
        INPUT_FILE: paramFile,
      },
    }
  }

  // If language is compilable
  if (lang.compilationScript) {
    try {
      stopwatch.start(codeRunId)

      await exec(lang.compilationScript, getExecOptions())

      stopwatch.stop(codeRunId)
    } catch (error: any) {
      stopwatch.stop(codeRunId)
      return {
        id: codeRunId,
        status: 'COMPILATION_ERROR',
        comp_time: stopwatch.get(codeRunId) ?? 0,
        output: error.message,
      }
    }
  }

  // Execute the program itself
  async function runExec(inputFile = '', index = 0): Promise<CodeRunOutput> {
    try {
      stopwatch.start(inputFile)
      const execOptions = getExecOptions(inputFile)
      const output = await exec(lang.executionScript, execOptions)
      stopwatch.stop(inputFile)

      return {
        exit_code: 0,
        status: 'SUCCESS',
        exec_time: stopwatch.get(inputFile) ?? 0,
        input: params[index] ?? null,
        output,
      }
    } catch (error: any) {
      stopwatch.stop(inputFile)
      return {
        exit_code: error.code,
        status: 'RUNTIME_ERROR',
        exec_time: stopwatch.get(inputFile) ?? 0,
        input: params[index] ?? null,
        output: error.message,
      }
    }
  }

  const result = params.length
    ? await Promise.all(inputFiles.map(runExec))
    : await runExec()

  return {
    id: codeRunId,
    status: 'COMPLETED',
    comp_time: stopwatch.get(codeRunId),
    result,
  }
}

async function executeAndClear(
  runId: string,
  lang: Language,
  code: string,
  params: string[],
) {
  const targetDir = path.resolve(SANDBOX_DIR, `${lang.id}_${runId}`)
  await mkdir(targetDir)

  try {
    // maintain "await" keyword, as this
    // must execute before "finally" block
    return await execute(runId, lang, targetDir, code, params)
  } finally {
    if (process.env.NODE_ENV === 'production') {
      // add clearing function to call stack
      setTimeout(removeDir, 0, targetDir)
    }
  }
}

export { executeAndClear as execute }
