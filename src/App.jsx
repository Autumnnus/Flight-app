import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/navbar/Header";
import { getFlights } from "./config/config";
import PageContainer from "./containers/PageContainer";
import Arrivals from "./pages/Arrivals";
import ArrivalsDetail from "./pages/ArrivalsDetail";
import Departures from "./pages/Departures";
import DeparturesDetail from "./pages/DeparturesDetail";
import Home from "./pages/Home";
import { getFlightsArr } from "./redux/reducerSlice";

function App() {
  const dispatch = useDispatch();
  const flights = useSelector((state) => state.reducer.flights);
  const queryDate = useSelector((state) => state.reducer.queryDate);
  const searchParam = useSelector((state) => state.reducer.searchParam);
  const [rotate, setRotate] = useState("");
  const searchParamValue = searchParam?.includes("=")
    ? searchParam.split("=")[1]
    : null;

  useEffect(() => {
    const targetDate = searchParamValue || queryDate;
    if (!targetDate) return;

    const date = new Date();
    const formatTimeComponent = (component) => {
      return component < 10 ? "0" + component : component;
    };
    const hours = formatTimeComponent(date.getHours());
    const minutes = formatTimeComponent(date.getMinutes());
    const fromDateTime = `${queryDate}T${hours}:${minutes}:00`;
    const fromDateTimeSpecialDate = `${searchParamValue}T00:00:00`;

    const fetchDatas = async () => {
      try {
        const dataFlight = await getFlights(
          targetDate,
          rotate,
          searchParamValue ? fromDateTimeSpecialDate : fromDateTime,
          null,
          0,
          "+scheduleTime",
        );
        dispatch(getFlightsArr(dataFlight?.flights));
      } catch (error) {
        console.error("Error fetching flights:", error);
      }
    };
    fetchDatas();
  }, [queryDate, rotate, searchParamValue, dispatch]);
  return (
    <div>
      <Router>
        <Header></Header>
        <PageContainer>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/departures"
              element={<Departures setRotate={setRotate}></Departures>}
            />
            <Route
              path="/arrivals"
              element={
                <Arrivals flights={flights} setRotate={setRotate}></Arrivals>
              }
            />
            <Route
              path="/departures/flight/:id"
              element={
                <DeparturesDetail
                  flights={flights}
                  setRotate={setRotate}
                ></DeparturesDetail>
              }
            />
            <Route
              path="/arrivals/flight/:id"
              element={
                <ArrivalsDetail
                  flights={flights}
                  setRotate={setRotate}
                ></ArrivalsDetail>
              }
            />
          </Routes>
        </PageContainer>
      </Router>
    </div>
  );
}

export default App;
