// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import './App.css';
import Home from "./frontend/pages/Home.js";
import MyCourses from "./frontend/pages/MyCourses.js";
import NotFound from "./frontend/pages/NotFound.js";
import CourseDetail from "./frontend/pages/CourseDetail.js";
import Login from "./frontend/pages/Login.js";
import Header from "./frontend/elements/Header.js";
import SearchResult from "./frontend/pages/SearchResult.js";

function App() {
  return <>
    <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<>
          <Header />
          <Home />
        </>
        }/>
        <Route path="/login" element={<Login />}/>
        <Route path="/my-courses" element={<>
          <Header />
          <MyCourses />
        </>}/>
        <Route path="/course/:id" element={<>
          <Header />
          <CourseDetail />
        </>}/>
        <Route path="/search" element={<>
          <Header />
          <SearchResult />
        </>} />
        <Route path="*" element={<>
          <Header />
          <NotFound />
        </>}/>
      </Routes>
    </BrowserRouter>
  </>
}

export default App;
