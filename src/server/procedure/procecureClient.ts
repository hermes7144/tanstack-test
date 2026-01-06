import { usePathnameContext } from '@/context/PathnameContext';

export function useProcedureClient() {
  const pathname = usePathnameContext();

  async function callProcedure(
    command: string,
    params: Record<string, any> = {}
  ) {
    if (!pathname) throw new Error('pathname not found');

    // 1️⃣ pathname → API URL
    const apiPath = '/api' + pathname.toUpperCase();

    // 2️⃣ fetch 호출
    const res = await fetch(apiPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command, params }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || 'Procedure call failed');
    }

    return res.json();
  }

  return { callProcedure };
}
