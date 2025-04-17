import {Link} from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./Header.module.css";
import {FaAngleDown, FaAngleRight, FaAngleUp, FaUserCircle} from "react-icons/fa";
import { useAuth } from '../api/auth';
import { FiLogOut } from "react-icons/fi";
import { ImProfile } from "react-icons/im";
import useGetUserDetail from "../hooks/useGetUserDetail";
import Loading from "../pages/misc/Loading";
import ErrorPage from "../pages/misc/ErrorPage";

function Header() {
    const [nameInput, setNameInput] = useState("");
    const { user, logout } = useAuth();
    const { user: userDetail, loading, error } = useGetUserDetail(user?.userId);
    const [showMenu, setShowMenu] = useState(false); 
    const navigate = useNavigate();

    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                menuRef.current && !menuRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)
            ) {
                setShowMenu(false);
            }
        }
      
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleToggleMenu = () => {
        setShowMenu(!showMenu);
    }

    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading && user) {
        return <Loading />
    }

    if (error) return <ErrorPage message={error} />;
    
    
    return <header className={styles.header}> 
        <Link to="/"><button className={`${styles["nav-btn"]} h5 bold`}>Trang chủ</button></Link>
        <div className={styles["explore-box"]}>
            <Link to="/explore"><button className={`${styles["nav-btn"]} h5 bold ${styles.explore}`}>Khám phá</button></Link>
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
        <Link to="/teaching"><button className={`${styles["nav-btn"]} h5 bold`}>Giảng dạy</button></Link> 
        <Link to="/my-courses"><button className={`${styles["nav-btn"]} h5 bold`}>Khoá học của tôi</button></Link> 
        {userDetail ? (
            <div className={`${styles["user-area"]} flex-row align-center`}>
                <button ref={buttonRef} onClick={handleToggleMenu} className={`${styles["menu-toggle-btn"]} flex-row align-center`}>
                    <FaUserCircle style={{height: "1.5vw", width: "1.5vw"}}/>
                    {showMenu ? <FaAngleUp style={{height: "1vw", width: "1vw"}}/> : <FaAngleDown style={{height: "1vw", width: "1vw"}}/>}
                </button>
                
                {showMenu && <div ref={menuRef} className={`${styles.menu}`}>
                    <div className={styles["menu-section"]}>
                        <p className="h4 bold">{userDetail.username}</p>
                        <p className="h7">{`ID: ${userDetail._id}`}</p>
                    </div>

                    <div className={styles["menu-section"]}>
                        <button onClick={() => {handleToggleMenu(); navigate(`/profile/${userDetail._id}`);}} className={`${styles["menu-btn"]} h6 bold flex-row align-center`}>
                            <ImProfile />
                            Hồ sơ của bạn
                        </button>
                    </div>
                    
                    <button onClick={handleLogout} className={`${styles["logout-btn"]} h6 bold flex-row align-center`}>
                        <FiLogOut />
                        Đăng xuất
                    </button>
                </div>}
                
            </div>
        ) : <button onClick={handleLogin} id={styles["login-btn"]} className="h5 bold">Đăng nhập</button>}
    </header>
}

export default Header;