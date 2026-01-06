export const EditableCell = ({ getValue, row, column, updateData }: any) => {
  return (
    <input
      value={getValue() as string}
      onChange={e => updateData(row.original._rowKey, column.id, e.target.value)}
      style={{ width: '100%' }}
    />
  );
};
