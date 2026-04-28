import { NavLink } from "react-router";

const navigationItems = [
  { label: "Overview", to: "/" },
  { label: "Aircraft", to: "/aircrafts" },
  { label: "Types", to: "/aircraft-type" },
  { label: "Flights", to: "/flights" },
  { label: "Map", to: "/map" },
];

export default function Menu() {
  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--panel-border)] bg-[rgba(17,21,15,0.92)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <NavLink to="/" className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center border border-[var(--panel-border)] bg-[var(--panel-alt)] text-sm font-semibold text-[var(--accent-strong)]">
            AS
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--text-subtle)]">
              Tactical Control
            </p>
            <p className="text-xl font-semibold text-[var(--text-main)]">
              Air Simulator
            </p>
          </div>
        </NavLink>

        <div className="flex flex-wrap gap-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `border px-4 py-2 text-sm font-medium ${
                  isActive
                    ? "border-[var(--accent)] bg-[rgba(143,154,104,0.14)] text-[var(--accent-strong)]"
                    : "border-[var(--panel-border-soft)] bg-[rgba(35,43,32,0.45)] text-[var(--text-muted)] hover:border-[var(--panel-border)] hover:text-[var(--text-main)]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
