import React from "react";
import styles from "./MyCourses.module.css";
import courses from "../../mock_data/courses";
import ItemCard from "../elements/ItemCard";
import { Link } from "react-router-dom";


function MyCourses() {
    // Mock data - sẽ thay thế bằng dữ liệu thực từ backend sau
    const purchasedCourses = courses.slice(0, 3); // Giả lập 3 khóa học đã mua
    const createdCourses = courses.slice(3, 5); // Giả lập 2 khóa học đã tạo

    const renderCourseList = (courseList, emptyMessage) => {
        if (courseList.length === 0) {
            return (
                <div className={styles.emptyState}>
                    <p className={styles.emptyMessage}>{emptyMessage}</p>
                </div>
            );
        }

        return (
            <div className={styles.courseGrid}>
                {courseList.map((course) => (
                    <Link 
                        key={course._id} 
                        to={`/course/${course._id}`} 
                        className={styles.courseLink}
                    >
                        <ItemCard
                            img={course.banner}
                            name={course.name}
                            tags={course.tags}
                            ratings={4.5}
                            price={course.price}
                            enrolCount={course.enrolCount}
                        />
                    </Link>
                ))}
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Khóa học đã mua</h2>
                    {renderCourseList(purchasedCourses, "Bạn chưa mua khóa học nào")}
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Khóa học đã tạo</h2>
                    {renderCourseList(createdCourses, "Bạn chưa tạo khóa học nào")}
                </section>
            </div>
            
        </div>
    );
}

export default MyCourses;