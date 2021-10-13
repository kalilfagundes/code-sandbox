import fs from 'fs'
import path from 'path'

/**
 * Search for a file name pattern recursively
 * inside a given directory
 */
export function searchFiles(dirname: string, pattern: RegExp) {
  const searchHits: string[] = []

  function recursiveFunction(innerTargetDir: string) {
    return new Promise((resolve, reject) => {
      const dirElementsList = fs.readdirSync(innerTargetDir)
      const searchPromises = dirElementsList.map(async (elem) => {
        const elemFullPath = path.resolve(innerTargetDir, elem)
        const isDirectory = fs.statSync(elemFullPath).isDirectory()

        if (isDirectory) {
          await recursiveFunction(elemFullPath)
        } else if (pattern.test(elemFullPath)) {
          searchHits.push(elemFullPath)
        }
      })

      Promise.all(searchPromises)
        .then(resolve)
        .catch(reject)
    })
  }

  return recursiveFunction(dirname)
    .then(() => searchHits)
}

/**
 * Wrapper function to provide Promise support
 * to "fs.writeFile"
 */
export function writeFile(
  filename: string,
  content: string,
  options: fs.WriteFileOptions = {},
) {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(filename, content, options, (error) => {
      error ? reject(error) : resolve()
    })
  })
}

/**
 * Wrapper function to provide Promise support
 * to "fs.rmdir", besides renaming it
 */
export function removeDir(
  dirname: string,
  options: fs.RmDirOptions = {},
) {
  return new Promise<void>((resolve, reject) => {
    fs.rmdir(dirname, { recursive: true, ...options }, (error) => {
      error ? reject(error) : resolve()
    })
  })
}
