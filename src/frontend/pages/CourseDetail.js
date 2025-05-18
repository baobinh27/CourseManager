import { useNavigate, useParams } from "react-router-dom";
import TagsList from "../elements/TagsList";
import styles from "./CourseDetail.module.css";
import { FaCalendarCheck, FaCheck, FaStar, FaTags, FaUserCheck } from "react-icons/fa";
import CourseRatings from "../elements/CourseRatings";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useGetCourseDetail from "../hooks/useGetCourseDetail";
import Loading from "./misc/Loading";
import ErrorPage from "./misc/ErrorPage";
import { useAuth } from "../hooks/useAuth";
import useGetUserDetail from "../hooks/useGetUserDetail";
import useGetCourseReviews from "../hooks/reviews/useGetCourseReviews";
import useIsMobile from "../hooks/useIsMobile";
import ContentListUser from "../elements/ContentListUser";

const CourseDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const { userInfo: userToken, isLoggedIn } = useAuth();
    const { user, loading: loadingUser, error: userError } = useGetUserDetail(userToken?.userId);

    const { course, loading: loadingCourse, error: courseError } = useGetCourseDetail(id);

    const { reviews, loading: loadingReviews, error: reviewError } = useGetCourseReviews(id);

    useDocumentTitle(course?.name);

    // const isDesktop = useIsMobile('(max-width: 1450px)');
    const isTablet = useIsMobile('(max-width: 1024px)');
    const isMobile = useIsMobile('(max-width: 768px)');

    const onPurchaseClick = () => {
        if (!isLoggedIn) {
            navigate(`/purchase?courseId=${id}`)
            return;
        }
        if (user.ownedCourses.some(course => course.courseId === id)) {
            navigate('/my-courses');
            return;
        }
        if (user.createdCourses.some(createdId => createdId === id)) {
            navigate('/my-courses');
            return;
        }
        navigate(`/purchase?courseId=${id}`)
    }

    if ((isLoggedIn && loadingUser) || loadingCourse || loadingReviews) {
        return <Loading />
    }

    if (courseError) return <ErrorPage message={courseError} />;
    if (userError) return <ErrorPage message={userError} />;
    if (reviewError) return <ErrorPage message={reviewError} />;

    return (
        isMobile ? <div className={`flex-col ${styles.page}`}>
            <div className={`${styles["right-box"]} flex-row justify-between`}>
                <img src={course.banner} alt="" className={styles["course-img"]} />
                <h1 className={`${styles.price} h4 bold`}>{course.price ? (course.price.toLocaleString("vi-VN") + "₫") : ""}</h1>
                <button onClick={onPurchaseClick} className={`${styles["buy-btn"]} h5 bold`}>
                    {
                        user && (user?.ownedCourses.some(course => course.courseId === id) ||
                            user?.createdCourses.some(createdId => createdId === id)) ? "Xem khoá học" : "Mua"
                    }
                </button>
            </div>

            <div className={styles["left-box"]}>

                <div className={styles["overview-box"]}>

                    <h1 className={`${isTablet ? "h2" : "h1"}`}>{course.name}</h1>

                    <div className={`flex-row ${styles["justify-center"]} ${styles.gap}`}>
                        <FaCheck />
                        <p className={`${isTablet ? "h6" : "h5"}`}>{course.description}</p>
                    </div>

                    <div className={`flex-row ${styles["justify-center"]} ${styles.gap}`}>
                        <FaUserCheck />
                        <h1 className={`${isTablet ? "h6" : "h5"}`}>{"Tạo bởi " + course.author}</h1>
                    </div>

                    {course.tags ? <div className={`flex-row ${styles["justify-center"]} ${styles.gap}`}>
                        <FaTags />
                        <TagsList tags={course.tags} shorten={false} mini={isMobile}/>
                    </div> : null}

                    <div className={`flex-row ${styles["justify-center"]} ${styles.gap}`}>
                        <FaStar style={{ fill: "gold" }} />
                        <p className={`${isTablet ? "h6" : "h5"}`}>{`${course.averageRating} (${course.reviewCount})`}</p>
                        <p className={`${isTablet ? "h6" : "h5"}`}>{`${course.enrollCount} đã đăng ký`}</p>
                    </div>

                    <div className={`flex-row ${styles["justify-center"]} ${styles.gap}`}>
                        <FaCalendarCheck />
                        <p className={`${isTablet ? "h6" : "h5"}`}>{`Cập nhật lần cuối: ${course.lastModified?.slice(0, 10).split('-').reverse().join('/')}`}</p>
                    </div>
                </div>

                <div className={styles["detail-box"]}>
                    <ContentListUser content={course.content} />
                    <CourseRatings courseId={id} reviews={reviews} commentEnabled={user?.ownedCourses.some(course => course.courseId === id) || false} />
                </div>

            </div>
        </div> : <div className={`flex-row ${styles.page}`}>
            <div className={styles["left-box"]}>

                <div className={styles["overview-box"]}>

                    <h1 className={`${isTablet ? "h2" : "h1"}`}>{course.name}</h1>

                    <div className={`flex-row ${styles["justify-center"]} ${styles.gap}`}>
                        <FaCheck/>
                        <p className={`${isTablet ? "h6" : "h5"}`}>{course.description}</p>
                    </div>

                    <div className={`flex-row ${styles["justify-center"]} ${styles.gap}`}>
                        <FaUserCheck />
                        <h1 className={`${isTablet ? "h6" : "h5"}`}>{"Tạo bởi " + course.author}</h1>
                    </div>

                    {course.tags ? <div className={`flex-row ${styles["justify-center"]} ${styles.gap}`}>
                        <FaTags />
                        <TagsList tags={course.tags} shorten={false} mini={isMobile}/>
                    </div> : null}

                    <div className={`flex-row ${styles["justify-center"]} ${styles.gap}`}>
                        <FaStar style={{ fill: "gold" }} />
                        <p className={`${isTablet ? "h6" : "h5"}`}>{`${course.averageRating} (${course.reviewCount})`}</p>
                        <p className={`${isTablet ? "h6" : "h5"}`}>{`${course.enrollCount} đã đăng ký`}</p>
                    </div>

                    <div className={`flex-row ${styles["justify-center"]} ${styles.gap}`}>
                        <FaCalendarCheck />
                        <p className={`${isTablet ? "h6" : "h5"}`}>{`Cập nhật lần cuối: ${course.lastModified?.slice(0, 10).split('-').reverse().join('/')}`}</p>
                    </div>
                </div>

                <div className={styles["detail-box"]}>
                    <ContentListUser content={course.content} />
                    <CourseRatings courseId={id} reviews={reviews} commentEnabled={user?.ownedCourses.some(course => course.courseId === id) || false} />
                </div>

            </div>
            <div className={styles["right-box"]}>
                <div>
                    <img src={course.banner} alt="" className={styles["course-img"]} />
                    <div className={styles["price-box"]}>
                        <h1 className={`${styles.price} ${isTablet ? "h4 bold" : "h2"}`}>{course.price ? (course.price.toLocaleString("vi-VN") + "₫") : ""}</h1>
                        <button onClick={onPurchaseClick} className={`${styles["buy-btn"]} ${isTablet ? "h5" : "h4"} bold`}>
                            {
                                user && (user?.ownedCourses.some(course => course.courseId === id) ||
                                    user?.createdCourses.some(createdId => createdId === id)) ? "Xem khoá học" : "Mua"
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>)
}

export default CourseDetail;