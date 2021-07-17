import childProcess from 'child_process'

import type { ExecException } from 'child_process'

function exec(command: string) {
  return new Promise<[string, ExecException?]>((resolve) => {
    childProcess.exec(command, (error, stdout, stderr) => {
      if (error) {
        resolve([stderr, error])
      } else if (stderr) {
        resolve([stderr])
      } else {
        resolve([stdout])
      }
    })
  })
}

export default exec
