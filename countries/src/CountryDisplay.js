import React from "react";

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
          <h4>{this.state.countryData.subregion}</h4>
          <h1>{this.state.countryData.name}</h1>
          <img
            className="flag"
            src={this.state.countryData.flag}
            alt="Flag"
          ></img>
          <h3>Capital: {`${this.state.countryData.capital}`}</h3>
          <h3>
            Population:{" "}
            {`${this.state.countryData.population.toLocaleString()}`}
          </h3>
          <h3>Language: {`${this.state.countryData.languages[0].name}`}</h3>
          <h3>Currency: {`${this.state.countryData.currencies[0].name}`}</h3>
          <h3>Timezone: {this.state.countryData.timezones}</h3>
        </section>
      );
    }
  }

  render() {
    return this.showCountry();
  }
}

export default CountryDisplay;
