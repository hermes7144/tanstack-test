export const CommandTypes = {
  READER: 'reader',
  TXN: 'txn',
  EXEC: 'exec',
} as const;

export type CommandType = (typeof CommandTypes)[keyof typeof CommandTypes];

export type CommandDef = { sp: string; type?: CommandType };

export type ProcedureMap = Record<string, CommandDef>;