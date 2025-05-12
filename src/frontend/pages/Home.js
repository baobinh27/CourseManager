import React, { useEffect } from "react";
import banner from "../assets/banner.jpg";
import styles from "./Home.module.css";
import ScrollCourseList from "../elements/ScrollCourseList";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useGetAllCourses from "../hooks/useGetAllCourses";
import Loading from "./misc/Loading";
import ErrorPage from "./misc/ErrorPage";
import { useNavigate } from "react-router-dom";
import useIsMobile from "../hooks/useIsMobile";
import PaginatedCourseList from "../elements/PaginatedCourseList";
import VerticalCourseList from "../elements/VerticalCourseList";
import { useAuth } from '../api/auth';

function Home() {
    useDocumentTitle("Online Learning");
    const { user } = useAuth();
    const navigate = useNavigate();
    const { courses, loading, error } = useGetAllCourses();

    const isDesktop = useIsMobile('(max-width: 1450px)');
    const isTablet = useIsMobile('(max-width: 1024px)');
    const isMobile = useIsMobile('(max-width: 768px)');

    useEffect(() => {
        if (user?.role === 'admin') {
            navigate('/admin');
        }
    }, [user, navigate]);

    if (loading) {
        return <Loading />
    }

    if (error) return <ErrorPage message={error} />;

    if (!courses || courses.length === 0) return <p>Không có khoá học nào.</p>;

    return <div className={styles.page}>
        <div className={styles.bannerContainer}>
            <img className={styles.bannerImage} src={banner} alt="banner" />
            <div className={styles.overlay}>
                <h1 className={styles.bannerTitle}>Chào mừng bạn đến với khóa học!</h1>
                <p className={styles.subtitle}>Khám phá hàng trăm khóa học hấp dẫn ngay hôm nay.</p>
                <button onClick={() => navigate('/explore')} className={styles.ctaButton}>Bắt đầu khám phá</button>
            </div>
        </div>
        <div className={styles["scroll-list"]}>
            <p className={`${styles.title}`}>Phổ biến</p>
            {isMobile ? <VerticalCourseList items={courses} visibleCount={10} /> :
                isTablet ? <PaginatedCourseList courses={courses} columns={2} maxItemPerPage={10} /> :
                    isDesktop ? <ScrollCourseList items={courses} visibleCount={3} scale={18} /> :
                        <ScrollCourseList items={courses} visibleCount={4} />
            }
        </div>
        <div className={styles["scroll-list"]}>
            <p className={`${styles.title} h2`}>Sơ đẳng</p>
            {isMobile ? <VerticalCourseList items={courses} visibleCount={10} /> :
                isTablet ? <PaginatedCourseList courses={courses} columns={2} maxItemPerPage={10} /> :
                    isDesktop ? <ScrollCourseList items={courses} visibleCount={3} scale={18} /> :
                        <ScrollCourseList items={courses} visibleCount={4} />
            }
        </div>
        <div className={styles["scroll-list"]}>
            <p className={`${styles.title} h2`}>Trung cấp</p>
            {isMobile ? <VerticalCourseList items={courses} visibleCount={10} /> :
                isTablet ? <PaginatedCourseList courses={courses} columns={2} maxItemPerPage={10} /> :
                    isDesktop ? <ScrollCourseList items={courses} visibleCount={3} scale={18} /> :
                        <ScrollCourseList items={courses} visibleCount={4} />
            }
        </div>
        <div className={styles["scroll-list"]}>
            <p className={`${styles.title} h2`}>Chuyên sâu</p>
            {isMobile ? <VerticalCourseList items={courses} visibleCount={10} /> :
                isTablet ? <PaginatedCourseList courses={courses} columns={2} maxItemPerPage={10} /> :
                    isDesktop ? <ScrollCourseList items={courses} visibleCount={3} scale={18} /> :
                        <ScrollCourseList items={courses} visibleCount={4} />
            }
        </div>
        <footer style={{ marginTop: "50px" }}><img style={{ width: "100%" }} src={banner} alt=""></img></footer>
    </div>
}

export default Home;