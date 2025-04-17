import React from "react";
import banner from "../assets/banner.jpg";
import styles from "./Home.module.css";
import ScrollCourseList from "../elements/ScrollCourseList";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useGetAllCourses from "../hooks/useGetAllCourses";
import Loading from "./misc/Loading";
import ErrorPage from "./misc/ErrorPage";



function Home() {
    useDocumentTitle("Online Learning");
    const { courses, loading, error } = useGetAllCourses();

    if (loading) {
        return <Loading />
    }

    if (error) return <ErrorPage message={error} />;

    if (!courses || courses.length === 0) return <p>Không có khoá học nào.</p>;

    return <div className={styles.page}>
        <img className={styles.banner} src={banner} alt="banner" />
        <ScrollCourseList title={"Phổ biến nhất"} items={courses}/>
        <ScrollCourseList title={"Kiến thức nền tảng"} items={courses} /> 
        <ScrollCourseList title={"Kiến thức trung cấp"} items={courses} /> 
        <ScrollCourseList title={"Kiến thức chuyên sâu"} items={courses} />
        <footer style={{marginTop: "50px"}}><img style={{width: "100%"}} src={banner} alt=""></img></footer>
    </div>
}

export default Home;