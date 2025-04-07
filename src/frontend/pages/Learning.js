import { Link, useSearchParams } from "react-router-dom";
import courses from "../../mock_data/courses";
import styles from "./Learning.module.css";
import { FaChevronLeft, FaPlayCircle } from "react-icons/fa";
import useDocumentTitle from "../hooks/useDocumentTitle.ts";
import helper from "../../utils/helper";
import VideoPlayer from "../elements/VideoPlayer";
import { useVideoTitle } from "../hooks/useVideoTitle.ts";

const Learning = () => {
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get("courseId") || "";
    
    
    const course = courses.find((item) => item._id === courseId);
    useDocumentTitle(course.name);

    // Tự động lấy video đầu tiên nếu không truy vấn videoId
    const videoId = searchParams.get("video") || `${course.content[0].sectionContent[0].videoId}`;

    const videoTitle = useVideoTitle(videoId, course);

    if (!course || !videoId) {
        return <>
            <h1>Loading...</h1>
        </>
    }

    return <>
        <LearningHeader courseName={course.name} />
        <div className={`${styles["flex-row"]}`}>
            <div className={styles["content-list"]}>
                {course.content.map((section, index) => (<>
                    <div className={`${styles["nav-section"]} h4 bold truncate`}>{`${index + 1}. ${section.sectionTitle}`}</div>
                    {section.sectionContent.map((video) => {
                        // if (video.videoId === videoId) setVideoName(video.title);
                        return <Link 
                            to={`/learning?courseId=${course._id}&video=${video.videoId}`}
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
                <div className={styles["video-container"]}>
                    <VideoPlayer videoId={videoId}/>
                </div>
                <h1 className="h3">{videoTitle ? videoTitle : "null"}</h1>
            </div>
        </div>
    </>
}

const LearningHeader = ({courseName}) => {
    return <div className={`${styles["flex-row"]} ${styles["align-center"]} ${styles["learning-header"]}`}>
        <Link to="/my-courses" className="link">
            <button className={`${styles["flex-row"]} ${styles["align-center"]} ${styles["back-btn"]} h5`}>
                <div className={`${styles["back-icon-box"]}`}><FaChevronLeft size={"1.5vw"} /></div>
                <div className="h5">Quay lại</div>
            </button>
        </Link>
        
        <div className={`${styles["course-name"]} h4`}>{courseName}</div>
    </div>
}

export default Learning;