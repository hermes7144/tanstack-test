// src/routes/api/QMS/SYSTEM/A/AA0010.ts
import { createProcedurePostHandler } from '@/server/procedure/createProcedureRoute';
import { ProcedureMap } from '@/server/procedure/types';
import { createFileRoute } from '@tanstack/react-router'

const procedureMap: ProcedureMap = {
  search: { sp: 'uwindb1.spa_aa0010_inquiry' },
  txn_save: { sp: 'uwindb1.spa_aa0010_save_txn', type :'txn' },
};

export const Route = createFileRoute('/api/QMS/SYSTEM/A/AA0010')({
  server: {
    handlers: {
      POST: createProcedurePostHandler(procedureMap),
    },
  },
})