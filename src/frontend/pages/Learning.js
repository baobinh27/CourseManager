import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Learning.module.css";
import { FaChevronLeft, FaLock, FaPlayCircle, FaRegPlayCircle } from "react-icons/fa";
import useDocumentTitle from "../hooks/useDocumentTitle";
import helper from "../utils/helper";
import VideoPlayer from "../elements/VideoPlayer";
import useGetCourseDetail from "../hooks/useGetCourseDetail.js";
import Loading from "./misc/Loading.js";
import ErrorPage from "./misc/ErrorPage.js";
import { useVideoTitle } from "../hooks/useVideoTitle.js";
import { useAuth } from "../api/auth";
import useGetUserDetail from "../hooks/useGetUserDetail.js";
import { useEffect, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import useUpdateProgress from "../hooks/useUpdateProgress.js";
import useIsMobile from "../hooks/useIsMobile";

const Learning = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get("courseId") || "";
    const { user } = useAuth();

    const { user: userData, loading: loadingUser, error: userError } = useGetUserDetail(user?.userId);

    const { course, loading: loadingCourse, error: courseError } = useGetCourseDetail(courseId);
    useDocumentTitle(course?.name);

    const { updateProgress, error: progressError } = useUpdateProgress();

    const [learningInfo, setLearningInfo] = useState();

    useEffect(() => {
        if (!userData || !courseId) return;
        setLearningInfo(userData.ownedCourses.find((ownedCourse) => ownedCourse.courseId === courseId))
    }, [userData, courseId])

    // Tự động lấy video đầu tiên nếu không truy vấn videoId
    const videoId = searchParams.get("video") || `${course ? course.content[0].sectionContent[0].videoId : ""}`;
    const videoTitle = useVideoTitle(videoId, course);

    const isLaptop = useIsMobile('(max-width: 1450px)')
    const isTablet = useIsMobile('(max-width: 1024px)');
    const isMobile = useIsMobile('(max-width: 768px)');

    const onVideoComplete = async (videoId) => {
        if (learningInfo.completedVideos.includes(videoId)) return;
        setLearningInfo({
            ...learningInfo,
            completedVideos: [...learningInfo.completedVideos, videoId]
        })

        await updateProgress(courseId, videoId);
        // if (updated) {
        //     console.log("Tiến độ cập nhật:", updated);
        // }
        if (progressError) {
            console.log("Cập nhật video thất bại:", progressError);
        }
    }

    if (!course || !videoId || loadingCourse || loadingUser || !learningInfo) {
        return <Loading />
    }

    if (userError) return <ErrorPage message={userError} />;
    if (courseError) return <ErrorPage message={courseError} />;

    return <>
        <LearningHeader courseName={course.name} />
        <div className={`${isTablet ? 'flex-col align-center' : 'flex-row'}`}>

            {isTablet && <div className={styles["video-box"]}>
                <div className={styles["video-container"]}>
                    <VideoPlayer
                        width={isMobile ? "375" : "750"}
                        videoId={videoId}
                        onCompleted={onVideoComplete}
                    />
                </div>
                <h1 className={`h3 truncate ${styles.videoName}`}>{videoTitle ? videoTitle : "null"}</h1>
            </div>}

            <div className={styles["content-list"]}>
                {course.content.map((section, sIndex) => (<>
                    <div className={`${styles["nav-section"]} h4 bold truncate`}>{`${sIndex + 1}. ${section.sectionTitle}`}</div>
                    {section.sectionContent.map((video, vIndex) => {
                        // Tính thứ tự toàn cục của video trong khoá học
                        const flatIndex = course.content
                            .slice(0, sIndex)
                            .reduce((acc, sec) => acc + sec.sectionContent.length, 0) + vIndex;

                        const flatVideoList = course.content.flatMap(s => s.sectionContent.map(v => v.videoId));
                        const completedSet = new Set(learningInfo.completedVideos);

                        const unlockedIndex = flatVideoList.findIndex(
                            videoId => !completedSet.has(videoId)
                        );

                        const currentVideoId = video.videoId;
                        const isUnlocked = completedSet.has(currentVideoId) || flatIndex === unlockedIndex;

                        return <button
                            key={vIndex}
                            onClick={() => navigate(`/learning?courseId=${course._id}&video=${video.videoId}`)}
                            className={`${styles["nav-content"]} ${isUnlocked && video.videoId === videoId ? styles.selected : ""} h5 flex-row align-center`}
                            disabled={!isUnlocked}
                        >
                            {isUnlocked ?
                                learningInfo.completedVideos.includes(video.videoId) ?
                                    <FaCircleCheck fill="forestgreen" /> :
                                    <FaRegPlayCircle fill="#ff7700" />
                                : <FaLock />}
                            <div style={{ width: "90%" }}>
                                <div className={`truncate h5`} style={{ textAlign: "start" }}>
                                    {video.title}
                                </div>
                                <div className={`flex-row align-center`}>
                                    <FaPlayCircle fill={isUnlocked ? "#ff7700" : "#bbb"} />
                                    <p className="h6">{helper.formatDuration(video.duration)}</p>
                                </div>
                            </div>

                        </button>
                    })}
                </>))}
            </div>

            {!isTablet && <div className={styles["video-box"]}>
                <div className={styles["video-container"]}>
                    <VideoPlayer
                        width={isLaptop ? "750" : "960"}
                        videoId={videoId}
                        onCompleted={onVideoComplete}
                    />
                </div>
                <h1 className={`h3 ${styles.videoName}`}>{videoTitle ? videoTitle : "null"}</h1>
            </div>}
        </div>
    </>
}

const LearningHeader = ({ courseName }) => {
    return <div className={`flex-row align-center ${styles["learning-header"]}`}>
        <Link to="/my-courses" className="link">
            <button className={`flex-row align-center ${styles["back-btn"]} h5`}>
                <div className={`${styles["back-icon-box"]}`}><FaChevronLeft size={"1.5rem"} /></div>
                <div className="h5">Quay lại</div>
            </button>
        </Link>

        <div className={`${styles["course-name"]} h4 truncate`}>{courseName}</div>
    </div>
}

export default Learning;