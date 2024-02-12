import axios from "axios";
import { useEffect, useState } from "react";

/* eslint-disable react/prop-types */
const CountryDisplay = ({ country }) => {
  const { name, capital, area, flags, languages } = country;
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const api_key = import.meta.env.VITE_WEATHER_KEY;
    //console.log(api_key);

    if (api_key) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}`
        )
        .then((res) => {
          //console.log(res.data);
          setWeather(res.data);
        })
        .catch((err) => {
          console.error("Error fetching weather data:", err);
        });
    }
  }, [capital]);

  let languagesArray = [];

  if (typeof languages === "object") {
    languagesArray = Object.values(languages);
  }

  return (
    <div>
      <h2>{name.common}</h2>
      <p>Capital: {capital}</p>
      <p>Area: {area} km2</p>
      <p>Languages: {languagesArray.join(", ")}</p>
      {weather && (
        <div>
          <h3>Weather in {capital}</h3>
          <p>
            {`Temperature: ${(weather.main.temp - 273.15).toFixed(2)} Celcius`}
          </p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt="weather icon"
          />
          <p>{`Description: ${weather.weather[0].description}`}</p>
        </div>
      )}
      <img
        src={flags.png}
        alt={`Flag of ${name.common}`}
        style={{ width: "200px" }}
      />
    </div>
  );
};

export default CountryDisplay;
