import React, { useState } from "react";
import styles from "./MyCourses.module.css";
import { useAuth } from "../api/auth";
import LoginRequired from "./misc/LoginRequired";
import { useEffect } from "react";
import Loading from "./misc/Loading";
import ErrorPage from "./misc/ErrorPage";
import useGetMultipleCourseDetails from "../hooks/useGetMultipleCourseDetails";
import useGetUserDetail from "../hooks/useGetUserDetail";
import helper from "../utils/helper";
import useIsMobile from "../hooks/useIsMobile";
import VerticalCourseList from "../elements/VerticalCourseList";
import PaginatedCourseList from "../elements/PaginatedCourseList";

function MyCourses() {
    const { user } = useAuth();

    const { user: userData, loading: loadingUser, error: userError } = useGetUserDetail(user?.userId);

    const [ownedCourseIds, setOwnedCourseIds] = useState([]);
    const { courses: ownedCourses, loading: loadingOwnedCourses, error: ownedCoursesError } = useGetMultipleCourseDetails(ownedCourseIds);
    const [courseProgresses, setCourseProgresses] = useState([]);
    const [createdCourseIds, setCreatedCourseIds] = useState([]);
    const { courses: createdCourses, loading: loadingCreatedCourses, error: createdCoursesError } = useGetMultipleCourseDetails(createdCourseIds);

    const isLaptop = useIsMobile('(max-width: 1450px)')
    const isTablet = useIsMobile('(max-width: 1024px)');
    const isMobile = useIsMobile('(max-width: 768px)');

    useEffect(() => {
        if (userData && userData.ownedCourses) {
            const ids = userData.ownedCourses.map(item => item.courseId);
            setOwnedCourseIds(ids);
        }
        if (userData && userData.createdCourses) {
            setCreatedCourseIds(userData.createdCourses);
        }
    }, [userData]);

    useEffect(() => {
        if (!ownedCourses || !userData) return;

        const fetchProgresses = () => {
            const progresses = ownedCourses.map((ownedCourse, index) => {
                const totalVideos = helper.countVideosInCourse(ownedCourse.content);
                const completedVideos = userData.ownedCourses[index]?.completedVideos?.length || 0;
                return totalVideos > 0 ? ((completedVideos * 100) / totalVideos).toLocaleString({}, { maximumFractionDigits: 1, minimumFractionDigits: 0 }) : 0;
            });

            setCourseProgresses(progresses);
        };

        fetchProgresses();
    }, [ownedCourses, userData]);

    if (!user) {
        return <LoginRequired />
    }

    if (loadingUser || loadingOwnedCourses || loadingCreatedCourses) {
        return <Loading />
    }

    if (userError) return <ErrorPage message={userError} />;
    if (ownedCoursesError) return <ErrorPage message={ownedCoursesError} />;
    if (createdCoursesError) return <ErrorPage message={createdCoursesError} />;

    return (
        <div className={`${styles.container} flex-col align-center`}>
            <section className={styles.section}>
                <h2 className={`${styles.sectionTitle} ${isMobile ? "h4" : "h2"}`}>Khóa học đã mua</h2>
                {isMobile ?
                    <VerticalCourseList
                        items={ownedCourses}
                        type={"owned"}
                        percents={courseProgresses}
                    /> :
                    <PaginatedCourseList
                        courses={ownedCourses}
                        scale={isTablet ? 18 : 20}
                        columns={isTablet ? 2 : isLaptop ? 3 : 4}
                        type={"owned"}
                        percents={courseProgresses}
                    />}
            </section>

            <section className={styles.section}>
                <h2 className={`${styles.sectionTitle} ${isMobile ? "h4" : "h2"}`}>Khóa học đã tạo</h2>
                {isMobile ?
                    <VerticalCourseList
                        items={createdCourses}
                        type={"created"}
                    /> :
                    <PaginatedCourseList
                        courses={createdCourses}
                        scale={isTablet ? 18 : 20}
                        columns={isTablet ? 2 : isLaptop ? 3 : 4}
                        type={"created"}
                    />}
            </section>
        </div>
    );
}

export default MyCourses;