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

  displayCountry() {
    if (!this.state.countryList) {
      return <div>Loading...</div>;
    } else {
      const countryEl = this.state.countryList.map((country) => {
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
      });
      return countryEl;
    }
  }

  render() {
    return (
      <nav className="sidebar">
        <h1>Select a country</h1>
        {this.displayCountry()}
      </nav>
    );
  }
}

export default Sidebar;
