import React from "react";
import "./App.css";

class CountryDisplay extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      countryData: null,
      countryCode: this.props.countryCode,
    };
  }

  showCountry = this.showCountry.bind(this);

  async componentDidMount() {
    // console.log(this.state.countryCode);
    const apiResponse = await fetch(
      `https://restcountries.eu/rest/v2/alpha/${this.state.countryCode}?fields=name;capital;population;flag;languages;currencies;subregion;timezones`
    );
    const countryData = await apiResponse.json();

    this.setState({ countryData });
  }

  showCountry() {
    if (!this.state.countryData) {
      return <div>Loading...</div>;
    } else {
      return (
        <section className="main">
          <h4>
            <span className="label">{this.state.countryData.subregion}</span>
          </h4>
          <h1>
            <span id="name">{this.state.countryData.name}</span>
          </h1>
          <img
            className="flag"
            src={this.state.countryData.flag}
            alt="Flag"
          ></img>
          <h3>
            <span className="label">Capital:</span>{" "}
            {`${this.state.countryData.capital}`}
          </h3>
          <h3>
            <span className="label">Population:</span>{" "}
            {`${this.state.countryData.population.toLocaleString("en-US")}`}
          </h3>
          <h3>
            <span className="label">Language:</span>{" "}
            {`${this.state.countryData.languages[0].name}`}
          </h3>
          <h3>
            <span className="label">Currency:</span>{" "}
            {`${this.state.countryData.currencies[0].name}`}
          </h3>
          <h3>
            <span className="label">Timezone:</span>{" "}
            {this.state.countryData.timezones
              .toLocaleString("en-US")
              .replaceAll(",", ", ")}
          </h3>
        </section>
      );
    }
  }

  render() {
    return this.showCountry();
  }
}

export default CountryDisplay;
