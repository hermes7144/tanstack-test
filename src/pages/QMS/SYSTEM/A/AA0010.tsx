import { EditableCell } from '@/components/grid/EditableCell';
import { Grid } from '@/components/grid/Grid';
import { selectColumn } from '@/components/grid/selectColumn';
import React, { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function AA0010() {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([
    { compCd: '1000', deptCd: 'A', userId: 'A01', userName: '홍길동', userNickname: 'test', _rowKey: uuidv4() },
    { compCd: '1000', deptCd: 'A', userId: 'A02', userName: '김철수', userNickname: 'test', _rowKey: uuidv4() },
  ]);

  const columns = useMemo(() => [
    selectColumn,
    { accessorKey: 'userId', header: '사용자 ID', cell: EditableCell },
    { accessorKey: 'userName', header: '사용자명', cell: EditableCell },
    { accessorKey: 'userNickname', header: '별명', cell: EditableCell },
  ], []);

  const handleSelectionChange = (rows: any) => {
    setSelectedUsers(rows);
  };

    const handleButtonClick = () => {
    console.log('버튼 클릭 - 체크된 값:', selectedUsers);
    
  };

  return (
    <>
    
        <Grid
      data={users}
      columns={columns}
      onSelectionChange={handleSelectionChange}
    />
          <button onClick={handleButtonClick} style={{ marginTop: 10 }}>
        체크된 값 가져오기
      </button>
      </>
  );
}
