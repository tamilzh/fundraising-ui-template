import React from "react";
import ReactDOM from "react-dom";
import Main from "./Main";


// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

ReactDOM.render( 
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById("root")
);