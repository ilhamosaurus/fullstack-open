import { useEffect, useState } from "react";
import axios from "axios";
import CountryDisplay from "./components/CountryDisplay";
import Results from "./components/Results";

const Notification = ({ message }) => {
  if (!message) {
    return null;
  }

  return <div className="error">{message}</div>;
};

const App = () => {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [changeMessage, setChangeMessage] = useState("");

  useEffect(() => {
    if (query.trim() === "") {
      setCountries([]);
      setSelectedCountry(null);
      return;
    }

    axios
      .get(`https://restcountries.com/v3.1/name/${query}`)
      .then((res) => {
        const data = res.data;
        if (data.length > 10) {
          setChangeMessage("Too many matches, specify another filter");
        } else if (data.length === 1) {
          setCountries([]);
          setSelectedCountry(data[0]);
        } else {
          setCountries(data);
          setSelectedCountry(null);
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, [query]);

  const handleSelectedCountry = (country) => {
    setSelectedCountry(country);
  };
  const handleFilter = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div>
      <h1>Country Information App</h1>
      <input
        type="text"
        placeholder="Search for a country"
        value={query}
        onChange={handleFilter}
      />
      <Notification message={changeMessage} />
      {selectedCountry ? (
        <CountryDisplay country={selectedCountry} />
      ) : (
        <Results
          countries={countries}
          onSelectCountry={handleSelectedCountry}
        />
      )}
    </div>
  );
};

export default App;
