import React from "react";
import styles from "./CourseCard.module.css";
import { Link } from "react-router-dom";
import useGetCourseDetail from "../hooks/useGetCourseDetail";
import { AiOutlineLoading } from "react-icons/ai";


function CourseCard({ courseId, type }) {
    // type can be 'purchased' or 'created'

    const { course, loading, error } = useGetCourseDetail(courseId);

    if (loading) {
        return <AiOutlineLoading />;
    }

    if (error) {
        return <p>Lỗi: {error}</p>
    }

    return (
        <div className={styles.card}>
            <img src={course.banner} alt={course.name} className={styles.banner} />
            <div className={styles.content}>
                <h3 className={styles.name}>{course.name}</h3>
                {type === 'purchased' ? (
                    <Link to={`/learning?courseId=${courseId}`} className={styles.continueButton}>
                        Tiếp tục học
                    </Link>
                ) : (
                    <Link to={`/course/${courseId}`} className={styles.continueButton}>
                        Xem chi tiết
                    </Link>
                )}
            </div>
        </div>
    );
}

export default CourseCard; 