import sql from 'mssql';
import { getPool } from './db';

export async function getSideMenus(params: {
  

  systemCd: string;
  userId: string;
  ip: string;
}) {

  const pool = await getPool();

  const request = pool.request()
    .input('system_cd', sql.VarChar, params.systemCd)
    .input('user_id', sql.VarChar, params.userId)
    .input('ip', sql.VarChar, params.ip);

  const result = await request.execute('uwindb1.spz_sidemenu_inquiry');



  const rawJson = result.recordsets?.[0]?.[0]?.menu_json;
  return rawJson ? JSON.parse(rawJson) : [];
}
