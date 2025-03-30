// import { Link } from "react-router-dom";
import React from "react";
import banner from "../assets/banner.jpg";
import styles from "./Home.module.css";
import ScrollList from "../elements/ScrollList";
import courses from "../../mock_data/courses";

const scrollListItems = courses;

function Home() {
    return <div className={styles.page}>
        <img className={styles.banner} src={banner} alt="banner" />
        <ScrollList title={"Phổ biến nhất"} items={scrollListItems}/>
        <ScrollList title={"Kiến thức nền tảng"} items={scrollListItems} /> {/* beginner */}
        <ScrollList title={"Kiến thức trung cấp"} items={scrollListItems} /> {/* intermediate */}
        <ScrollList title={"Kiến thức chuyên sâu"} items={scrollListItems} /> {/* advanced */}
        <footer style={{marginTop: "50px"}}><img style={{width: "100%"}} src={banner} alt=""></img></footer>
    </div>
}

export default Home;