import { useProcedureClient } from '@/server/procedure/procecureClient';
import React, { useEffect, useState } from 'react'

export default function AA0010() {
  const [data, setData] = useState<any>(null)
  const { callProcedure} = useProcedureClient();

  useEffect(() => {
    async function fetchData() {
      const result = await callProcedure('search', {})
      
      setData(result)
    }
    fetchData()
  }, [])

  return (
    <div>
      <h3>AA0010</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
