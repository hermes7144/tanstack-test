export function EditableCell({ getValue, row, column, table }: any) {
  const value = getValue();
  return (
    <input
      value={value}
      onChange={(e) => table.options.meta.updateCell(row.index, column.id, e.target.value)}
      className="border px-1 py-0.5 w-full"
    />
  );
}
