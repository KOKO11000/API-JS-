import { Link } from "react-router";

export default function Menu() {
  return (
    <nav className="flex items-center justify-between px-6 mt-5 border-b-2 pb-5 text-white">

      {/* לוגו שמאלי עם קישור חיצוני */}
      <a 
        href="/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2"
      >
        <img 
          src="/air-force.png" 
          alt="Air Force Logo" 
          className="w-10 h-10 object-contain"
        />
        <span className="text-xl font-bold">Air Force</span>
      </a>

      {/* תפריט */}
      <ul className="flex gap-8 text-xl font-semibold">
        <li><Link to="/aircrafts" className="hover:text-sky-400 transition">Aircrafts</Link></li>
        <li><Link to="/aircraft-type" className="hover:text-sky-400 transition">Aircraft Type</Link></li>
        <li><Link to="/flights" className="hover:text-sky-400 transition">Flights</Link></li>
      </ul>

      <div className="w-[120px]"></div>
    </nav>
  );
}
