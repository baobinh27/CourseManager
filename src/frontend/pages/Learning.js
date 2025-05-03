import { Link, useSearchParams, useNavigate } from "react-router-dom";
import styles from "./Learning.module.css";
import { FaChevronLeft, FaPlayCircle } from "react-icons/fa";
import useDocumentTitle from "../hooks/useDocumentTitle";
import helper from "../utils/helper";
import VideoPlayer from "../elements/VideoPlayer";
import useGetCourseDetail from "../hooks/useGetCourseDetail.js";
import Loading from "./misc/Loading.js";
import ErrorPage from "./misc/ErrorPage.js";
import { useVideoTitle } from "../hooks/useVideoTitle.js";
import { useEffect, useState } from "react";
import axios from "axios";

const Learning = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const courseId = searchParams.get("courseId") || "";
    const adminPreview = searchParams.get("adminPreview") === "true";
    
    const [draftCourse, setDraftCourse] = useState(null);
    const [draftLoading, setDraftLoading] = useState(false);
    const [draftError, setDraftError] = useState(null);
    
    // Always call the hook, but we may ignore the result
    const { course: regularCourse, loading: regularLoading, error: regularError } = useGetCourseDetail(courseId);
    
    // Use either the draft course or the regular course based on adminPreview flag
    const course = adminPreview ? draftCourse : regularCourse;
    
    useDocumentTitle((adminPreview && draftCourse) ? `Preview: ${draftCourse.name}` : regularCourse?.name);

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
    const isLoading = adminPreview ? draftLoading : regularLoading;
    const hasError = adminPreview ? draftError : regularError;
    
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

    if (!course || !videoId || isLoading) {
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
                {course.content.map((section, index) => (<>
                    <div className={`${styles["nav-section"]} h4 bold truncate`}>{`${index + 1}. ${section.sectionTitle}`}</div>
                    {section.sectionContent.map((video) => {
                        return <Link 
                            to={`/learning?courseId=${courseId}&video=${video.videoId}${adminPreview ? '&adminPreview=true' : ''}`}
                            className="link"
                        >
                            <div className={`${styles["nav-content"]} h5`}>
                            <div className={`truncate h5`}>
                                {video.title}
                            </div>
                            <div className={`${styles["flex-row"]} ${styles["align-center"]}`}>
                                <FaPlayCircle fill="#ff7700"/>
                                <p className="h6">{helper.formatDuration(video.duration)}</p>
                            </div>
                            </div>
                        </Link>
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
                    <VideoPlayer videoId={videoId}/>
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