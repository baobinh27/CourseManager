import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TagsList from "../elements/TagsList";
import styles from "./CourseDetail.module.css";
import courses from "../../mock_data/courses";
import star from "../assets/star.png";

const getStarRate = (ratings) => {
    return 4.8;
}

const CourseDetail = () => {
    const { id } = useParams();
    const [course, setCourse] = useState({});

    useEffect(() => {
        setCourse(courses.find((course) => course._id === id))
    }, [id])

    return <>
        <div className={`${styles["flex-row"]} ${styles.page}`}>
            <div className={styles["left-box"]}>
                <div className={styles["overview-box"]}>
                    <h1 className={styles.name}>{course.name}</h1>
                    <h1 className={styles.author}>{"Tạo bởi " + course.author}</h1>
                    {course.tags ? <TagsList tags={course.tags} shorten={false}/> : null}
                    <div className={`${styles["flex-row"]} ${styles["justify-center"]}`}>
                        <p className={styles["star-number"]}>{getStarRate(course.ratings)}</p> 
                        <img className={styles.star} src={star} alt=""></img>
                    </div>
                    <p className={styles["enrol-count"]}>{`${course.enrolCount} đã đăng ký`}</p>
                    
                </div>
                <div className={styles["detail-box"]}>
                    <p>{course.description}</p>
                </div>
                
            </div>
            <div className={styles["right-box"]}>
                <img src={course.banner} alt="" className={styles["course-img"]}/>
                <div className={styles["price-box"]}>
                    <h1 className={styles.price}>{course.price ? (course.price.toLocaleString("vi-VN") + "₫") : ""}</h1>
                    <button className={styles["buy-btn"]}>Mua</button>
                </div>
            </div>
        </div>
        
    </>
}

export default CourseDetail;