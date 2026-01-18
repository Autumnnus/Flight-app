import { addDays, format, subDays } from "date-fns";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setQueryDate } from "../../redux/reducerSlice";

const UserSearch = () => {
  UserSearch.propTypes = {
    setQueryDate: PropTypes.func,
  };
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const today = new Date();
    const formattedDates = [];
    const locationDate = location.search.split("=")[1];

    const yesterday = subDays(today, 1);
    formattedDates.push({
      value: format(yesterday, "yyyy-MM-dd"),
      label: "Yesterday",
    });

    formattedDates.push({
      value: format(today, "yyyy-MM-dd"),
      label: "Today",
    });

    const tomorrow = addDays(today, 1);
    formattedDates.push({
      value: format(tomorrow, "yyyy-MM-dd"),
      label: "Tomorrow",
    });

    for (let i = 2; i <= 21; i++) {
      const date = addDays(today, i);
      formattedDates.push({
        value: format(date, "yyyy-MM-dd"),
        label: format(date, "d MMMM"),
      });
    }

    const initialDate = locationDate || formattedDates[1].value;
    setDates(formattedDates);
    setSelectedDate(initialDate);
    dispatch(setQueryDate(initialDate));
  }, [dispatch, location.search]);

  const setQueryDateFunc = (e) => {
    const date = new Date();
    const formatedDate = format(date, "yyyy-MM-dd");
    const selected = e.target.value;

    setSelectedDate(selected);
    dispatch(setQueryDate(selected));

    if (formatedDate === selected) {
      navigate(``);
    } else {
      navigate(`?datetime=${selected}`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 animate-fade-in">
      <div className="relative w-full md:w-auto min-w-[200px] group">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">
          Departure Date
        </label>
        <div className="relative">
          <select
            name="datetime"
            value={selectedDate}
            onChange={setQueryDateFunc}
            className="w-full appearance-none glass px-5 py-3.5 rounded-2xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            {dates.map((date, index) => (
              <option key={index} value={date.value} className="bg-white">
                {date.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex items-center space-x-6">
        <div className="text-right">
          <p className="text-sm font-bold text-slate-800">
            Sabiha Gökçen Int&apos;l
          </p>
          <p className="text-xs text-slate-400">Istanbul, TR (SAW)</p>
        </div>
        <div className="w-px h-8 bg-slate-200" />
        <div className="flex items-center space-x-2 text-blue-600">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
          </span>
          <span className="text-sm font-bold uppercase tracking-wider">
            Live Traffic
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
