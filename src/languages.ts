
interface Language {
  name: string
  srcFileExt: string
  compilation?: string
  binFileExt?: string
  execution: string
}

const SRC_FILE = '{{src_file}}'
const BIN_FILE = '{{bin_file}}'

const supportedLanguages: Language[] = [
  {
    name: 'js',
    srcFileExt: '.js',
    execution: `node ${SRC_FILE}`,
  },
  {
    name: 'php',
    srcFileExt: '.php',
    execution: `php ${SRC_FILE}`,
  },
]

export {
  supportedLanguages as languages,
  SRC_FILE,
  BIN_FILE,
}

export type {
  Language,
}
