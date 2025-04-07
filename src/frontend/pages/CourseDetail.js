import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TagsList from "../elements/TagsList";
import styles from "./CourseDetail.module.css";
import courses from "../../mock_data/courses";
// import star from "../assets/star.png";
import { FaCalendarCheck, FaCheck, FaStar, FaTags, FaUserCheck } from "react-icons/fa";
import ContentList from "../elements/ContentList";
import CourseRatings from "../elements/CourseRatings";

const getStarRate = (ratings) => {
    return "4.8 (121)";
}

const CourseDetail = () => {
    const { id } = useParams();
    const [course, setCourse] = useState({});

    useEffect(() => {
        setCourse(courses.find((course) => course._id === id))
        // console.log(course);
        
    }, [id, course])

    return <>
        {course ? (<div className={`${styles["flex-row"]} ${styles.page}`}>
            <div className={styles["left-box"]}>

                <div className={styles["overview-box"]}>

                    <h1 className="h1">{course.name}</h1>
                    
                    <div className={`${styles["flex-row"]} ${styles["justify-center"]} ${styles.gap}`}>
                        <FaCheck />
                        <p className="h5">{course.description}</p>
                    </div>

                    <div className={`${styles["flex-row"]} ${styles["justify-center"]} ${styles.gap}`}>
                        <FaUserCheck />
                        <h1 className="h5">{"Tạo bởi " + course.author}</h1>
                    </div>

                    {course.tags ? <div className={`${styles["flex-row"]} ${styles["justify-center"]} ${styles.gap}`}>
                        <FaTags />
                        <TagsList tags={course.tags} shorten={false}/>
                    </div> : null}

                    <div className={`${styles["flex-row"]} ${styles["justify-center"]} ${styles.gap}`}>
                        <FaStar style={{fill: "gold"}} />
                        <p className="h5">{getStarRate(course.ratings)}</p> 
                        <p className="h5">{`${course.enrolCount} đã đăng ký`}</p>
                    </div>

                    <div className={`${styles["flex-row"]} ${styles["justify-center"]} ${styles.gap}`}>
                        <FaCalendarCheck />
                        <p className="h5">{`Cập nhật lần cuối: ${course.lastModified?.slice(0, 10).split('-').reverse().join('/')}`}</p>
                    </div>
                </div>

                <div className={styles["detail-box"]}>
                    <ContentList content={course.content}/>
                    <CourseRatings />
                </div>
                
            </div>
            <div className={styles["right-box"]}>
                <div>
                    <img src={course.banner} alt="" className={styles["course-img"]}/>
                    <div className={styles["price-box"]}>
                        <h1 className={`${styles.price} h2`}>{course.price ? (course.price.toLocaleString("vi-VN") + "₫") : ""}</h1>
                        <button className={`${styles["buy-btn"]} h3`}>Mua</button>
                    </div>
                </div>
                
            </div>
        </div>
        ) : (
            <div>Loading...</div>
        )}
    </>
}

export default CourseDetail;