import fs from 'fs'

export function writeFile(filename, content, options = {}) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, content, options, (error) => {
      error ? reject(error) : resolve()
    })
  })
}
