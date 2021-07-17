import fs, { WriteFileOptions } from 'fs'

function writeFile(filename: string, content: string, options: WriteFileOptions = {}) {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(filename, content, options, (error) => {
      error ? reject(error) : resolve()
    })
  })
}

export { writeFile }
