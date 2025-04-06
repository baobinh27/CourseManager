import {Link} from "react-router-dom";
import React, { useState } from "react";
import styles from "./Header.module.css";
import {FaAngleRight} from "react-icons/fa";

function Header() {
    const [nameInput, setNameInput] = useState("");

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
            <input 
                value={nameInput} 
                onChange={(e) => setNameInput(e.target.value)} 
                type="text" 
                id={styles["search-bar"]} 
                placeholder="Tìm kiếm bất kỳ thứ gì..." 
            />
            {nameInput ? 
            <Link to={`/search?name=${nameInput}`}>
                <button 
                    onClick={() => setNameInput("")} 
                    id={styles["search-btn"]} 
                    style={{display: "flex", justifyItems: "center", alignItems: "center"}}
                >
                    <FaAngleRight className={styles.icon} />
                </button>
            </Link> : <button 
                disabled
                onClick={() => setNameInput("")} 
                id={styles["search-btn"]} 
                style={{display: "flex", justifyItems: "center", alignItems: "center"}}
            >
                <FaAngleRight className={styles.icon} />
            </button>}
            
            
        </div>
        <Link to="/teaching"><button className={styles["nav-btn"]}>Giảng dạy</button></Link> 
        <Link to="/my-courses"><button className={styles["nav-btn"]}>Khoá học của tôi</button></Link> 
        <Link to="/login"><button id={styles["login-btn"]}>Đăng nhập</button></Link>
    </header>
}

export default Header;