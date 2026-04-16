import { Pencil, Trash2, Plus } from "lucide-react";

export default function DataTable({ data = [], columns = [], onEdit, onDelete, onAdd }) {
  return (
    <div className="w-full mt-8 mb-8">

      {/* כותרת + כפתור הוספה */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Manage Data</h2>

        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-sky-500/50 transition-all duration-300 transform hover:scale-105"
          >
            <Plus size={20} />
            Add New
          </button>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden md:block bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 shadow-2xl">

        {/* Header */}
        <div className="grid bg-linear-to-r from-sky-600/30 to-blue-600/30 p-4 font-semibold text-white border-b border-white/20" style={{ gridTemplateColumns: `repeat(${columns.length + 1}, 1fr)` }}>
          {columns.map((col, i) => (
            <div key={i} className="text-sm uppercase tracking-wider">{col.header}</div>
          ))}
          <div className="text-sm uppercase tracking-wider">Actions</div>
        </div>

        {/* Rows */}
        {data.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No data available. Click "Add New" to create an entry.
          </div>
        ) : (
          data.map((item, index) => (
            <div
              key={index}
              className="grid p-4 border-t border-white/10 hover:bg-white/10 transition-all duration-200"
              style={{ gridTemplateColumns: `repeat(${columns.length + 1}, 1fr)` }}
            >
              {columns.map((col, i) => (
                <div key={i} className="text-gray-100">{item[col.key]}</div>
              ))}

              {/* Actions */}
              <div className="flex gap-3 justify-start">
                {onEdit && (
                  <button 
                    onClick={() => onEdit && onEdit(item)} 
                    className="p-2 hover:bg-yellow-500/20 hover:text-yellow-400 text-yellow-300 rounded-lg transition-all duration-200"
                  >
                    <Pencil size={18} />
                  </button>
                )}
                {onDelete && (
                  <button 
                    onClick={() => onDelete && onDelete(item)} 
                    className="p-2 hover:bg-red-500/20 hover:text-red-400 text-red-300 rounded-lg transition-all duration-200"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {data.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No data available. Click "Add New" to create an entry.
          </div>
        ) : (
          data.map((item, index) => (
            <div
              key={index}
              className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/20 hover:border-sky-400/50 transition-all duration-200 shadow-lg"
            >
              {columns.map((col, i) => (
                <div key={i} className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300 font-semibold">{col.header}</span>
                  <span className="text-gray-100">{item[col.key]}</span>
                </div>
              ))}

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/10">
                {onEdit && (
                  <button 
                    onClick={() => onEdit && onEdit(item)} 
                    className="p-2 hover:bg-yellow-500/20 hover:text-yellow-400 text-yellow-300 rounded-lg transition-all duration-200"
                  >
                    <Pencil size={18} />
                  </button>
                )}
                {onDelete && (
                  <button 
                    onClick={() => onDelete && onDelete(item)} 
                    className="p-2 hover:bg-red-500/20 hover:text-red-400 text-red-300 rounded-lg transition-all duration-200"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
