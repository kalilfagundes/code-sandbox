
export interface Language {
  readonly id: string
  readonly name: string
  readonly version?: string
  readonly srcFileExt: string
  readonly binFileExt: string
  readonly compilationScript?: string
  readonly executionScript: string
}

export interface CodeRunOutput {
  readonly exit_code: number
  readonly status: 'RUNTIME_ERROR' | 'SUCCESS'
  readonly exec_time: number
  readonly input: string | null
  readonly output: string
}

export type CodeRun = {
  readonly id: string
  readonly status: 'COMPILATION_ERROR'
  readonly comp_time: number
  readonly output: string
} | {
  readonly id: string
  readonly status: 'COMPLETED'
  readonly comp_time: number | null
  readonly result: CodeRunOutput | CodeRunOutput[]
}

export interface Runtime {
  readonly id: string // única e aleatória por objeto
  readonly language: Language
  readonly execute: (
    code: string,
    params: string[]
  ) => Promise<CodeRun | CodeRun[]>
}
