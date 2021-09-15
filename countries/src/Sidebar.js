import React from "react";
import "./App.css";

class Sidebar extends React.Component {
  state = {
    countryList: null,
  };

  async componentDidMount() {
    const apiResponse = await fetch(
      "https://restcountries.eu/rest/v2/all?fields=name;alpha2Code"
    );
    const countryList = await apiResponse.json();
    this.setState({ countryList });
  }
  displayCountry = this.displayCountry.bind(this);
  displayAlphabet = this.displayAlphabet.bind(this);

  displayCountry(letter) {
    if (!this.state.countryList) {
      return <div>Loading...</div>;
    } else {
      const countryEl = this.state.countryList.map((country, i) => {
        if (country.name[0] === letter) {
          return (
            <input
              type="button"
              className="country-btn"
              id={country.alpha2Code}
              key={country.alpha2Code}
              value={country.name}
              onClick={this.props.handleClick}
            ></input>
          );
        }
        return null;
      });
      return countryEl;
    }
  }

  displayAlphabet() {
    const alphabet = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      // "X",
      "Y",
      "Z",
    ];

    if (!this.state.countryList) {
      return <div>Loading...</div>;
    } else {
      let newDiv = [];
      for (let i = 0; i < alphabet.length; i++) {
        newDiv.push(
          <div
            className="countries"
            key={`${alphabet[i]}-countries`}
            id={alphabet[i]}
          >
            <h2 id="letter">{alphabet[i]}</h2>
            <div id="scroll-btns">{this.displayCountry(alphabet[i])}</div>
          </div>
        );
      }
      return newDiv;
    }
  }

  render() {
    return (
      <nav className="sidebar">
        <h1 id="select">Select a country</h1>
        <div className="scroll">{this.displayAlphabet()}</div>
      </nav>
    );
  }
}

export default Sidebar;
