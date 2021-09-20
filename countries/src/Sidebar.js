import React from "react";
import "./App.css";

class Sidebar extends React.Component {
  state = {
    countryList: null,
  };

  async componentDidMount() {
    const apiResponse = await fetch(
      "https://restcountries.eu/rest/v2/all?fields=name;alpha2Code;flag"
    );
    const countryList = await apiResponse.json();
    this.setState({ countryList });
  }
  displayCountry = this.displayCountry.bind(this);
  displayAlphabet = this.displayAlphabet.bind(this);

  changeBtnOnEnter(alpha2code, flag) {
    const countryBtn = document.getElementById(alpha2code);
    countryBtn.style.backgroundImage = `url('${flag}')`;
    countryBtn.style.backgroundSize = `contain`;
    countryBtn.style.fontSize = `14pt`;
    countryBtn.style.textShadow = "0 0 5px #000000, 0 0 5px #000000";
    countryBtn.style.opacity = `0.9`;
  }

  changeBtnOnLeave(alpha2code) {
    const countryBtn = document.getElementById(alpha2code);
    countryBtn.style.backgroundImage = `none`;
    countryBtn.style.fontSize = `12pt`;
    countryBtn.style.opacity = `1`;
    countryBtn.style.textShadow = "none";
  }

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
              onMouseEnter={() => {
                this.changeBtnOnEnter(country.alpha2Code, country.flag);
              }}
              onMouseLeave={() => this.changeBtnOnLeave(country.alpha2Code)}
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
