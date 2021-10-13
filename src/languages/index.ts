import path from 'path'
import { execute } from './runner'
import { Language, Runtime } from './types'
import { searchFiles } from '../utils/fs'

const META_FILES_PATTERN = /.\.json$/i
const SCRIPTS_DIR = `${__dirname}/../../scripts`

/**
 * Store in-memory all supported languages metadata
 */
const supportedLanguages = new Map<string, Language>()

/**
 * Get a random 10-characters string
 */
function getRandomString() {
  return Math.random().toString(36).slice(-10)
}

/**
 * Search all JSON files in script folder and
 * copy data to "supportedLanguages" dictionary
 */
async function loadLanguages() {
  const filesFound = await searchFiles(SCRIPTS_DIR, META_FILES_PATTERN)

  filesFound.forEach((jsonFile) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jsonContent = require(jsonFile)

    // Ensure JSON file includes required fields
    if (jsonContent.id && jsonContent.name && jsonContent.executionScript) {
      let { compilationScript, executionScript } = jsonContent

      compilationScript &&= path.resolve(path.dirname(jsonFile), compilationScript)
      executionScript &&= path.resolve(path.dirname(jsonFile), executionScript)
      supportedLanguages.set(jsonContent.id, {
        ...jsonContent,
        compilationScript,
        executionScript,
      })
    } else {
      console.warn(`WARN: file "${jsonFile}" doesn't contain all required properties to be loaded as a language.`)
    }
  })
}

/**
 * Wrapper for props and code runner function
 */
export function createRuntime(lang: Language): Runtime {
  const uniqueId = getRandomString()

  return {
    id: uniqueId,
    language: lang,
    execute(code: string, params: string[]) {
      return execute(uniqueId, lang, code, params)
    },
  }
}

// Load languages metadata on initialization (asynchronously)
loadLanguages()

export default {
  all(): Readonly<Language[]> {
    return Array
      .from(supportedLanguages.values())
      .map((lang) => ({ ...lang })) // creates a copy of the object
  },
  get(langId: string): Readonly<Language> | undefined {
    return supportedLanguages.get(langId)
  },
}
