// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import './App.css';
import Home from "./frontend/Home.js";
import NotFound from "./frontend/NotFound.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
