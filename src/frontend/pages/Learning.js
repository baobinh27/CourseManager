import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Learning.module.css";
import { FaChevronLeft, FaLock, FaPlayCircle, FaRegPlayCircle } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
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

const Learning = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get("courseId") || "";
    const adminPreview = searchParams.get("adminPreview") === "true";
    const { user } = useAuth();
    
    const [draftCourse, setDraftCourse] = useState(null);
    const [draftLoading, setDraftLoading] = useState(false);
    const [draftError, setDraftError] = useState(null);
    
    // Always call the hook, but we may ignore the result
    const { course: regularCourse, loading: regularLoading, error: regularError } = useGetCourseDetail(courseId);
    
    // Get user data for learning progress
    const { user: userData, loading: loadingUser, error: userError } = useGetUserDetail(user?.userId);

    const { course, loading: loadingCourse, error: courseError } = useGetCourseDetail(courseId);
    useDocumentTitle(course?.name);

    const { updateProgress, error: progressError } = useUpdateProgress();

    const [learningInfo, setLearningInfo] = useState();

    // Track learning progress for regular courses
    useEffect(() => {
        if (!userData || !courseId || adminPreview) return;
        setLearningInfo(userData.ownedCourses.find((ownedCourse) => ownedCourse.courseId === courseId))
    }, [userData, courseId, adminPreview])

    // Load draft course for admin preview
    useEffect(() => {
        const fetchDraftCourse = async () => {
            if (!adminPreview || !courseId) return;
            
            try {
                setDraftLoading(true);
                const response = await axios.get("/api/draftCourse/allDraftCourses");
                const foundCourse = response.data.find(c => c.courseId === courseId);
                
                if (foundCourse) {
                    // Transform draft course content to match published course format for compatibility
                    const transformedCourse = {
                        ...foundCourse,
                        content: foundCourse.content.map(section => ({
                            sectionTitle: section.sectionTitle,
                            sectionContent: section.sectionContent.map(videoId => ({
                                videoId,
                                title: videoId,
                                duration: "0:00"
                            }))
                        }))
                    };
                    
                    setDraftCourse(transformedCourse);
                } else {
                    setDraftError("Draft course not found");
                }
                setDraftLoading(false);
            } catch (err) {
                setDraftError("Error loading draft course");
                setDraftLoading(false);
            }
        };
        
        fetchDraftCourse();
    }, [adminPreview, courseId]);
    
    // Determine loading and error states
    const isLoading = adminPreview ? draftLoading : (regularLoading || loadingUser);
    const hasError = adminPreview ? draftError : (regularError || userError);
    
    // Tự động lấy video đầu tiên nếu không truy vấn videoId
    const videoId = searchParams.get("video") || 
        `${course ? 
            (course.content && course.content.length > 0 && 
             course.content[0].sectionContent && 
             course.content[0].sectionContent.length > 0 ? 
                course.content[0].sectionContent[0].videoId : 
                "") : 
            ""}`;
            
    const videoTitle = useVideoTitle(videoId, course);

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

    if (hasError) return <ErrorPage message={hasError} />;

    return <>
        <LearningHeader 
            courseName={course.name} 
            isAdminPreview={adminPreview}
            onBackClick={() => adminPreview ? 
                navigate(`/admin/course-approval/${courseId}`) : 
                navigate("/my-courses")}
        />
        <div className={`${styles["flex-row"]}`}>
            <div className={styles["content-list"]}>
                {course.content.map((section, sIndex) => (<>
                    <div className={`${styles["nav-section"]} h4 bold truncate`}>{`${sIndex + 1}. ${section.sectionTitle}`}</div>
                    {section.sectionContent.map((video, vIndex) => {
                        // Tính thứ tự toàn cục của video trong khoá học và kiểm tra xem đã mở khóa chưa
                        // Chỉ áp dụng cho regular courses
                        let isUnlocked = true;
                        if (!adminPreview && learningInfo) {
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
                                <div className={`truncate h5`}>
                                    {video.title}
                                </div>
                                <div className={`${styles["flex-row"]} ${styles["align-center"]}`}>
                                    <FaPlayCircle fill={isUnlocked ? "#ff7700" : "#bbb"} />
                                    <p className="h6">{helper.formatDuration(video.duration)}</p>
                                </div>
                            </div>

                        </button>
                    })}
                </>))}
            </div>
            <div className={styles["video-box"]}>
                {adminPreview && (
                    <div className={styles.adminPreviewBanner}>
                        Đây là bản xem trước của khóa học đang chờ duyệt
                    </div>
                )}
                <div className={styles["video-container"]}>
                    <VideoPlayer videoId={videoId} onCompleted={onVideoComplete} />
                </div>
                <h1 className="h3">{videoTitle ? videoTitle : "null"}</h1>
            </div>
        </div>
    </>
}

const LearningHeader = ({courseName, isAdminPreview, onBackClick}) => {
    return <div className={`${styles["flex-row"]} ${styles["align-center"]} ${styles["learning-header"]}`}>
        <button 
            onClick={onBackClick} 
            className={`${styles["flex-row"]} ${styles["align-center"]} ${styles["back-btn"]} h5`}
        >
            <div className={`${styles["back-icon-box"]}`}><FaChevronLeft size={"1.5vw"} /></div>
            <div className="h5">{isAdminPreview ? "Quay lại trang duyệt khóa học" : "Quay lại"}</div>
        </button>
        
        <div className={`${styles["course-name"]} h4`}>
            {isAdminPreview ? `[PREVIEW] ${courseName}` : courseName}
        </div>
    </div>
}

export default Learning;