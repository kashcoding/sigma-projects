import React from "react";

class Form extends React.Component {
  initialState = {
    name: "",
    house: "",
  };
  state = this.initialState;
  submitForm = this.submitForm.bind(this);
  houses = ["gryffindor", "hufflepuff", "ravenclaw", "slytherin"];

  handleChange(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  }

  submitForm() {
    if (
      this.state.name.trim().length > 0 &&
      this.houses.includes(this.state.house.toLowerCase())
    ) {
      this.props.handleSubmit(this.state);
      this.setState(this.initialState);
    }
  }

  render() {
    let { name, house } = this.state;
    console.log(house.length);
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
        <input
          type="text"
          name="house"
          id="house"
          value={house}
          onChange={(e) => this.handleChange(e)}
        />
        <input type="button" value="Submit" onClick={this.submitForm} />
      </form>
    );
  }
}

export default Form;
