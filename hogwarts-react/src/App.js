import "./App.css";
import React from "react";
import Table from "./Table";
import Form from "./Form";

class App extends React.Component {
  state = {
    students: [],
  };
  handleSubmit = this.handleSubmit.bind(this);
  removeStudent = this.removeStudent.bind(this);

  removeStudent(index) {
    const { students } = this.state;

    this.setState({
      students: students.filter((student, i) => {
        return i !== index;
      }),
    });
  }

  handleSubmit(student) {
    this.setState({ students: [...this.state.students, student] });
  }

  render() {
    const { students } = this.state;

    return (
      <div className="container">
        <Table studentData={students} removeStudent={this.removeStudent} />
        <Form handleSubmit={this.handleSubmit} />
      </div>
    );
  }
}

export default App;
