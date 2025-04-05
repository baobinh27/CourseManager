import { useSearchParams } from "react-router-dom";
import courses from "../../mock_data/courses";
import styles from "./SearchResult.module.css";
import PaginatedCourseList from "../elements/PaginatedCourseList";

const SearchResult = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("name")?.toLowerCase() || "";

    const filteredCourses = courses.filter((course) =>
        course.name.toLowerCase().includes(query) ||
        course.tags.some((tag) => tag.toLowerCase().includes(query))
    );    

    return <>
        <h1 className={`${styles["search-header"]} h3`}>{`Kết quả tìm kiếm cho "${query}"`}</h1>
        <div className={`${styles["flex-row"]} ${styles.page}`}>
            <div className={styles["left-box"]}>
                {filteredCourses && 
                    (filteredCourses.length !== 0 ? 
                        <PaginatedCourseList courses={filteredCourses} columns={3} maxItemPerPage={15}/> 
                    : <div className="h4">Không tìm thấy kết quả.</div>)
                }
            </div>
            {filteredCourses?.length !== 0 && <div className={styles["right-box"]}>
                <p className="h5">Lọc kết quả</p>
            </div>}
            
        </div>        
    </>
}

export default SearchResult;