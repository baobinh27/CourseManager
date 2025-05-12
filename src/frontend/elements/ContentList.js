import { useEffect, useState } from "react";
import styles from "./ContentList.module.css";
import { FaAngleDown, FaAngleUp, FaClock, FaPlayCircle, FaThList } from "react-icons/fa";
import helper from "../utils/helper";
import useIsMobile from "../hooks/useIsMobile";

function getContentOverview(content) {
    let totalSeconds = 0, totalMinutes = 0, totalHours = 0;
    let totalItems = 0;
    const regex = /PT(\d+H)?(\d+M)?(\d+S)?/;
    
    content.forEach(section => {
        section.sectionContent.forEach(item => {
            totalItems++;
            const match = item.duration.match(regex);
            totalHours += match[1] ? parseInt(match[1]) : 0;
            totalMinutes += match[2] ? parseInt(match[2]) : 0;
            totalSeconds += match[3] ? parseInt(match[3]) : 0;
        })
    });

    totalMinutes += Math.floor(totalSeconds / 60);
    totalSeconds %= 60;
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes %= 60;

    return `Bao gồm ${content.length} chương, ${totalItems} nội dung, tổng thời lượng ${totalHours > 0 ? totalHours + "h " : ""}${totalMinutes}m ${totalSeconds}s.`;
}

const ContentList = ({content}) => {

    const isMobile = useIsMobile('(max-width: 768px)');
    const [showSectionDetail, setShowSectionDetail] = useState([]);    

    useEffect(() => {
        if (!content) return;
        setShowSectionDetail(content.map(() => false));        
    }, [content])

    const toggleSection = (index) => {
        setShowSectionDetail((prevState) =>
            prevState.map((item, i) => (i === index ? !item : item))
        );
    };

    return <div className={`flex-col ${styles.gap}`}>
        <h3 className="h3">Nội dung khoá học</h3>
        {content && <div className={`flex-row ${styles["justify-center"]} ${styles.gap}`}>
            <FaThList />
            <h1 className="h5">{getContentOverview(content)}</h1>
        </div>}
        {content && content.map((section, index) => (
            <div key={index}>

                <button
                    onClick={() => toggleSection(index)}
                    className={styles.section}
                >
                    <p className="h4 truncate">{`${index + 1}. ${section.sectionTitle}`}</p> 
                    
                    {showSectionDetail[index] ? <FaAngleUp /> : <FaAngleDown />}
                </button>

                {showSectionDetail[index] && 
                    <ul type="none">
                        {section.sectionContent.map(video => (
                            <li key={video.videoId} className={styles.item}>
                                <div className={`flex-row justify-center ${styles.gap} h5`} style={{width: `${isMobile ? "calc(100% - 6rem)" : "80%"}`}}>
                                    <FaPlayCircle style={{fill: "#ff7700", width: "1.5rem"}} />
                                    <p className={`${isMobile ? "h6" : "h5"} truncate`}>{video.title}</p>
                                </div>
                                <div className={`flex-row "justify-center" ${styles.gap} ${isMobile ? "h6" : "h5"}`}>
                                    {helper.formatDuration(video.duration)}
                                    <FaClock style={{fill: "forestgreen", width: "1.5rem"}}/>
                                </div>
                            </li>
                        ))}
                    </ul>}
            </div>
        ))}
    </div>
}

export default ContentList;