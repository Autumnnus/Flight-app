import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const navigateRotate = (path) => {
    navigate(path);
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden rounded-3xl mt-6">
      {/* Background with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      />
      <div className="absolute inset-0 hero-gradient z-10" />

      {/* Hero Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl animate-fade-in">
        <h1 className="text-5xl md:text-7xl text-white mb-6 drop-shadow-2xl">
          Elevate Your <span className="text-blue-400">Journey</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-200 mb-12 max-w-2xl mx-auto drop-shadow-lg font-light">
          Track flights in real-time with our premium aviation dashboard.
          Seamless scheduling, precise data.
        </p>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 justify-center">
          <button
            onClick={() => navigateRotate("/departures")}
            className="group relative overflow-hidden px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95"
          >
            <span className="relative z-10 flex items-center">
              Departures
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </button>

          <button
            onClick={() => navigateRotate("/arrivals")}
            className="glass-dark border-white/30 px-8 py-4 text-white rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-white/20 hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] active:scale-95 flex items-center justify-center"
          >
            Arrivals
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2 rotate-180"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Decor Elements */}
      <div className="absolute bottom-10 left-10 text-white/50 text-sm hidden md:block">
        GLOBAL FLIGHT TRACKER v2.0
      </div>
    </div>
  );
};

export default Home;
