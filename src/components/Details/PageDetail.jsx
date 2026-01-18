import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaDoorOpen,
  FaPlane,
  FaSuitcase,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import {
  getAircrafttypes,
  getAirlines,
  getDestinations,
  getFlightStatus,
  getFlightsById,
} from "../../config/config";

const PageDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathArray = location.pathname.split("/");
  const rotate = pathArray[pathArray.length - 3];
  const lastElement = pathArray[pathArray.length - 1];

  const [flight, setFlight] = useState("");
  const [destination, setDestination] = useState("");
  const [airlineData, setAirlineData] = useState("");
  const [airCraftData, setAirCraftData] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDatas = async () => {
      try {
        setIsLoading(true);
        const dataFlight = await getFlightsById(lastElement);
        if (!isMounted) return;
        setFlight(dataFlight);

        const [dataAirline, dataAircraft, dataDestinations] = await Promise.all(
          [
            getAirlines(dataFlight.prefixIATA),
            getAircrafttypes(
              dataFlight.aircraftType?.iataMain,
              dataFlight.aircraftType?.iataSub,
            ),
            getDestinations(dataFlight.route.destinations[0]),
          ],
        );

        if (!isMounted) return;
        setAirlineData(dataAirline);
        setAirCraftData(dataAircraft.aircraftTypes?.[0]);

        const destName =
          dataDestinations.city ||
          dataDestinations.publicName?.english ||
          "Unknown Destination";
        setDestination(destName);
      } catch (error) {
        console.error("Error fetching detail data:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchDatas();
    return () => {
      isMounted = false;
    };
  }, [lastElement]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] glass rounded-3xl animate-pulse mx-auto max-w-4xl mt-12">
        <PulseLoader color="#2563eb" size={12} />
        <p className="mt-4 text-slate-500 font-medium">
          Loading flight details...
        </p>
      </div>
    );
  }

  const status = getFlightStatus(flight);
  const statusColors = {
    "On Time": "bg-emerald-100 text-emerald-700",
    Delayed: "bg-rose-100 text-rose-700",
    Arrived: "bg-blue-100 text-blue-700",
    Scheduled: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-slate-400 hover:text-blue-600 font-bold mb-8 transition-colors group"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        <span>Go Back</span>
      </button>

      <div className="card-premium relative overflow-hidden">
        {/* Status Badge */}
        <div className="absolute top-8 right-8">
          <span
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-sm ${statusColors[status] || "bg-slate-100 text-slate-700"}`}
          >
            {status}
          </span>
        </div>

        {/* Header Section */}
        <div className="mb-12">
          <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-sm mb-2">
            Flight Information
          </p>
          <h1 className="text-4xl md:text-6xl text-slate-900 mb-4 tracking-tighter">
            {flight.flightName}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-1 bg-blue-600 rounded-full" />
            <p className="text-2xl text-slate-500 font-medium">{destination}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <InfoCard
            icon={<FaCalendarAlt className="text-blue-500" />}
            label="Date"
            value={flight.scheduleDate}
          />
          <InfoCard
            icon={<FaClock className="text-blue-500" />}
            label={
              rotate === "departures" ? "Departure Time" : "Scheduled Arrival"
            }
            value={flight.scheduleTime}
          />
          <InfoCard
            icon={<FaPlane className="text-blue-500" />}
            label="Airline"
            value={airlineData.publicName || flight.airlineCode}
          />
          <InfoCard
            icon={<FaPlane className="text-emerald-500" />}
            label="Aircraft"
            value={airCraftData?.shortDescription || "---"}
          />

          {rotate === "departures" ? (
            <InfoCard
              icon={<FaDoorOpen className="text-amber-500" />}
              label="Gate"
              value={flight.gate || "TBA"}
            />
          ) : (
            <InfoCard
              icon={<FaSuitcase className="text-amber-500" />}
              label="Baggage Belt"
              value={flight.baggageClaim?.belts[0] || "TBA"}
            />
          )}

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Service Type
            </p>
            <p className="text-lg font-bold text-slate-800">
              Commercial Passage
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-slate-100 text-center md:text-left">
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            Real-time flight data provided by Schiphol API. Times are subject to
            change based on actual carrier operational performance. Support
            available 24/7 at SKYTRACK terminal desks.
          </p>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="group p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300">
    <div className="flex items-center space-x-3 mb-3">
      <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </p>
    </div>
    <p className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
      {value}
    </p>
  </div>
);

InfoCard.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default PageDetail;
