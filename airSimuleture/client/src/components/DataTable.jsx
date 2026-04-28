import { Pencil, Plus, Trash2 } from "lucide-react";

export default function DataTable({
  data = [],
  columns = [],
  onEdit,
  onDelete,
  onAdd,
  title = "Operational Records",
  subtitle = "Manage active data from one place.",
  addLabel = "Add Record",
}) {
  const showActions = Boolean(onEdit || onDelete);
  const gridColumns = `repeat(${columns.length + (showActions ? 1 : 0)}, minmax(0, 1fr))`;

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-subtle)]">
            Registry
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-[var(--text-main)]">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">{subtitle}</p>
        </div>

        {onAdd && (
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 border border-[var(--accent)] bg-[rgba(143,154,104,0.14)] px-4 py-3 text-sm font-semibold text-[var(--accent-strong)] hover:bg-[rgba(143,154,104,0.22)]"
          >
            <Plus size={18} />
            {addLabel}
          </button>
        )}
      </div>

      <div className="panel overflow-hidden">
        <div
          className="hidden border-b border-[var(--panel-border)] bg-[rgba(35,43,32,0.7)] px-5 py-4 text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)] md:grid"
          style={{ gridTemplateColumns: gridColumns }}
        >
          {columns.map((column) => (
            <div key={column.key}>{column.header}</div>
          ))}
          {showActions ? <div>Actions</div> : null}
        </div>

        {data.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-[var(--text-muted)]">
            No records available.
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              {data.map((row) => (
                <div
                  key={row.id}
                  className="grid items-center border-t border-[var(--panel-border-soft)] px-5 py-4 text-sm text-[var(--text-main)]"
                  style={{ gridTemplateColumns: gridColumns }}
                >
                  {columns.map((column) => (
                    <div key={column.key} className="truncate pr-3">
                      {row[column.key]}
                    </div>
                  ))}
                  {showActions ? (
                    <div className="flex items-center gap-2">
                      {onEdit ? (
                        <button
                          onClick={() => onEdit(row)}
                          className="border border-[var(--panel-border)] bg-[var(--panel-alt)] p-2 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                        >
                          <Pencil size={16} />
                        </button>
                      ) : null}
                      {onDelete ? (
                        <button
                          onClick={() => onDelete(row)}
                          className="border border-[rgba(183,93,74,0.3)] bg-[rgba(183,93,74,0.08)] p-2 text-[#d6a596] hover:bg-[rgba(183,93,74,0.14)]"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="space-y-3 p-4 md:hidden">
              {data.map((row) => (
                <article key={row.id} className="panel-soft space-y-3 p-4">
                  {columns.map((column) => (
                    <div key={column.key} className="flex items-start justify-between gap-4 text-sm">
                      <span className="text-[var(--text-subtle)]">{column.header}</span>
                      <span className="text-right text-[var(--text-main)]">{row[column.key]}</span>
                    </div>
                  ))}
                  {showActions ? (
                    <div className="flex justify-end gap-2 border-t border-[var(--panel-border-soft)] pt-3">
                      {onEdit ? (
                        <button
                          onClick={() => onEdit(row)}
                          className="border border-[var(--panel-border)] bg-[var(--panel-alt)] p-2 text-[var(--text-muted)]"
                        >
                          <Pencil size={16} />
                        </button>
                      ) : null}
                      {onDelete ? (
                        <button
                          onClick={() => onDelete(row)}
                          className="border border-[rgba(183,93,74,0.3)] bg-[rgba(183,93,74,0.08)] p-2 text-[#d6a596]"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
