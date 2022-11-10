
import React from "react";
import {BrowserRouter as Router,Route,Routes} from "react-router-dom"
import SearchPhotos from "./components/SearchPhotos";
import "./App.css"

function App() {
  
  return (
    <div className="App">
      <div className="container">
        {/* used Browser Router and Switch to jump from one componenet to another componenet */}
      
        <Router>
          <Routes>
                <Route path="/" element={<SearchPhotos/>}/>
           </Routes>
        </Router>
      </div>
    </div>
  );
}
export default App;