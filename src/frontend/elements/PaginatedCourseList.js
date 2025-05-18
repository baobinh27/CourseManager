import { useEffect, useState } from "react";
import ItemCard from "./ItemCard"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import styles from "./PaginatedCourseList.module.css";

const PaginatedCourseList = ({courses, columns = 4, type = 'not-owned', maxItemPerPage = 20, scale = 20, percents = []}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (courses && courses.length > 0) {
            setTotalPages(Math.ceil(courses.length / maxItemPerPage));
          } else {
            setTotalPages(1);
          }
    }, [courses, maxItemPerPage])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, [currentPage]);

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
      };
    
    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };
    
    const handlePageClick = (pageNum) => {
        setCurrentPage(pageNum);
    };

    const startIndex = (currentPage - 1) * maxItemPerPage;
    const currentCourses = courses?.slice(startIndex, startIndex + maxItemPerPage);

    if (!courses || courses.length === 0) return <div className="h4" style={{padding: "2rem"}}>Không có khoá học nào.</div>

    return <>
        <div style={{display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, rowGap: "2rem", columnGap: "1rem"}}>
            {currentCourses && currentCourses.map((course, index) => (
                <ItemCard 
                    course={course}
                    scale={scale}
                    type={type}
                    percent={percents[index] || 0}
                />
            ))}
        </div>

        {totalPages > 1 && <div className={styles["page-bar"]} style={{ marginTop: "2rem", textAlign: "center" }}>
        <button disabled={currentPage === 1} onClick={handlePrev} className={styles["page-scroll"]}>
          <FaAngleLeft fill="white"/>
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
            <button
                key={index + 1}
                onClick={() => handlePageClick(index + 1)}
                className={`${styles["page-select"]} h5`}
                style={{
                    backgroundColor: currentPage === index + 1 ? "#FFCF2C" : "#FFE89B",
                    fontWeight: currentPage === index + 1 ? "bold" : "normal",
                    cursor: currentPage === index + 1 ? "auto" : "pointer",
                    margin: "0 0.5rem",
                }}
            >
            {index + 1}
            </button>
        ))}

        <button disabled={currentPage === totalPages} onClick={handleNext} className={styles["page-scroll"]}>
          <FaAngleRight fill="white"/>
        </button>
      </div>}
    </>
}

export default PaginatedCourseList;