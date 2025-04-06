import React from "react";
import styles from "./CourseCard.module.css";
import { Link } from "react-router-dom";

function CourseCard({ course, type }) {
    // type can be 'purchased' or 'created'
    return (
        <div className={styles.card}>
            <img src={course.banner} alt={course.name} className={styles.banner} />
            <div className={styles.content}>
                <h3 className={styles.name}>{course.name}</h3>
                {type === 'purchased' && (
                    <Link to={`/course/${course._id}`} className={styles.continueButton}>
                        Tiếp tục học
                    </Link>
                )}
            </div>
        </div>
    );
}

export default CourseCard; 