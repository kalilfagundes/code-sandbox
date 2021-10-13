
export interface Language {
  readonly id: string
  readonly name: string
  readonly version?: string
  readonly srcFileExt: string
  readonly binFileExt: string
  readonly compilationScript?: string
  readonly executionScript: string
}

export interface CodeRun {
  source: string
  input: string | null
  output: string
  comp_time: number | null
  exec_time: number | null
  exit_code: number
  status:
  | 'COMPILATION_ERROR'
  | 'EXECUTION_ERROR'
  | 'DONE'
}

export interface Runtime {
  readonly id: string // única e aleatória por objeto
  readonly language: Language
  readonly execute: (
    code: string,
    params: string[]
  ) => Promise<CodeRun | CodeRun[]>
}
