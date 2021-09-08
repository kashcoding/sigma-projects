import React from "react";

const TableHeader = () => {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>House</th>
      </tr>
    </thead>
  );
};

const TableBody = (props) => {
  const rows = props.studentData.map((row, index) => {
    return (
      <tr key={index}>
        <td>
          {row.name[0].toUpperCase() + row.name.toLowerCase().substring(1)}
        </td>
        <td>{row.house}</td>
        <td>
          <button onClick={() => props.removeStudent(index)}>Delete</button>
        </td>
      </tr>
    );
  });
  return <tbody>{rows}</tbody>;
};

const Table = function (props) {
  const { studentData, removeStudent } = props;

  return (
    <table>
      <TableHeader />
      <TableBody studentData={studentData} removeStudent={removeStudent} />
    </table>
  );
};

export default Table;
