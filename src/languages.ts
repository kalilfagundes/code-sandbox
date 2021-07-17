
interface Language {
  name: string
  srcFileExt: string
  compilation?: string | string[]
  binFileExt?: string
  execution: string | string[]
}

const TARGET_FILE = '{{target-file}}'

const supportedLanguages: Language[] = [
  {
    name: 'js',
    srcFileExt: 'js',
    execution: ['node', TARGET_FILE],
  },
  {
    name: 'php',
    srcFileExt: 'php',
    execution: ['php', TARGET_FILE],
  },
]

export {
  supportedLanguages as languages,
  TARGET_FILE,
}

export type {
  Language,
}
