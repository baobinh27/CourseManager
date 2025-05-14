// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import Explore from "./frontend/pages/Explore.js";
import AdminRoute from "./AdminRoute.js";
import UnAuthorized from "./frontend/pages/misc/UnAuthorized.js";
import EditCourse from "./frontend/pages/admin/EditCourse.js";


function App() {
  return <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<>
          <Header />
          <Home />
        </>} />
        <Route path="/explore" element={<>
          <Header />
          <Explore />
        </>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-courses" element={<>
          <Header />
          <MyCourses />
        </>} />
        <Route path="/course/:id" element={<>
          <Header />
          <CourseDetail />
        </>} />
        <Route path="/purchase" element={<>
          <Header />
          <Purchase />
        </>} />
        <Route path="/search" element={<>
          <Header />
          <SearchResult />
        </>} />
        <Route path="/learning" element={<>
          <Learning />
        </>} />
        <Route path="/profile/:id" element={<>
          <Header />
          <Profile />
        </>} />
        <Route path="/teaching" element={<>
          <Header />
          <Teaching />
        </>} />
        <Route path="/teaching/guide" element={<>
          <Header />
          <GuidePage />
        </>} />
        <Route path="/teaching/create" element={<>
          <CreateCourse />
        </>} />
        <Route path="/admin" element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        } />
        <Route path="/admin/course-management" element={
          <AdminRoute>
            <CourseManagement />
          </AdminRoute>
        } />
        <Route path="/admin/course-approval" element={
          <AdminRoute>
            <CourseApproval />
          </AdminRoute>
        } />
        <Route path="/admin/course-approval/:id" element={
          <AdminRoute>
            <CourseApprovalDetail />
          </AdminRoute>
        } />
        <Route path="/admin/edit-course/:courseId" element={
          <AdminRoute>
            <EditCourse />
          </AdminRoute>
        } />
        <Route path="/unauthorized" element={<>
          <UnAuthorized />
        </>} />
        <Route path="*" element={<>
          <NotFound />
        </>} />
      </Routes>
    </BrowserRouter>
  </>
}

export default App;
