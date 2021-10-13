import { exec as shellExec, ExecOptions } from 'child_process'

/**
 * Execute a command in the shell and
 * return the output
 */
export function exec(
  command: string,
  options: ExecOptions = {},
) {
  return new Promise<string>((resolve, reject) => {
    shellExec(command, options, (error, stdout, stderr) => {
      error ? reject(error) : resolve(stderr || stdout)
    })
  })
}
