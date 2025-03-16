import {Link} from "react-router-dom";
import React from "react";
import "./Header.css"

function Header() {
    return <header> 
        <Link to="/"><button className="nav-btn">Trang chủ</button></Link>
        <Link to="/explore"><button className="nav-btn">Khám phá</button></Link>
        <div id="search-box">
            <input type="text" placeholder="Tìm kiếm bất kỳ thứ gì..."></input>
            <button id="search-btn">Tìm kiếm</button>
        </div>
        
        <Link to="/teaching"><button className="nav-btn">Giảng dạy</button></Link> 
        <Link to="/my-courses"><button className="nav-btn">Khoá học của tôi</button></Link> 
        <Link to="/login"><button id="login-btn">Đăng nhập</button></Link>
    </header>
}

export default Header;