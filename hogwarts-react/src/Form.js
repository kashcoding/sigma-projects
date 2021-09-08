import React from "react";

class Form extends React.Component {
  initialState = {
    name: "",
    house: "",
  };
  state = this.initialState;
  submitForm = this.submitForm.bind(this);
  houses = [
    "Select a house",
    "Gryffindor",
    "Hufflepuff",
    "Ravenclaw",
    "Slytherin",
  ];

  handleChange(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  }

  submitForm() {
    if (
      this.state.name.trim().length > 0 &&
      this.state.house !== "Select a house"
    ) {
      this.props.handleSubmit(this.state);
      this.setState(this.initialState);
    }
  }

  render() {
    let { name, house } = this.state;
    return (
      <form>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => this.handleChange(e)}
        />
        <label htmlFor="house">House</label>
        <select
          name="house"
          id="house"
          value={house}
          onChange={(e) => this.handleChange(e)}
        >
          {this.houses.map((house, index) => {
            return (
              <option key={index} name="house" value={house}>
                {house}
              </option>
            );
          })}
        </select>
        <input type="button" value="Submit" onClick={this.submitForm} />
      </form>
    );
  }
}

export default Form;
