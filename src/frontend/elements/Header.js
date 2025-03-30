import {Link} from "react-router-dom";
import React from "react";
import styles from "./Header.module.css";

function Header() {
    return <header className={styles.header}> 
        <Link to="/"><button className={styles["nav-btn"]}>Trang chủ</button></Link>
        <div className={styles["explore-box"]}>
            <Link to="/explore"><button className={`${styles["nav-btn"]} ${styles.explore}`}>Khám phá</button></Link>
            <ul type="none" className={styles["explore-menu"]}>
                <li>Python</li>
                <li>Javascript</li>
            </ul>
        </div>
        

        <div id={styles["search-box"]}>
            <input type="text" id={styles["search-bar"]} placeholder="Tìm kiếm bất kỳ thứ gì..."></input>
            <button id={styles["search-btn"]} style={{display: "flex", justifyItems: "center", alignItems: "center"}}>
                <svg height={50} width={50} xmlns="http://www.w3.org/2000/svg">
                    <line x1="17" y1="12" x2="32" y2="27" style={{ stroke: "forestgreen", strokeWidth: 5}}/>
                    <line x1="17" y1="38" x2="32" y2="24" style={{ stroke: "forestgreen", strokeWidth: 5}}/>
                </svg>
            </button>
        </div>
        <Link to="/teaching"><button className={styles["nav-btn"]}>Giảng dạy</button></Link> 
        <Link to="/my-courses"><button className={styles["nav-btn"]}>Khoá học của tôi</button></Link> 
        <Link to="/login"><button id={styles["login-btn"]}>Đăng nhập</button></Link>
    </header>
}

export default Header;