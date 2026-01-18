import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaPlaneArrival,
  FaPlaneDeparture,
} from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import {
  getAircrafttypes,
  getAirlines,
  getDestinations,
  getFlightStatus,
} from "../../../config/config";
import {
  setLoadingAircraft,
  setLoadingAirline,
  setLoadingDestination,
  setRotateParam,
  setSearchParam,
} from "../../../redux/reducerSlice";
import EarlierFlightsComp from "./EarlierFlightsComp";
import LaterFlightsComp from "./LaterFlightsComp";

const Flights = ({ rotate }) => {
  Flights.propTypes = {
    rotate: PropTypes.string.isRequired,
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const flights = useSelector((state) => state.reducer.flights);
  const rotateDetail = useSelector((state) => state.reducer.rotateParam);

  const [airlineData, setAirlineData] = useState([]);
  const [destinationData, setDestinationData] = useState([]);
  const [airCraftData, setAirCraftData] = useState([]);

  const loadingAirline = useSelector((state) => state.reducer.loadingAirline);
  const loadingDestination = useSelector(
    (state) => state.reducer.loadingDestination,
  );
  const loadingAircraft = useSelector((state) => state.reducer.loadingAircraft);

  const isLoading = !loadingAircraft || !loadingAirline || !loadingDestination;

  useEffect(() => {
    if (rotate === "D") {
      dispatch(setRotateParam("departures"));
    } else if (rotate === "A") {
      dispatch(setRotateParam("arrivals"));
    }

    const fetchDatas = async () => {
      if (!flights || flights.length === 0) return;

      try {
        const airlinePromises = flights.map((f) => getAirlines(f.prefixIATA));
        const destinationPromises = flights.map((f) =>
          getDestinations(f.route.destinations[0]),
        );
        const airCraftPromises = flights.map((f) =>
          getAircrafttypes(f.aircraftType?.iataMain, f.aircraftType?.iataSub),
        );

        const [resolvedAirlines, resolvedDestinations, resolvedAircraft] =
          await Promise.all([
            Promise.all(airlinePromises),
            Promise.all(destinationPromises),
            Promise.all(airCraftPromises),
          ]);

        setAirlineData(resolvedAirlines);
        setDestinationData(resolvedDestinations);
        setAirCraftData(resolvedAircraft);

        dispatch(setLoadingAirline(true));
        dispatch(setLoadingDestination(true));
        dispatch(setLoadingAircraft(true));
      } catch (error) {
        console.error("Error fetching flight metadata:", error);
      }
    };

    fetchDatas();
    dispatch(setSearchParam(location.search));
  }, [flights, rotate, dispatch, location.search]);

  const navigateFlightDetail = (flightId) => {
    navigate(`/${rotateDetail}/flight/${flightId}`);
  };

  const navigateRotate = (path) => {
    dispatch(setLoadingAirline(false));
    dispatch(setLoadingDestination(false));
    dispatch(setLoadingAircraft(false));
    navigate(path);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] glass rounded-3xl animate-pulse">
          <PulseLoader color="#2563eb" size={15} margin={2} />
          <p className="mt-6 text-slate-500 font-medium tracking-wide">
            Retrieving flight manifest...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* View Toggle */}
          <div className="flex p-1.5 bg-slate-200/50 backdrop-blur-sm rounded-2xl w-fit">
            <button
              onClick={() => navigateRotate("/departures")}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                rotate === "D"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <FaPlaneDeparture
                className={rotate === "D" ? "text-blue-600" : ""}
              />
              <span>Departures</span>
            </button>
            <button
              onClick={() => navigateRotate("/arrivals")}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                rotate === "A"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <FaPlaneArrival
                className={rotate === "A" ? "text-blue-600" : ""}
              />
              <span>Arrivals</span>
            </button>
          </div>

          <EarlierFlightsComp rotate={rotate} />

          <div className="grid grid-cols-1 gap-4">
            {flights && flights.length > 0 ? (
              flights.map((flight, index) => (
                <div
                  key={flight.id}
                  className="card-premium group hover:ring-2 hover:ring-blue-500/20"
                >
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Time & Flight Info */}
                    <div className="flex items-center space-x-8 w-full md:w-auto">
                      <div className="text-center">
                        <p className="text-3xl font-black text-slate-800 tabular-nums">
                          {flight.scheduleTime.substring(0, 5)}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          Scheduled
                        </p>
                      </div>
                      <div className="h-10 w-px bg-slate-200" />
                      <div>
                        <p className="text-xl font-bold text-slate-800 flex items-center">
                          {destinationData[index]?.city || "Loading..."}
                          <span className="ml-2 text-blue-600">
                            ({destinationData[index]?.iata || "---"})
                          </span>
                        </p>
                        <p className="text-sm text-slate-400 font-medium">
                          {airlineData[index]?.publicName || "Airline"} •{" "}
                          {flight.flightName}
                        </p>
                      </div>
                    </div>

                    {/* Aircraft & Status */}
                    <div className="flex items-center space-x-8 w-full md:w-auto justify-between md:justify-end">
                      <div className="hidden lg:block text-right">
                        <p className="text-sm font-bold text-slate-600">
                          {airCraftData[index]?.aircraftTypes?.[0]
                            ?.shortDescription || "---"}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          Aircraft Type
                        </p>
                      </div>

                      <div className="min-w-[120px] text-center">
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                            getFlightStatus(flight) === "On Time"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {getFlightStatus(flight)}
                        </span>
                      </div>

                      <button
                        onClick={() => navigateFlightDetail(flight.id)}
                        className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm"
                      >
                        <FaArrowRight />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 glass rounded-3xl">
                <p className="text-slate-400 font-medium">
                  No flights found for this schedule.
                </p>
              </div>
            )}
          </div>

          <LaterFlightsComp rotate={rotate} />
        </div>
      )}
    </div>
  );
};

export default Flights;
