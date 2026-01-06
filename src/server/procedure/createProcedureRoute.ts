import { executeReader, executeProcedure, executeTxnProcedure } from '@/server/db.service';
import { CommandDef, CommandType, ProcedureMap } from './types';

/** 커맨드 이름으로 타입 추론 */
function inferTypeFromCommand(command: string): CommandType {
  if (/^(search|get|load)/i.test(command)) return 'reader';
  if (/^(txn)/i.test(command)) return 'txn';
  return 'exec';
}

/** procedureMap + command → sp와 타입 해석 */
function resolveCommand(command: string, def: CommandDef) {
  return { sp: def.sp, type: def.type ?? inferTypeFromCommand(command) };
}
/**
 * procedureMap 기반 POST handler 생성
 * @param procedureMap - SP mapping
 */
export function createProcedurePostHandler<T extends ProcedureMap>(procedureMap: T) {
  return async ({ request }: { request: Request }) => {
    const { command, params } = await request.json();
    if (!(command in procedureMap)) throw new Error(`Unknown command: ${command}`);
    
    const def = procedureMap[command as keyof T];
    const { sp, type } = resolveCommand(command, def);

    let result;
    switch (type) {
      case 'reader':
        result = await executeReader(sp, params);
        break;
      case 'txn':
        result = await executeTxnProcedure(sp, params);
        break;
      default:
        result = await executeProcedure(sp, params);
    }

    return Response.json(result);
  };
}
