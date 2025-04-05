// import { Link } from "react-router-dom";
import React from "react";
import banner from "../assets/banner.jpg";
import styles from "./Home.module.css";
import ScrollCourseList from "../elements/ScrollCourseList";
import courses from "../../mock_data/courses";

const scrollListItems = courses;

function Home() {
    return <div className={styles.page}>
        <img className={styles.banner} src={banner} alt="banner" />
        <ScrollCourseList title={"Phổ biến nhất"} items={scrollListItems}/>
        <ScrollCourseList title={"Kiến thức nền tảng"} items={scrollListItems} /> {/* beginner */}
        <ScrollCourseList title={"Kiến thức trung cấp"} items={scrollListItems} /> {/* intermediate */}
        <ScrollCourseList title={"Kiến thức chuyên sâu"} items={scrollListItems} /> {/* advanced */}
        <footer style={{marginTop: "50px"}}><img style={{width: "100%"}} src={banner} alt=""></img></footer>
    </div>
}

export default Home;