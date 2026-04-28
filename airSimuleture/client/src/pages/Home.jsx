import { Link } from "react-router";
import Menu from "../components/home/Menu";

const modules = [
  {
    title: "Fleet Registry",
    description: "Maintain aircraft records and readiness from one controlled workspace.",
    link: "/aircrafts",
  },
  {
    title: "Type Catalog",
    description: "Manage aircraft classes, performance limits and fuel capacity.",
    link: "/aircraft-type",
  },
  {
    title: "Mission Board",
    description: "Track current flights, schedule departures and review locations.",
    link: "/flights",
  },
  {
    title: "Operations Map",
    description: "Observe flight routes and monitor the theater in real time.",
    link: "/map",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Menu />

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="panel p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-subtle)]">
              Command Overview
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-[var(--text-main)] lg:text-6xl">
              Air operation control built for a cleaner mission workflow.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-muted)]">
              The client is now aligned around fleet data, type data and flight data so every screen can speak the same language as the server.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/flights"
                className="border border-[var(--accent)] bg-[rgba(143,154,104,0.14)] px-5 py-3 text-sm font-semibold text-[var(--accent-strong)]"
              >
                Open Mission Board
              </Link>
              <Link
                to="/map"
                className="border border-[var(--panel-border)] bg-[var(--panel-alt)] px-5 py-3 text-sm font-semibold text-[var(--text-main)]"
              >
                Open Operations Map
              </Link>
            </div>
          </div>

          <div className="panel p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-subtle)]">
              Control Status
            </p>
            <div className="mt-6 space-y-5">
              <div className="panel-soft p-4">
                <p className="text-sm text-[var(--text-subtle)]">Data Flow</p>
                <p className="mt-2 text-2xl font-semibold text-[var(--text-main)]">Server and client synced</p>
              </div>
              <div className="panel-soft p-4">
                <p className="text-sm text-[var(--text-subtle)]">UI Direction</p>
                <p className="mt-2 text-2xl font-semibold text-[var(--text-main)]">Military professional theme</p>
              </div>
              <div className="panel-soft p-4">
                <p className="text-sm text-[var(--text-subtle)]">Code Style</p>
                <p className="mt-2 text-2xl font-semibold text-[var(--text-main)]">Clear names and lean structure</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {modules.map((module) => (
            <Link key={module.link} to={module.link} className="panel p-6 transition hover:border-[var(--accent)]">
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-subtle)]">
                Module
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-[var(--text-main)]">
                {module.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                {module.description}
              </p>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
