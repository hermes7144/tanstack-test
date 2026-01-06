// service/db.service.ts
import { getPool, sql } from '@/service/db';

export function bindParams(request: any, params: Record<string, string | number>) {
  for (const [key, value] of Object.entries(params)) {
    const type = typeof value === 'number' ? sql.Int : sql.NVarChar;
    request.input(key, type, value);
  }
}

export async function executeReader<T = any>(
  procedureName: string,
  params: Record<string, string | number>,
): Promise<T[][]> {
  const pool = await getPool();
  const request = pool.request();
  try {
    bindParams(request, params);
    const result = await request.execute(procedureName);
    return result.recordsets as T[][];
  } catch (err) {
    console.error('[executeProcedure] 실행 오류:', err);
    throw err;
  }
}
export async function executeProcedure(
  procedureName: string,
  params: Record<string, string | number> | Record<string, string | number>[],
) {
  const pool = await getPool();

  try {
    // ── 다중 처리 ──
    if (Array.isArray(params)) {
      for (const p of params) {
        const request = pool.request();
        bindParams(request, p);
        await request.execute(procedureName);
      }

      return [];
    }

    // ── 단일 처리 ──
    const request = pool.request();
    bindParams(request, params);

    const execResult = await request.execute(procedureName);
    const result = execResult.recordset?.[0];

    if (result?.ret_code === 'NG') {
      throw new Error(result.ret_value || 'Unknown error');
    }

    if (result?.ret_code === 'OK') {
      return result.ret_value ?? null;
    }

    return result;
  } catch (err) {
    console.error('[executeProcedure] 실행 오류:', err);
    throw err;
  }
}

export async function executeTxnProcedure(
  procedureName: string,
  params: Record<string, string | number> | Record<string, string | number>[],
) {
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  // 트랜잭션 시작
  await transaction.begin();

  try {
    // ── 다중 처리 ──
    if (Array.isArray(params)) {
      for (const p of params) {
        const request = transaction.request();
        bindParams(request, p);
        await request.execute(procedureName);
      }

      await transaction.commit();
      return [];
    }

    // ── 단일 처리 ──
    else {
      const request = transaction.request();
      bindParams(request, params);

      const execResult = await request.execute(procedureName);
      const result = execResult.recordset?.[0];

      if (result?.ret_code === 'NG') {
        throw new Error(result.ret_value || 'Unknown error');
      }

      await transaction.commit();

      if (result?.ret_code === 'OK') {
        return result.ret_value ?? null;
      }

      return result;
    }
  } catch (error) {
    // 오류 발생 시 반드시 롤백 후 예외 던지기
    try {
      await transaction.rollback();
    } catch (rollbackError) {
      console.error('[executeWriteProcedure] 트랜잭션 롤백 중 오류:', rollbackError);
    }
    console.error('[executeWriteProcedure] 프로시저 실행 오류:', error);
    throw error;
  }
}
