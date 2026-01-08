// src/routes/api/QMS/SYSTEM/A/AA0010.ts
import { createProcedurePostHandler } from '@/server/procedure/createProcedureRoute';
import { ProcedureMap } from '@/server/procedure/types';
import { createFileRoute } from '@tanstack/react-router'


// 추후에
// 키값에 txn 없으면 백에서 트랜잭션 처리 x
// 키값에 txn 있으면 백에서 트랜잭션 처리

const procedureMap: ProcedureMap = {
  search: { sp: 'uwindb1.spa_aa0010_inquiry' },
  exec_save: 'uwindb1.spa_aa0010_p1_save', 
  exec_save: 'uwindb1.spa_aa0010_p1_save', 
  txn_save: 'uwindb1.spa_aa0010_inquiry'
};

export const Route = createFileRoute('/api/QMS/SYSTEM/A/AA0010')({
  server: {
    handlers: {
      POST: createProcedurePostHandler(procedureMap),
      // PUT: createProcedurePutHandler(procedureMap),
      // PATCH: createProcedurePostHandler(procedureMap), //백엔드에서 한다. 
    },
  },
})

// callRead()
// callWrite()
// callTxnWrite()







// callWriteBackTxn() // 백에서
