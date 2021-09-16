import "./App.css";
import React, { useState, useEffect } from "react";
import CountryDisplay from "./CountryDisplay";
import Sidebar from "./Sidebar";

function App() {
  const [countryCode, setCountryCode] = useState("");
  const [displayData, setDisplayData] = useState([]);

  async function handleClick(e) {
    const countryCodePassed = e.target.id;
    setCountryCode(countryCodePassed);
  }

  useEffect(() => {
    if (countryCode.length > 0) {
      const empty = []; //Berkan named this
      empty.push(
        <CountryDisplay key={countryCode} countryCode={countryCode} />
      );
      setDisplayData(empty);
    }
  }, [countryCode]); //LOOK INTO THIS

  return (
    <div className="App">
      <Sidebar handleClick={handleClick} />
      {displayData}
    </div>
  );
}

export default App;
