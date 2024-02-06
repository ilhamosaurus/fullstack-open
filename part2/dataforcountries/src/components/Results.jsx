/* eslint-disable react/prop-types */
const Results = ({ countries, onSelectCountry }) => {
  return (
    <div>
      {countries.map((country) => (
        <div key={country.name.common}>
          <p>{country.name.common}</p>
          <button onClick={() => onSelectCountry(country)}>Show details</button>
        </div>
      ))}
    </div>
  );
};

export default Results;
