// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import './App.css';
import Home from "./frontend/pages/Home.js";
import MyCourses from "./frontend/pages/MyCourses.js";
import NotFound from "./frontend/pages/misc/NotFound.js";
import CourseDetail from "./frontend/pages/CourseDetail.js";
import Login from "./frontend/pages/Login.js";
import Register from "./frontend/pages/Register.js";
import Header from "./frontend/elements/Header.js";
import SearchResult from "./frontend/pages/SearchResult.js";
import Learning from "./frontend/pages/Learning.js";
import Dashboard from "./frontend/pages/admin/dashboard.js";
import Profile from "./frontend/pages/Profile.js";
import CourseManagement from "./frontend/pages/admin/CourseManagement.js";

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
        <Route path="/register" element={<Register />}/>
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
        <Route path="/learning" element={<>
          <Learning />
        </>}/>
        <Route path="/profile/:id" element={<>
          <Header />
          <Profile />
        </>}/>
        <Route path="/admin" element={<>
          <Dashboard />
        </>
        }/>
        <Route path="/admin/course-management" element={<>
          <CourseManagement />
        </>
        }/>
        <Route path="*" element={<>
          <Header />
          <NotFound />
        </>}/>
      </Routes>
    </BrowserRouter>
  </>
}

export default App;
