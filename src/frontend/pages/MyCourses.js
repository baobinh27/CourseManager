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

const countVideosInCourse = (content) => {
    if (!Array.isArray(content)) return 0;
  
    return content.reduce((total, section) => {
      if (Array.isArray(section.sectionContent)) {
        return total + section.sectionContent.length;
      }
      return total;
    }, 0);
  };

function MyCourses() {
    const { user } = useAuth();

    const { user: userData, loading: loadingUser, error: userError } = useGetUserDetail(user?.userId);    

    const [ownedCourseIds, setOwnedCourseIds] = useState([]);
    const { courses: ownedCourses, loading: loadingOwnedCourses, error: ownedCoursesError } = useGetMultipleCourseDetails(ownedCourseIds);
    const [courseProgresses, setCourseProgresses] = useState([]);
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
        userData && console.log("user data:", userData);
        
    }, [userData]);

    useEffect(() => {
        if (!ownedCourses || !userData) return;
    
        const fetchProgresses = () => {
            const progresses = ownedCourses.map((ownedCourse, index) => {
                const totalVideos = countVideosInCourse(ownedCourse.content);
                const completedVideos = userData.ownedCourses[index]?.completedVideos?.length || 0;
                return totalVideos > 0 ? ((completedVideos * 100) / totalVideos).toLocaleString({}, {maximumFractionDigits: 1, minimumFractionDigits: 0}) : 0;
            });
    
            setCourseProgresses(progresses);
        };
    
        fetchProgresses();
    }, [ownedCourses, userData]);

    useEffect(() => {
        console.log(courseProgresses);
    }, [courseProgresses])

    if (!user) {
        return <UnAuthorized />
    }

    if (loadingUser || loadingOwnedCourses || loadingCreatedCourses) {
        return <Loading />
    }

    if (userError) return <ErrorPage message={userError} />;    
    if (ownedCoursesError) return <ErrorPage message={ownedCoursesError} />;   
    if (createdCoursesError) return <ErrorPage message={createdCoursesError} />; 
    
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Khóa học đã mua</h2>
                    <div className={styles.courseGrid}>
                        {ownedCourses && ownedCourses.map((courseData, index) => (
                            <div key={courseData._id} className={styles.courseItem}>
                                {/* <CourseCard courseId={courseData.courseId} type={"purchased"} /> */}
                                <ItemCard course={courseData} type="owned" scale={18} percent={courseProgresses[index]}/>
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