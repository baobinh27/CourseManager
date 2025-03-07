import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
    

export default function App() {
  return (
      <BrowserRouter>
          <nav>
              <Link to="/">Trang Chủ</Link> | 
              <Link to="/login">Đăng nhập</Link>
          </nav>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<h1>404 - Trang không tồn tại</h1>} />
          </Routes>
      </BrowserRouter>
  );
}

function Home() {
  const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/users")
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error("Lỗi:", error));
    }, []);

  return <h1>Trang Chủ
    <ol>{users.map(user => (
                    <li key={user.id}>{user.name} - {user.email}</li>
                ))}</ol>
  </h1>
}

function Login() {
  return <div>
      <h1>Đăng nhập</h1>
      <input type="text" placeholder="Username or email address"></input>
      <input type="text" placeholder="password"></input>
    </div>
}
