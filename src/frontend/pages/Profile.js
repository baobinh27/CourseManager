import { useNavigate, useParams } from "react-router-dom";
import useGetUserDetail from "../hooks/useGetUserDetail";
import Loading from "./misc/Loading";
import ErrorPage from "./misc/ErrorPage";
import styles from "./Profile.module.css";
import ScrollList from "../elements/ScrollCourseList";
import useGetMultipleCourseDetails from "../hooks/useGetMultipleCourseDetails";
import { useEffect, useState } from "react";
import { ImProfile } from "react-icons/im";
import { FaEdit, FaKey, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import helper from "../utils/helper";
import useIsMobile from "../hooks/useIsMobile";
import VerticalCourseList from "../elements/VerticalCourseList";

const Profile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user, loading: loadingUser, error: userError } = useGetUserDetail(id);

    const [ownedCourseIds, setOwnedCourseIds] = useState([]);
    const { courses: ownedCourses, loading: loadingOwnedCourses, error: ownedCoursesError } = useGetMultipleCourseDetails(ownedCourseIds);
    const [createdCourseIds, setCreatedCourseIds] = useState([]);
    const { courses: createdCourses, loading: loadingCreatedCourses, error: createdCoursesError } = useGetMultipleCourseDetails(createdCourseIds);
    const [courseProgresses, setCourseProgresses] = useState([]);


    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(user ? user.description : "");

    const isMobile = useIsMobile('(max-width: 768px)');
    const isTablet = useIsMobile('(max-width: 1024px)');
    const isLaptop = useIsMobile('(max-width: 1450px)');

    useEffect(() => {
        if (user && user.ownedCourses) {
            const ids = user.ownedCourses.map(item => item.courseId);
            setOwnedCourseIds(ids);
        }
        if (user && user.createdCourses) {
            setCreatedCourseIds(user.createdCourses);
        }
    }, [user]);

    useEffect(() => {
        if (ownedCourses) {
            const progresses = ownedCourses.map((ownedCourse, index) => {
                const totalVideos = helper.countVideosInCourse(ownedCourse.content);
                const completedVideos = user.ownedCourses[index]?.completedVideos?.length || 0;
                return totalVideos > 0 ? ((completedVideos * 100) / totalVideos).toLocaleString({}, { maximumFractionDigits: 1, minimumFractionDigits: 0 }) : 0;
            });

            setCourseProgresses(progresses);
        }
    }, [user, ownedCourses])

    if (loadingUser || loadingOwnedCourses || loadingCreatedCourses) {
        return <Loading />
    }

    if (userError) return <ErrorPage message={userError} />;
    if (ownedCoursesError) return <ErrorPage message={ownedCoursesError} />;
    if (createdCoursesError) return <ErrorPage message={createdCoursesError} />;

    const handleSave = () => {
        // TODO: Gửi request lên server để cập nhật mô tả nếu cần
        setIsEditing(false);
    };

    return <div className={`${styles.page} ${isTablet ? "flex-col align-center" : "flex-row justify-center"}`}>
        <div className={`${styles["left-col"]}`}>
            <div className={styles.section} style={{ border: "none" }}>
                <h1 className="h3">Thông tin cá nhân</h1>

                <section className={`${styles.subSection}`}>
                    <div className="flex-row justify-between align-center">
                        <div className="flex-row" style={{ gap: "0.5vw" }}>
                            <FaUser />
                            <p className="h6">Tên người dùng: </p>
                        </div>
                        <p className="h5 bold">{user.username}</p>
                    </div>
                    <div className="flex-row justify-between align-center">
                        <div className="flex-row" style={{ gap: "0.5vw" }}>
                            <ImProfile />
                            <p className="h6">ID: </p>
                        </div>
                        <p className="h6">{user._id}</p>
                    </div>
                    <div className="flex-row justify-between align-center">
                        <div className="flex-row" style={{ gap: "0.5vw" }}>
                            <MdEmail />
                            <p className="h6">Email: </p>
                        </div>
                        <p className="h6 truncate">{user.email}</p>
                    </div>
                </section>

                <section className={`${styles.subSection}`}>
                    <div className="flex-row align-center" style={{ gap: "0.5vw" }}>
                        <p className="h5">Mô tả:</p>
                        <FaEdit style={{ cursor: "pointer", fill: "forestgreen" }} onClick={() => setIsEditing(true)} />
                    </div>

                    {isEditing ? (
                        <>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className={styles["description-input"]}
                                rows={3}
                            />
                            <div className="flex-row justify-between">
                                <button
                                    className={`${styles["description-save"]} h6`}
                                    onClick={handleSave}
                                >
                                    Lưu
                                </button>
                                <button
                                    className={`${styles["description-cancel"]} h6`}
                                    onClick={() => setIsEditing(false)}
                                >
                                    Huỷ
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="italic" style={{ opacity: `${description ? 1 : 0.5}` }}>
                                {description || "Chưa có mô tả."}
                            </p>
                        </>
                    )}
                </section>
            </div>
            <div className={styles.section}>
                <h1 className="h3">Tuỳ chọn</h1>
                <button onClick={() => navigate(`/change-password`)} className={`${styles["menu-btn"]} h5 bold flex-row align-center`}>
                    <FaKey />
                    Đổi mật khẩu
                </button>
            </div>
        </div>

        <div className={`${styles['right-col']}`}>
            <div>
                <p className={`${styles["list-title"]} h3`}>Khoá học đã mua</p>
                {ownedCourses &&
                    isMobile ?
                    <VerticalCourseList items={ownedCourses} type="owned-viewing" percents={courseProgresses}/>
                    :
                    <ScrollList items={ownedCourses} type="owned-viewing" visibleCount={isLaptop ? 2 : 3} scale={16} percents={courseProgresses} />}
            </div>

            <div>
                <p className={`${styles["list-title"]} h3`}>Khoá học đã tạo</p>
                {createdCourses && 
                    isMobile ? 
                    <VerticalCourseList items={createdCourses} type="created"/>
                    :
                    <ScrollList items={createdCourses} type="created" visibleCount={isLaptop ? 2 : 3} scale={16} />}
            </div>
        </div>
    </div>
}

export default Profile;