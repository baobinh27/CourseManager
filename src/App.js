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
import Teaching from "./frontend/pages/teacher/Teaching.js";
import CreateCourse from "./frontend/pages/teacher/CreateCourse.js";
import GuidePage from "./frontend/pages/teacher/GuidePage.js";
import CourseApproval from "./frontend/pages/admin/CourseApproval.js";
import CourseApprovalDetail from "./frontend/pages/admin/CourseApprovalDetail.js";
import Purchase from "./frontend/pages/Purchase.js";

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
        <Route path="/purchase" element={<>
          <Header />
          <Purchase />
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
        <Route path="/teaching" element={<>
          <Header />
          <Teaching />
        </>}/>
        <Route path="/teaching/guide" element={<>
          <Header />
          <GuidePage />
        </>}/>
        <Route path="/teaching/create" element={<>
          <CreateCourse />
        </>}/>
        <Route path="/admin" element={<>
          <Dashboard />
        </>}/>
        <Route path="/admin/course-management" element={<>
          <CourseManagement />
        </>}/>
        <Route path="/admin/course-approval" element={<>
          <CourseApproval />
        </>}/>
        <Route path="/admin/course-approval/:id" element={<>
          <CourseApprovalDetail />
        </>}/>
        <Route path="*" element={<>
          <NotFound />
        </>}/>
      </Routes>
    </BrowserRouter>
  </>
}

export default App;
