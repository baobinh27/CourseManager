import React from "react";
import banner from "../assets/banner.jpg";
import styles from "./Home.module.css";
import ScrollCourseList from "../elements/ScrollCourseList";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useGetAllCourses from "../hooks/useGetAllCourses";
import Loading from "./misc/Loading";
import ErrorPage from "./misc/ErrorPage";
import { useNavigate } from "react-router-dom";

function Home() {
    useDocumentTitle("Online Learning");
    const navigate = useNavigate();
    const { courses, loading, error } = useGetAllCourses();

    if (loading) {
        return <Loading />
    }

    if (error) return <ErrorPage message={error} />;

    if (!courses || courses.length === 0) return <p>Không có khoá học nào.</p>;

    return <div className={styles.page}>
        {/* <img className={styles.banner} src={banner} alt="banner" /> */}
        <div className={styles.bannerContainer}>
            <img className={styles.bannerImage} src={banner} alt="banner" />
            <div className={styles.overlay}>
                <h1 className={styles.bannerTitle}>Chào mừng bạn đến với khóa học!</h1>
                <p className={styles.subtitle}>Khám phá hàng trăm khóa học hấp dẫn ngay hôm nay.</p>
                <button onClick={() => navigate('/explore')} className={styles.ctaButton}>Bắt đầu khám phá</button>
            </div>
        </div>
        <div className={styles["scroll-list"]}>
            <p className={`${styles.title} h2`}>Phổ biến</p>
            <ScrollCourseList items={courses} />
        </div>
        <div className={styles["scroll-list"]}>
            <p className={`${styles.title} h2`}>Sơ đẳng</p>
            <ScrollCourseList items={courses} />
        </div>
        <div className={styles["scroll-list"]}>
            <p className={`${styles.title} h2`}>Trung cấp</p>
            <ScrollCourseList items={courses} />
        </div>
        <div className={styles["scroll-list"]}>
            <p className={`${styles.title} h2`}>Chuyên sâu</p>
            <ScrollCourseList items={courses} />
        </div>
        <footer style={{ marginTop: "50px" }}><img style={{ width: "100%" }} src={banner} alt=""></img></footer>
    </div>
}

export default Home;