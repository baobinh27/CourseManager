import { useParams } from "react-router-dom";
import useGetUserDetail from "../hooks/useGetUserDetail";
import Loading from "./misc/Loading";
import ErrorPage from "./misc/ErrorPage";
import styles from "./Profile.module.css";
import ScrollList from "../elements/ScrollCourseList";
import useGetMultipleCourseDetails from "../hooks/useGetMultipleCourseDetails";
import { useEffect, useState } from "react";
import { ImProfile } from "react-icons/im";
import { FaEdit, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Profile = () => {
    const { id } = useParams();
    const { user, loading: loadingUser, error: userError } = useGetUserDetail(id);

    const [ownedCourseIds, setOwnedCourseIds] = useState([]);
    const { courses: ownedCourses, loading: loadingOwnedCourses, error: ownedCoursesError } = useGetMultipleCourseDetails(ownedCourseIds);
    const [createdCourseIds, setCreatedCourseIds] = useState([]);
    const { courses: createdCourses, loading: loadingCreatedCourses, error: createdCoursesError } = useGetMultipleCourseDetails(createdCourseIds);


    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(user ? user.description : "");


    useEffect(() => {
        if (user && user.ownedCourses) {
            const ids = user.ownedCourses.map(item => item.courseId);
            setOwnedCourseIds(ids);
        }
        if (user && user.createdCourses) {
            setCreatedCourseIds(user.createdCourses);
        }
    }, [user]);

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

    console.log(user);
    console.log(ownedCourses);


    return <div className={`${styles.page} flex-row`}>
        <div className={`${styles["left-col"]}`}>
            <h1 className="h3">Thông tin cá nhân</h1>

            <section className={`${styles.section}`}>
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

            <section className={`${styles.section}`}>
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
                        {/* <button
                                className="mt-2 text-sm text-blue-600 underline"
                                onClick={() => setIsEditing(true)}
                            >
                                Chỉnh sửa
                            </button> */}
                    </>
                )}
            </section>


        </div>

        <div className={`${styles['right-col']}`}>
            <div>
                <p className={`${styles["list-title"]} h3`}>Khoá học đã mua</p>
                {ownedCourses && <ScrollList items={ownedCourses} type="owned-viewing" visibleCount={3} scale={16} />}
            </div>

            <div>
                <p className={`${styles["list-title"]} h3`}>Khoá học đã tạo</p>
                {createdCourses && <ScrollList items={createdCourses} type="created" visibleCount={3} scale={16} />}
            </div>
        </div>
    </div>
}

export default Profile;