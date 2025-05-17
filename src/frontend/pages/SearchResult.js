import { useSearchParams } from "react-router-dom";
import styles from "./SearchResult.module.css";
import PaginatedCourseList from "../elements/PaginatedCourseList";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useGetSearchResult from "../hooks/useGetSearchResult";
import Loading from "./misc/Loading";
import ErrorPage from "./misc/ErrorPage";
import { useEffect, useState } from "react";
import useIsMobile from "../hooks/useIsMobile";
import VerticalCourseList from "../elements/VerticalCourseList";

const SearchResult = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("query")?.toLowerCase() || "";
    const [minPrice, setMinPrice] = useState(searchParams.get("min") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("max") || "");
    const [minRating, setMinRating] = useState(searchParams.get("rating") || "");
    const [sortBy, setSortBy] = useState(searchParams.get("sort") || "");

    const { courses, loading, error, fetchCourse } = useGetSearchResult();

    useDocumentTitle(`Tìm kiếm cho "${query}"`);

    const isLaptop = useIsMobile('(max-width: 1450px)');
    const isTablet = useIsMobile('(max-width: 1024px)');
    const isMobile = useIsMobile('(max-width: 768px)');


    useEffect(() => {
        if (query) {
            fetchCourse({ query, minPrice, maxPrice, minRating, sortBy });
        }
        // eslint-disable-next-line
    }, []);

    const handleFilterClick = async () => {
        // Gọi API với filter hiện tại
        await fetchCourse({ query, minPrice, maxPrice, minRating, sortBy });

        // Cập nhật URL (không bắt buộc)
        const newParams = new URLSearchParams();
        newParams.set("query", query);
        if (minPrice) newParams.set("min", minPrice);
        if (maxPrice) newParams.set("max", maxPrice);
        if (minRating) newParams.set("rating", minRating);
        if (sortBy) newParams.set("sort", sortBy);
        setSearchParams(newParams);
    };

    const handleClearFilterClick = async () => {
        setMaxPrice("");
        setMinPrice("");
        setMinRating("");
        setSortBy("");

        await fetchCourse({ query });
    }

    if (loading) {
        return <Loading />
    }

    if (error) return <ErrorPage message={error} />;

    return <div className="flex-col justify-center">
        <h1 className={`${styles["search-header"]} h3`}>{`Kết quả tìm kiếm cho "${query}"`}</h1>
        <div className={`${styles.page}`}>
            {!isTablet && <div className={styles["left-box"]}>
                {courses &&
                    (courses.length !== 0 ?
                        <PaginatedCourseList courses={courses} columns={isLaptop ? 2 : 3} maxItemPerPage={isLaptop ? 10 : 15} />
                        : <div className="h4">Không tìm thấy kết quả.</div>)
                }
            </div>}

            <div className={styles["right-box"]}>
                <p className="h5">Lọc kết quả</p>
                <div className={styles["filter-group"]}>
                    <div>
                        <label>Giá tối thiểu</label>
                        <input type="number" name="min" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                        <label>Giá tối đa</label>
                        <input type="number" name="max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />

                        {isTablet && <div className="">
                            <label>Sắp xếp theo</label>
                            <select name="sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                <option value="">-- Chọn --</option>
                                <option value="price_asc">Giá tăng dần</option>
                                <option value="price_desc">Giá giảm dần</option>
                                <option value="enroll_desc">Lượt đăng ký giảm dần</option>
                            </select>
                        </div>}
                    </div>

                    <div>
                        <div className="">
                            <h4 className={`${isMobile ? 'h5' : 'h4'} bold`}>Đánh giá tối thiểu</h4>
                            {['5', '4', '3', '2', '1'].map(star => (
                                <div key={star} className="flex-row align-center">
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={star}
                                        id={`star-${star}`}
                                        checked={minRating === star}
                                        onChange={e => setMinRating(e.target.value)}
                                    />
                                    <label htmlFor={`star-${star}`}>{star} sao trở lên</label>
                                </div>
                            ))}
                        </div>

                        {!isTablet && <div className="">
                            <label>Sắp xếp theo</label>
                            <select name="sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                <option value="">-- Chọn --</option>
                                <option value="price_asc">Giá tăng dần</option>
                                <option value="price_desc">Giá giảm dần</option>
                                <option value="enroll_desc">Lượt đăng ký giảm dần</option>
                            </select>
                        </div>}

                        <button className="" onClick={handleFilterClick}>
                            Lọc kết quả
                        </button>
                        <button className=""
                            style={{
                                backgroundColor: "honeydew",
                                color: "forestgreen",
                            }}
                            onClick={handleClearFilterClick}>
                            Xoá bộ lọc
                        </button>
                    </div>

                </div>
            </div>

            {isTablet && <div className={styles["left-box"]}>
                {courses &&
                    (courses.length !== 0 ?
                        isMobile ?
                            <VerticalCourseList items={courses}/>
                            :
                            <PaginatedCourseList courses={courses} columns={2} maxItemPerPage={10} />
                        : <div className="h4">Không tìm thấy kết quả.</div>)
                }
            </div>}
        </div>
    </div>
}

export default SearchResult;