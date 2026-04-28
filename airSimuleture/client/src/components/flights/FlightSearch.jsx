import { Search } from "lucide-react";

export default function FlightSearch({ value, onChange, resultCount }) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)]">
        Search Missions
      </label>
      <div className="flex items-center gap-3 border border-[var(--panel-border)] bg-[var(--panel-alt)] px-3 py-3">
        <Search size={16} className="text-[var(--text-subtle)]" />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Flight ID or aircraft name"
          className="w-full bg-transparent text-sm text-[var(--text-main)] outline-none placeholder:text-[var(--text-subtle)]"
        />
      </div>
      <p className="text-xs text-[var(--text-subtle)]">{resultCount} records visible</p>
    </div>
  );
}
