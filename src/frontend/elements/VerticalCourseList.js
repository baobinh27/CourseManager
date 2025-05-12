import HorizontalItemCard from "./HorizontalItemCard";


const VerticalCourseList = ({ items, visibleCount = 10, type = 'not-owned', scale = 20, percents = [] }) => {
    // const displayItems = items.slice(0, visibleCount);

    return <div className="flex-col" style={{ gap: "1rem" }}>
        {items.map((course, index) => (
            <div style={{ minHeight: "5rem" }}>
                <HorizontalItemCard
                    course={course}
                    type={type}
                    scale={scale}
                    percent={percents[index] || 0}
                />
            </div>

        ))}
    </div>
}

export default VerticalCourseList;