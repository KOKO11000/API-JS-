import { Link } from "react-router";

export default function Menu() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-white/20 bg-linear-to-r from-slate-900/50 to-blue-900/50 backdrop-blur-xl sticky top-0 z-40">

      <Link 
        to="/" 
        className="flex items-center gap-2 group"
      >
        <div className="w-10 h-10 rounded-lg bg-linear-to-br from-sky-400 to-blue-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
          <span className="text-white font-bold">✈</span>
        </div>
        <span className="text-2xl font-bold bg-linear-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">Air Force</span>
      </Link>

      <ul className="flex gap-8 text-lg font-semibold">
        <li>
          <Link 
            to="/aircrafts" 
            className="text-gray-300 hover:text-sky-400 transition-colors duration-300 relative group"
          >
            Aircrafts
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-sky-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </li>
        <li>
          <Link 
            to="/aircraft-type" 
            className="text-gray-300 hover:text-sky-400 transition-colors duration-300 relative group"
          >
            Types
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-sky-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </li>
        <li>
          <Link 
            to="/flights" 
            className="text-gray-300 hover:text-sky-400 transition-colors duration-300 relative group"
          >
            Flights
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-sky-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </li>
      </ul>

      <div className="w-30"></div>
    </nav>
  );
}
