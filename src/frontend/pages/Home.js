import React, { useEffect } from "react";
import banner from "../assets/banner.jpg";
import styles from "./Home.module.css";
import ScrollCourseList from "../elements/ScrollCourseList";
import useDocumentTitle from "../hooks/useDocumentTitle";
// import useGetAllCourses from "../hooks/useGetAllCourses";
import Loading from "./misc/Loading";
import ErrorPage from "./misc/ErrorPage";
import { useNavigate } from "react-router-dom";
import useIsMobile from "../hooks/useIsMobile";
import PaginatedCourseList from "../elements/PaginatedCourseList";
import VerticalCourseList from "../elements/VerticalCourseList";
import useGetSearchResult from "../hooks/useGetSearchResult";

function Home() {
    useDocumentTitle("Online Learning");

    // eslint-disable-next-line
    const navigate = useNavigate();
    // const { courses, loading, error } = useGetAllCourses();

    const { courses: popularCourses, loading: loadingPopular, error: popularError, fetchCourse: fetchPopular } = useGetSearchResult();
    const { courses: newCourses, loading: loadingNew, error: newError, fetchCourse: fetchNew } = useGetSearchResult();
    const { courses: bestCourses, loading: loadingBest, error: bestError, fetchCourse: fetchBest } = useGetSearchResult();

    const isDesktop = useIsMobile('(max-width: 1450px)');
    const isTablet = useIsMobile('(max-width: 1024px)');
    const isMobile = useIsMobile('(max-width: 768px)');

    const handleExploreClick = () => {
        window.scrollTo({ top: 500, behavior: "smooth" });
        // navigate('/explore');
    }

    useEffect(() => {
        fetchPopular({ sortBy: "enroll_desc", limit: 10 });
        fetchNew({ sortBy: "created_desc", limit: 10 });
        fetchBest({ minRating: 4, limit: 10});
    }, [fetchPopular, fetchNew, fetchBest])

    if (loadingPopular || loadingNew || loadingBest) {
        return <Loading />
    }

    if (popularError) return <ErrorPage message={popularError} />;
    if (newError) return <ErrorPage message={newError} />;
    if (bestError) return <ErrorPage message={bestError} />;

    return <div className={styles.page}>
        <div className={styles.bannerContainer}>
            <img className={styles.bannerImage} src={banner} alt="banner" />
            <div className={styles.overlay}>
                <h1 className={styles.bannerTitle}>Chào mừng bạn đến với khóa học!</h1>
                <p className={styles.subtitle}>Khám phá hàng trăm khóa học hấp dẫn ngay hôm nay.</p>
                <button onClick={handleExploreClick} className={styles.ctaButton}>Bắt đầu khám phá</button>
            </div>
        </div>
        <div className={styles["scroll-list"]}>
            <p className={`${styles.title}`}>Phổ biến</p>
            {isMobile ? <VerticalCourseList items={popularCourses} visibleCount={10} /> :
                isTablet ? <PaginatedCourseList courses={popularCourses} columns={2} maxItemPerPage={10} /> :
                    isDesktop ? <ScrollCourseList items={popularCourses} visibleCount={3} scale={18} /> :
                        <ScrollCourseList items={popularCourses} visibleCount={4} />
            }
        </div>
        <div className={styles["scroll-list"]}>
            <p className={`${styles.title} h2`}>Mới nhất</p>
            {isMobile ? <VerticalCourseList items={newCourses} visibleCount={10} /> :
                isTablet ? <PaginatedCourseList courses={newCourses} columns={2} maxItemPerPage={10} /> :
                    isDesktop ? <ScrollCourseList items={newCourses} visibleCount={3} scale={18} /> :
                        <ScrollCourseList items={newCourses} visibleCount={4} />
            }
        </div>
        <div className={styles["scroll-list"]}>
            <p className={`${styles.title} h2`}>Lựa chọn bởi người học</p>
            {isMobile ? <VerticalCourseList items={bestCourses} visibleCount={10} /> :
                isTablet ? <PaginatedCourseList courses={bestCourses} columns={2} maxItemPerPage={10} /> :
                    isDesktop ? <ScrollCourseList items={bestCourses} visibleCount={3} scale={18} /> :
                        <ScrollCourseList items={bestCourses} visibleCount={4} />
            }
        </div>
        {/* <div className={styles["scroll-list"]}>
            <p className={`${styles.title} h2`}>Chuyên sâu</p>
            {isMobile ? <VerticalCourseList items={courses} visibleCount={10} /> :
                isTablet ? <PaginatedCourseList courses={courses} columns={2} maxItemPerPage={10} /> :
                    isDesktop ? <ScrollCourseList items={courses} visibleCount={3} scale={18} /> :
                        <ScrollCourseList items={courses} visibleCount={4} />
            }
        </div> */}
        <footer style={{ marginTop: "50px" }}><img style={{ width: "100%" }} src={banner} alt=""></img></footer>
    </div>
}

export default Home;