// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import './App.css';
import Home from "./frontend/Home.js";
import MyCourses from "./frontend/MyCourses.js";
import NotFound from "./frontend/NotFound.js";
import Login from "./frontend/components/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/my-courses" element={<MyCourses />}/>
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
