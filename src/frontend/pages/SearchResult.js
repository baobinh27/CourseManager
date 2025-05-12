import { useSearchParams } from "react-router-dom";
import styles from "./SearchResult.module.css";
import PaginatedCourseList from "../elements/PaginatedCourseList";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useGetSearchResult from "../hooks/useGetSearchResult";
import Loading from "./misc/Loading";
import ErrorPage from "./misc/ErrorPage";

const SearchResult = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query")?.toLowerCase() || "";

    const { courses, loading, error } = useGetSearchResult(query);

    useDocumentTitle(`Tìm kiếm cho "${query}"`);

    if (loading) {
        return <Loading />
    }

    if (error) return <ErrorPage message={error} />;

    

    return <>
        <h1 className={`${styles["search-header"]} h3`}>{`Kết quả tìm kiếm cho "${query}"`}</h1>
        <div className={`${styles["flex-row"]} ${styles.page}`}>
            <div className={styles["left-box"]}>
                {courses && 
                    (courses.length !== 0 ? 
                        <PaginatedCourseList courses={courses} columns={3} maxItemPerPage={3}/> 
                    : <div className="h4">Không tìm thấy kết quả.</div>)
                }
            </div>
            {courses?.length !== 0 && <div className={styles["right-box"]}>
                <p className="h5">Lọc kết quả</p>
            </div>}
            
        </div>        
    </>
}

export default SearchResult;