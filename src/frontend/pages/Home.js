// import { Link } from "react-router-dom";
import React from "react";
import Header from "../elements/Header";
import banner from "../assets/home-banner.png";
import styles from "./Home.module.css";
// import ItemCard from "./elements/ItemCard";
import ScrollList from "../elements/ScrollList";

const scrollListItems = [
    {
        img: "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20200627163847/Python-for-Absolute-Begineers.png",
        name: "Python cho người mới bắt đầu",
        tags: ["Python", "Beginner"],
        ratings: 4.9,
        price: 199000,
        // discountedPrice: 149999
        enrolCount: 3472
    },
    {
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkSwPnsBvGSuFxV3hK9aBI5Dn4DHIabjNIPA&s",
        name: "React cơ bản",
        tags: ["React", "Web Development", "Javascript"],
        ratings: 4.9,
        price: 199000,
        discountedPrice: 149000,
        enrolCount: 7546
    },
    {
        img: "https://ucarecdn.com/668fcdac-a3ba-4c25-8406-cbada074cb44/-/preview/-/resize/1050/",
        name: "Sử dụng MongoDB với C#",
        tags: ["C#", "MongoDB", "Intermediate", "Database"],
        ratings: 4.8,
        price: 119000
    },
    {
        img: "https://cdn.htmr.kr/blog/thumbnail/_thumbnailWebp/896891/Top-6-Unity-3D-tutorials.webp",
        // img: "https://img.brainkart.com/imagebk44/MHYzNAi.jpg",
        name: "Lập trình Game 3D với Unity",
        tags: ["Game Development", "Unity", "C#", "Advanced"],
        ratings: 4.8,
        price: 549000,
        discountedPrice: 399000,
        enrolCount: 434
    },
    {
        img: "https://i.ytimg.com/vi/2ihkfQLB0QM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBMqzfhOVcoGT665hsmqzM8xSWSHQ",
        name: "Thiết kế UI/UX với Figma",
        tags: ["UI/UX", "Figma"],
        ratings: 5.0,
        price: 219000,
        enrolCount: 1226
    }
]

function Home() {
    return <div className={styles.page}>
        <Header />
        <img className={styles.banner} src={banner} alt="banner" />
        <ScrollList title={"Phổ biến nhất"} items={scrollListItems}/>
        <ScrollList title={"Kiến thức nền tảng"} items={scrollListItems} /> {/* beginner */}
        <ScrollList title={"Kiến thức trung cấp"} items={scrollListItems} /> {/* intermediate */}
        <ScrollList title={"Kiến thức chuyên sâu"} items={scrollListItems} /> {/* advanced */}
        <footer style={{marginTop: "50px"}}><img style={{width: "100%"}} src={banner} alt=""></img></footer>
    </div>
}

export default Home;