import React, { useState } from "react";
import styles from "./MyCourses.module.css";
import CourseCard from "../elements/CourseCard";
import { useAuth } from "../api/auth";
import UnAuthorized from "./misc/UnAuthorized";
import { BASE_API } from "../utils/constant";
import { useEffect } from "react";
import { useGetCreatedCourses } from "../hooks/useGetCreatedCourses";
import Loading from "./misc/Loading";
import ErrorPage from "./misc/ErrorPage";

function MyCourses() {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);

    const { createdCourses, loading, error } = useGetCreatedCourses();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${BASE_API}/api/user/${user.userId}`);
                const userInfo = await res.json();
                setUserData(userInfo);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };
    
        if (user?.userId) {
            fetchUser();
        }
    }, [user]);

    if (!user) {
        return <UnAuthorized />
    }

    if (loading) {
        return <Loading />
    }

    if (error) return <ErrorPage message={error} />;    

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Khóa học đã mua</h2>
                    <div className={styles.courseGrid}>
                        {userData && userData.ownedCourses.map((courseData) => (
                            <div key={courseData.courseId} className={styles.courseItem}>
                                <CourseCard courseId={courseData.courseId} type={"purchased"} />
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Khóa học đã tạo</h2>
                    <div className={styles.courseGrid}>
                        {createdCourses?.map((courseId) => (
                            <div key={courseId} className={styles.courseItem}>
                                <CourseCard courseId={courseId} type={"created"}/>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default MyCourses;