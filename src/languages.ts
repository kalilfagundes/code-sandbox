
interface Language {
  name: string
  srcFileExt: string
  compilation?: string
  binFileExt?: string
  execution: string
}

const SRC_DIR = '{{src_dir}}'
const BIN_DIR = '{{bin_dir}}'
const SRC_FILE = '{{src_file}}'
const BIN_FILE = '{{bin_file}}'

const supportedLanguages: Language[] = [
  {
    name: 'c',
    srcFileExt: '.c',
    compilation: `gcc "${SRC_FILE}" -o "${BIN_FILE}"`,
    execution: `"${BIN_FILE}"`,
  },
  {
    name: 'js',
    srcFileExt: '.js',
    execution: `node "${SRC_FILE}"`,
  },
  {
    name: 'php',
    srcFileExt: '.php',
    execution: `php "${SRC_FILE}"`,
  },
]

export {
  supportedLanguages as languages,
  SRC_DIR, SRC_FILE,
  BIN_DIR, BIN_FILE,
}

export type {
  Language,
}
