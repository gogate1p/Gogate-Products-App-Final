export function DemoTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} className="border-b border-slate-200 px-3 py-3 text-xs font-black uppercase tracking-wider text-slate-400">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="transition hover:bg-slate-50">
              {row.map((cell, j) => (
                <td key={j} className="border-b border-slate-100 px-3 py-4 font-semibold text-slate-600 last:text-slate-900">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}