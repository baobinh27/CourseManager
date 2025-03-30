// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import './App.css';
import Home from "./frontend/pages/Home.js";
import MyCourses from "./frontend/pages/MyCourses.js";
import NotFound from "./frontend/pages/NotFound.js";
import CourseDetail from "./frontend/pages/CourseDetail.js";
import Header from "./frontend/elements/Header.js";

function App() {
  return <>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/my-courses" element={<MyCourses />}/>
        <Route path="/course/:id" element={<CourseDetail />}/>
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  </>
}

export default App;
