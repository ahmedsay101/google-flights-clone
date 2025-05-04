import { useState } from "react";
import axios from "axios";
import "./App.css";
import Flights from "./Flights/Flights";
import FlightsImage from './assets/flights.svg'; 
import SearchBar from "./Components/SearchBar/SearchBar";
import { formatDateRange, formatDuration, getStopText } from "./utils";
import { images } from "./utils/constants";

function App() {
  const [origin, setOrigin] = useState("");
  const [originEntityId, setOriginEntityId] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationEntityId, setDestinationEntityId] = useState("");
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cabinClass, setCabinClass] = useState("economy");
  const [tripType, setTripType] = useState("oneway");
  const [adults, setAdults] = useState(1);

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchFlights = async () => {
    setLoading(true);
    try {
      if(!origin || !destination || !originEntityId || !destinationEntityId) return false;
      const response = await axios.get("https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlightsComplete", {
        params: {
          originSkyId: origin,
          destinationSkyId: destination,
          originEntityId: originEntityId,
          destinationEntityId: destinationEntityId,
          date: date,
          cabinClass: cabinClass,
          adults: adults.toString(),
          sortBy: 'best',
          currency: 'USD',
          market: 'en-US',
          countryCode: 'US', 
        },
        headers: {
          "X-RapidAPI-Key": import.meta.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com"
        }
      });

      const results = response.data.data;
      const itineraries = results.itineraries; 

      if(!itineraries.length) return false;
      
      const flightsData = itineraries.map(item => {
        const leg = item.legs[0];
        const originCity = leg.origin.city;
        const destinationCity = leg.destination.city;
        const dateRange = formatDateRange(leg.departure, leg.arrival);
        const stops = getStopText(leg.stopCount);
        const duration = formatDuration(leg.durationInMinutes);
        const price = `EGP ${Math.round(item.price.raw * 31.3).toLocaleString()}`;
        const destinationImage = images.find(one => one.city.toLowerCase() === destinationCity.toLowerCase())?.img || "";

        return {
          originCity,
          destinationCity,
          dateRange,
          stops,
          duration,
          price,
          destinationImage,
        }
      });

      setFlights(flightsData);
    } catch (error) {
      console.error("Flight fetch failed:", error.response?.data || error.message);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <img src={FlightsImage} />
      <h1 className="title">Flights Clone</h1>
      <SearchBar 
        date={date}
        returnDate={returnDate}
        cabinClass={cabinClass}
        setCabinClass={setCabinClass}
        adults={adults}
        tripType={tripType}
        setTripType={setTripType}
        setAdults={setAdults}
        setDate={setDate}
        setReturnDate={setReturnDate}
        setOrigin={setOrigin} 
        setOriginEntityId={setOriginEntityId}
        setDestination={setDestination}
        setDestinationEntityId={setDestinationEntityId}
        searchFlights={searchFlights}
      />

      <div className="results">
        {loading ? <span>Loading...</span> : flights?.length > 0 ? <Flights flights={flights} /> : "No Results Found"}
      </div>
    </div>
  );
}

export default App;