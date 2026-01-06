import { EditableCell } from '@/components/grid/EditableCell';
import { Grid } from '@/components/grid/Grid';
import { selectColumn } from '@/components/grid/selectColumn';
import React, { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function AA0010() {
  // 🔹 초기 데이터
  const initialData = [
    { compCd: '1000', deptCd: 'A', userId: 'A01', userName: '홍길동', userNickname: 'test', _rowKey: uuidv4() },
    { compCd: '1000', deptCd: 'A', userId: 'A02', userName: '김철수', userNickname: 'test', _rowKey: uuidv4() },
  ];

  // 🔹 상태
  const [data, setData] = useState(initialData);
  const [selectedData, setSelectedData] = useState<typeof data>([]);
  const [dirtyMap, setDirtyMap] = useState<Record<string, boolean>>({}); // 변경 추적

  // 🔹 셀 업데이트 + dirtyMap 기록
  const updateData = (rowKey: string, columnId: string, value: string) => {
    setData(prev =>
      prev.map(d => (d._rowKey === rowKey ? { ...d, [columnId]: value } : d))
    );
    setDirtyMap(prev => ({ ...prev, [rowKey]: true })); // 변경된 row 표시
  };

  // 🔹 컬럼 정의
  const columns = useMemo(
    () => [
      selectColumn,
      { accessorKey: 'userId', header: '사용자 ID', cell: (info) => <EditableCell {...info} updateData={updateData} /> },
      { accessorKey: 'userName', header: '사용자명', cell: (info) => <EditableCell {...info} updateData={updateData} /> },
      { accessorKey: 'userNickname', header: '별명', cell: (info) => <EditableCell {...info} updateData={updateData} /> },
    ],
    []
  );

  // 🔹 선택 변경 콜백
  const handleSelectionChange = (rows: typeof data) => {
    setSelectedData(rows);
  };

  const handleAddRow = () => {
  const lastRow = data[data.length - 1];

  if (!lastRow) return;

  // 마지막 행 구조를 참고해서 모든 컬럼 빈값으로 초기화
  const newRow: typeof lastRow = Object.keys(lastRow).reduce((acc, key) => {
    acc[key] = key === '_rowKey' ? uuidv4() : ''; // _rowKey만 새로 생성
    return acc;
  }, {} as any);

  setData(prev => [...prev, newRow]);
  setDirtyMap(prev => ({ ...prev, [newRow._rowKey]: true })); // 새로 추가된 행도 dirty 표시
};

  // 🔹 버튼 클릭 – 체크된 데이터
  const handleButtonClick = () => {
    console.log('선택된 값:', selectedData);
  };

  // 🔹 변경된 데이터만 가져오기
  const handleGetChanged = () => {
    const changedRows = data.filter(d => dirtyMap[d._rowKey]);
    console.log('변경된 행:', changedRows);
  };

  return (
    <>
      <Grid
        data={data}
        columns={columns}
        onSelectionChange={handleSelectionChange}
        dirtyMap={dirtyMap} // 🔹 변경된 행 강조
      />
      <div style={{ marginTop: 10 }}>
  <button onClick={handleAddRow} style={{ marginRight: 10 }}>
    행 추가
  </button>
  <button onClick={handleButtonClick} style={{ marginRight: 10 }}>
    체크된 값 가져오기
  </button>
  <button onClick={handleGetChanged}>
    변경된 값 가져오기
  </button>
</div>
    </>
  );
}
