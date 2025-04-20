import React, { useState } from "react";
import styles from "./MyCourses.module.css";
// import CourseCard from "../elements/CourseCard";
import { useAuth } from "../api/auth";
import UnAuthorized from "./misc/UnAuthorized";
import { useEffect } from "react";
import Loading from "./misc/Loading";
import ErrorPage from "./misc/ErrorPage";
import useGetMultipleCourseDetails from "../hooks/useGetMultipleCourseDetails";
import useGetUserDetail from "../hooks/useGetUserDetail";
import ItemCard from "../elements/ItemCard";

function MyCourses() {
    const { user } = useAuth();

    const { user: userData, loading: loadingUser, error: userError } = useGetUserDetail(user?.userId);

    console.log(userData);
    

    const [ownedCourseIds, setOwnedCourseIds] = useState([]);
    const { courses: ownedCourses, loading: loadingOwnedCourses, error: ownedCoursesError } = useGetMultipleCourseDetails(ownedCourseIds);
    const [createdCourseIds, setCreatedCourseIds] = useState([]);
    const { courses: createdCourses, loading: loadingCreatedCourses, error: createdCoursesError } = useGetMultipleCourseDetails(createdCourseIds);

    useEffect(() => {
        if (userData && userData.ownedCourses) {
            const ids = userData.ownedCourses.map(item => item.courseId);
            setOwnedCourseIds(ids);
        }
        if (userData && userData.createdCourses) {
            setCreatedCourseIds(userData.createdCourses);
        }
    }, [userData]);

    if (!user) {
        return <UnAuthorized />
    }

    if (loadingUser || loadingOwnedCourses || loadingCreatedCourses) {
        return <Loading />
    }

    if (userError) return <ErrorPage message={userError} />;    
    if (ownedCoursesError) return <ErrorPage message={ownedCoursesError} />;   
    if (createdCoursesError) return <ErrorPage message={createdCoursesError} />; 

    console.log("owned:", ownedCourses);
    console.log("created:", createdCourses);
    
    
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Khóa học đã mua</h2>
                    <div className={styles.courseGrid}>
                        {ownedCourses && ownedCourses.map((courseData) => (
                            <div key={courseData._id} className={styles.courseItem}>
                                {/* <CourseCard courseId={courseData.courseId} type={"purchased"} /> */}
                                <ItemCard course={courseData} type="owned" scale={18}/>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Khóa học đã tạo</h2>
                    <div className={styles.courseGrid}>
                        {createdCourses && createdCourses.map((courseData) => (
                            <div key={courseData._id} className={styles.courseItem}>
                                {/* <CourseCard courseId={courseId} type={"created"}/> */}
                                <ItemCard course={courseData} type="created" scale={18}/>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default MyCourses;