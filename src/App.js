import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";

import FTP from "./components/FTP";
// import FTP from "./components/Test";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <FTP />
      </BrowserRouter>
    </div>
  );
}
// function App() {
//   return (
//     <div className="App">
//       <BrowserRouter>
//         <FTP />
//       </BrowserRouter>
//     </div>
//   );
// }

export default App;
