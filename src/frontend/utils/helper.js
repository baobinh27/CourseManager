const formatDuration = (duration) => {
    try {
        if (!duration) return "0m 0s";
        
        const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
        const match = duration.match(regex);
        
        if (!match) return "0m 0s";
        
        const hours = match[1] ? parseInt(match[1]) : 0;
        const minutes = match[2] ? parseInt(match[2]) : 0;
        const seconds = match[3] ? parseInt(match[3]) : 0;
        
        return `${hours > 0 ? hours + "h " : ""}${minutes}m ${seconds}s`;
    } catch (error) {
        console.error("Error formatting duration:", error);
        return "0m 0s"; // Trả về giá trị mặc định nếu có lỗi
    }
}

const countVideosInCourse = (content) => {
    if (!Array.isArray(content)) return 0;

    return content.reduce((total, section) => {
        if (Array.isArray(section.sectionContent)) {
            return total + section.sectionContent.length;
        }
        return total;
    }, 0);
};

// eslint-disable-next-line
export default {
    formatDuration,
    countVideosInCourse
}