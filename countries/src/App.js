import "./App.css";
import React, { useState, useEffect } from "react";
import CountryDisplay from "./CountryDisplay";
import Sidebar from "./Sidebar";

function App() {
  const [countryCode, setCountryCode] = useState("");
  const [displayData, setDisplayData] = useState([]);

  async function handleClick(e) {
    console.log(`countryCodePassed is ${e.target.id}`);
    const countryCodePassed = e.target.id;
    setCountryCode(countryCodePassed);
  }

  useEffect(() => {
    if (countryCode.length > 0) {
      const empty = [];
      empty.push(
        <CountryDisplay key={countryCode} countryCode={countryCode} />
      );
      setDisplayData(empty);
    }
  }, [countryCode]); //LOOK INTO THIS

  // function displayCountryData() {
  //   const empty = [];
  //   empty.push(<CountryDisplay key={countryCode} countryCode={countryCode} />);
  //   setDisplayData(empty);
  // }

  return (
    <div className="App">
      <Sidebar handleClick={handleClick} />
      {/* {console.log(countryCode)} */}
      {/* <CountryDisplay countryCode={countryCode} /> */}
      {displayData}
    </div>
  );
}

export default App;