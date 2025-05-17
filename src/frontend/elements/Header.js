import { Link } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./Header.module.css";
import { FaAngleDown, FaAngleRight, FaAngleUp, FaBook, FaChalkboard, FaHome, FaUserCircle } from "react-icons/fa";
import { useAuth } from '../api/auth';
import { FiLogOut } from "react-icons/fi";
import { ImProfile } from "react-icons/im";
import useGetUserDetail from "../hooks/useGetUserDetail";
import Loading from "../pages/misc/Loading";
import ErrorPage from "../pages/misc/ErrorPage";
import { IoMdSettings } from "react-icons/io";
import useIsMobile from "../hooks/useIsMobile";
import { MdExplore } from "react-icons/md";

function Header() {
    const [nameInput, setNameInput] = useState("");
    const { user, logout } = useAuth();
    const { user: userDetail, loading, error } = useGetUserDetail(user?.userId);
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    const isTablet = useIsMobile('(max-width: 1024px)');
    const isMobile = useIsMobile('(max-width: 768px)');

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
        window.location.reload();
    };

    if (loading && user) {
        return <Loading />
    }

    if (error) return <ErrorPage message={error} />;

    return (
        isMobile ? <div className={styles.header}>
            <button
                onClick={() => navigate('/')}
                className={`${styles["nav-btn"]} ${isTablet ? "h5" : "h4"} bold`}
            >
                <FaHome />
            </button>

            <div id={styles["search-box"]}>
                <input
                    className="h7"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    type="text"
                    id={styles["search-bar"]}
                    placeholder="Tìm kiếm bất kỳ thứ gì..."
                />
                {nameInput ?
                    <Link to={`/search?query=${nameInput}`}>
                        <button
                            onClick={() => setNameInput("")}
                            id={styles["search-btn"]}
                            style={{ display: "flex", justifyItems: "center", alignItems: "center" }}
                        >
                            <FaAngleRight className={styles.icon} />
                        </button>
                    </Link> : <button
                        disabled
                        onClick={() => setNameInput("")}
                        id={styles["search-btn"]}
                        style={{ display: "flex", justifyItems: "center", alignItems: "center" }}
                    >
                        <FaAngleRight className={styles.icon} />
                    </button>}


            </div>

            {userDetail ? (
                <div className={`${styles["user-area"]} flex-row align-center`}>
                    <button ref={buttonRef} onClick={handleToggleMenu} className={`${styles["menu-toggle-btn"]} flex-row align-center`}>
                        <FaUserCircle style={{ height: "1rem", width: "1rem" }} />
                        {showMenu ? <FaAngleUp style={{ height: "0.75rem", width: "0.75rem" }} /> : <FaAngleDown style={{ height: "0.75rem", width: "0.75rem" }} />}
                    </button>

                    {showMenu && <div ref={menuRef} className={`${styles.menu}`}>
                        <div className={styles["menu-section"]}>
                            <p className="h4 bold">{userDetail.username}</p>
                            <p className="h7">{`ID: ${userDetail._id}`}</p>
                        </div>

                        <div className={styles["menu-section"]}>
                            <button onClick={() => { handleToggleMenu(); navigate(`/profile/${userDetail._id}`); }} className={`${styles["menu-btn"]} h5 bold flex-row align-center`}>
                                <ImProfile />
                                Hồ sơ của bạn
                            </button>
                            <button onClick={() => { handleToggleMenu(); navigate(`/my-courses`); }} className={`${styles["menu-btn"]} h5 bold flex-row align-center`}>
                                <FaBook />
                                Khoá học của bạn
                            </button>
                        </div>
                        <div className={styles["menu-section"]}>
                            <button onClick={() => { handleToggleMenu(); navigate(`/explore`); }} className={`${styles["menu-btn"]} h5 bold flex-row align-center`}>
                                <MdExplore />
                                Khám phá
                            </button>
                            <button onClick={() => { handleToggleMenu(); navigate(`/teaching`); }} className={`${styles["menu-btn"]} h5 bold flex-row align-center`}>
                                <FaChalkboard />
                                Giảng dạy
                            </button>
                        </div>
                        <button onClick={() => { handleToggleMenu(); navigate(`/settings`); }} className={`${styles["menu-btn"]} h5 bold flex-row align-center`}>
                            <IoMdSettings />
                            Cài đặt
                        </button>
                        <button onClick={handleLogout} className={`${styles["logout-btn"]} h5 bold flex-row align-center`}>
                            <FiLogOut />
                            Đăng xuất
                        </button>
                    </div>}

                </div>
            ) : <button onClick={handleLogin} id={styles["login-btn"]} className="h6 bold">Đăng nhập</button>}
        </div> : <div className={styles.header}>
            <button
                onClick={() => navigate('/')}
                className={`${styles["nav-btn"]} ${isTablet ? "h5" : "h4"} bold`}
            >
                Trang chủ
            </button>

            <button
                onClick={() => navigate('/explore')}
                className={`${styles["nav-btn"]} ${isTablet ? "h5" : "h4"} bold`}
            >
                Khám phá
            </button>

            <div id={styles["search-box"]}>
                <input
                    className="h5"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    type="text"
                    id={styles["search-bar"]}
                    placeholder="Tìm kiếm bất kỳ thứ gì..."
                />
                {nameInput ?
                    <Link to={`/search?query=${nameInput}`}>
                        <button
                            onClick={() => setNameInput("")}
                            id={styles["search-btn"]}
                            style={{ display: "flex", justifyItems: "center", alignItems: "center" }}
                        >
                            <FaAngleRight className={styles.icon} />
                        </button>
                    </Link> : <button
                        disabled
                        onClick={() => setNameInput("")}
                        id={styles["search-btn"]}
                        style={{ display: "flex", justifyItems: "center", alignItems: "center" }}
                    >
                        <FaAngleRight className={styles.icon} />
                    </button>}
            </div>

            <button
                onClick={() => navigate('/teaching')}
                className={`${styles["nav-btn"]} ${isTablet ? "h5" : "h4"} bold`}
            >
                Giảng dạy
            </button>

            <button
                onClick={() => navigate('/my-courses')}
                className={`${styles["nav-btn"]} ${isTablet ? "h5" : "h4"} bold`}
            >
                Khoá học của tôi
            </button>

            {userDetail ? (
                <div className={`${styles["user-area"]} flex-row align-center`}>
                    <button ref={buttonRef} onClick={handleToggleMenu} className={`${styles["menu-toggle-btn"]} flex-row align-center`}>
                        <FaUserCircle style={{ height: "1.5rem", width: "1.5rem" }} />
                        {showMenu ? <FaAngleUp style={{ height: "1rem", width: "1rem" }} /> : <FaAngleDown style={{ height: "1rem", width: "1rem" }} />}
                    </button>

                    {showMenu && <div ref={menuRef} className={`${styles.menu}`}>
                        <div className={styles["menu-section"]}>
                            <p className="h4 bold">{userDetail.username}</p>
                            <p className="h7">{`ID: ${userDetail._id}`}</p>
                        </div>

                        <div className={styles["menu-section"]}>
                            <button onClick={() => { handleToggleMenu(); navigate(`/profile/${userDetail._id}`); }} className={`${styles["menu-btn"]} h5 bold flex-row align-center`}>
                                <ImProfile />
                                Hồ sơ của bạn
                            </button>
                            <button onClick={() => { handleToggleMenu(); navigate(`/my-courses`); }} className={`${styles["menu-btn"]} h5 bold flex-row align-center`}>
                                <FaBook />
                                Khoá học của bạn
                            </button>

                        </div>
                        <button onClick={() => { handleToggleMenu(); navigate(`/settings`); }} className={`${styles["menu-btn"]} h5 bold flex-row align-center`}>
                            <IoMdSettings />
                            Cài đặt
                        </button>
                        <button onClick={handleLogout} className={`${styles["logout-btn"]} h5 bold flex-row align-center`}>
                            <FiLogOut />
                            Đăng xuất
                        </button>
                    </div>}

                </div>
            ) : <button onClick={handleLogin} id={styles["login-btn"]} className={`${isTablet ? "h5" : "h4"} bold`}>Đăng nhập</button>}
        </div>
    )
}

export default Header;