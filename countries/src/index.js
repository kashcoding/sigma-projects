import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "./App.css";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <section className="kash">
      Built by <a href="https://github.com/kashcoding">Kasia Dutch</a> using{" "}
      <a href="https://reactjs.org/">React</a> and{" "}
      <a href="https://restcountries.eu/">RESTCountries API</a>
    </section>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
