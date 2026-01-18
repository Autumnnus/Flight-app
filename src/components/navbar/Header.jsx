import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="glass sticky top-4 z-50 mx-auto max-w-7xl rounded-2xl px-6 py-4 flex justify-between items-center shadow-lg border border-white/40">
      <div
        className="flex items-center space-x-2 cursor-pointer group"
        onClick={() => navigate("/")}
      >
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tighter">
          SKY<span className="text-blue-600">TRACK</span>
        </h1>
      </div>

      <nav className="hidden md:flex items-center space-x-8">
        <button
          onClick={() => navigate("/departures")}
          className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
        >
          Departures
        </button>
        <button
          onClick={() => navigate("/arrivals")}
          className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
        >
          Arrivals
        </button>
        <button className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all active:scale-95 shadow-md">
          Support
        </button>
      </nav>

      {/* Mobile Menu Icon */}
      <div className="md:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-slate-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </div>
    </header>
  );
};

export default Header;
