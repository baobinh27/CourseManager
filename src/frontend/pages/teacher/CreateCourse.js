import React, { useState } from 'react';
import styles from './CreateCourse.module.css';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaPlus } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import useCreateDraftCourse from '../../hooks/draft_courses/useCreateDraftCourse';
import { useAuth } from '../../hooks/useAuth';
import UnAuthorized from '../misc/UnAuthorized';
import Header from '../../elements/Header';
import { BiLoaderCircle } from 'react-icons/bi';
import useGetUserDetail from '../../hooks/useGetUserDetail';
import Loading from '../misc/Loading';
import ErrorPage from '../misc/ErrorPage';

const CreateCourse = () => {

    const [course, setCourse] = useState({
        name: '',
        description: '',
        price: 0,
        tags: [],
        banner: '',
        content: [],
    });

    const { userInfo: userToken, isLoggedIn } = useAuth();
    const { user, loading: loadingUser, error: userError } = useGetUserDetail(userToken?.userId);
    const { createDraftCourse, loading, error, success } = useCreateDraftCourse();

    const [showBackWarning, setShowBackWarning] = useState(false);

    const handleChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    const addSection = () => {
        setCourse({
            ...course,
            content: [...course.content, { sectionTitle: '', sectionContent: [] }],
        });
    };

    const removeSection = (index) => {
        const updated = [...course.content];
        updated.splice(index, 1);
        setCourse({ ...course, content: updated });
    };

    const updateSectionTitle = (index, title) => {
        const updated = [...course.content];
        updated[index].sectionTitle = title;
        setCourse({ ...course, content: updated });
    };

    const updateVideo = (sIndex, vIndex, value) => {
        const updated = [...course.content];
        updated[sIndex].sectionContent[vIndex] = value;
        setCourse({ ...course, content: updated });
    };

    const addVideo = (sIndex) => {
        const updated = [...course.content];
        updated[sIndex].sectionContent.push('');
        setCourse({ ...course, content: updated });
    };

    const removeVideo = (sIndex, vIndex) => {
        const updated = [...course.content];
        updated[sIndex].sectionContent.splice(vIndex, 1);
        setCourse({ ...course, content: updated });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createDraftCourse({
            name: course.name,
            author: user.username,
            tags: ["Test"], // Tạm thời hardcode tags cho đến khi xử lý được tags
            description: course.description,
            content: course.content,
            price: course.price,
            banner: course.banner
        })
        
    };

    if (!isLoggedIn) {
        return <>
            <Header />
            <UnAuthorized />
        </>
    }

    if (loadingUser) {
        return <Loading />
    }

    if (userError) {
        return <ErrorPage error={userError}/>
    }

    return (<div className={`${styles.page}`}>
        {showBackWarning && <BackDialog onClickOutside={() => setShowBackWarning(false)} />}
        <div className={`flex-row align-center ${styles.header}`}>
            <button onClick={() => setShowBackWarning(true)} className={`flex-row align-center ${styles["back-btn"]} h5`}>
                <div className={`${styles["back-icon-box"]}`}><FaChevronLeft size={"1.5vw"} /></div>
                <div className="h5">Quay lại</div>
            </button>

            <div className={`${styles.title} h4`}>Tạo khoá học</div>
        </div>
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
                <div className='flex-row justify-between'>
                    <label className={styles.label}>Tên khoá học <span style={{ color: "red" }}>*</span></label>
                    <p>{`${course.name.length}/100`}</p>
                </div>
                <input className={styles.input} name="name" maxLength={100} value={course.name} onChange={handleChange} />
            </div>

            <div className={styles.fieldGroup}>
                <label className={styles.label}>{"Mô tả (ngắn gọn, khoảng dưới 100 từ)"}</label>
                <textarea className={styles.textarea} name="description" value={course.description} onChange={handleChange} />
            </div>

            {/* TODO: Xử lý tags */}
            <div className={styles.fieldGroup}>
                <label className={styles.label}>Chọn các thẻ (tối đa 5) !Cần xử lý quản lý thẻ</label>
                {/* <input type="text" className={styles.input} name="tags" value={course.tags} onChange={handleChange} /> */}
            </div>

            <div className={styles.fieldGroup}>
                <label className={styles.label}>Giá (VNĐ) <span style={{ color: "red" }}>*</span></label>
                <input type="number" className={styles.input} name="price" value={course.price} onChange={handleChange} />
            </div>

            <div className={styles.fieldGroup}>
                <label className={styles.label}>Banner (link hình ảnh) <span style={{ color: "red" }}>*</span></label>
                <input className={styles.input} name="banner" value={course.banner} onChange={handleChange} />
            </div>

            <div className={styles.fieldGroup}>
                <label className={styles.label}>Nội dung khoá học <span style={{ color: "red" }}>*</span></label>
                {course.content.map((section, sIndex) => (
                    <div key={sIndex} className={styles.section}>
                        <div className={`${styles.fieldGroup} flex-row align-center`}>
                            <label className={`${styles.label} h5`}>Tên chương</label>
                            <label className='h2'>{`${sIndex + 1}. `}</label>
                            <input className={styles.input} value={section.sectionTitle} onChange={(e) => updateSectionTitle(sIndex, e.target.value)} />
                        </div>

                        {section.sectionContent.map((video, vIndex) => (
                            <div key={vIndex} className={styles.videoInputGroup}>
                                <input
                                    className={styles.input}
                                    value={video}
                                    onChange={(e) => updateVideo(sIndex, vIndex, e.target.value)}
                                    placeholder="Link video"
                                />
                                <button type="button" className={`${styles.button} ${styles.danger} h5`} onClick={() => removeVideo(sIndex, vIndex)}>Xoá</button>
                            </div>
                        ))}
                        <div className='flex-row justify-between'>
                            <button
                                type="button"
                                className={`${styles.iconButton} h5`}
                                onClick={() => addVideo(sIndex)}
                            >
                                <FaPlus />
                                Thêm video
                            </button>
                            <button
                                type="button"
                                className={`${styles.iconButton} h5 ${styles.danger}`}
                                onClick={() => removeSection(sIndex)}
                            >
                                <FaXmark />
                                Xoá chương
                            </button>
                        </div>

                    </div>
                ))}
                <button
                    type="button"
                    className={`${styles.iconButton} h5`}
                    onClick={addSection}
                >
                    <FaPlus />
                    Thêm chương
                </button>
            </div>
            <div className='flex-row align-center' style={{ justifyContent: "end", gap: "2rem" }}>
                <p className='h5'>{error && `Lỗi: ${error}`}</p>
                {loading && <BiLoaderCircle />}
                {success && <p className='h5' style={{ color: "green" }}>✅ Khoá học đã được lưu thành bản nháp!</p>}
                <button type="submit" className={`${styles.button} h5 bold`}>Tạo khoá học</button>
            </div>

        </form>
    </div>);
};

const BackDialog = ({ onClickOutside }) => {
    const navigate = useNavigate();
    return <div
        className={styles.dialogBackground}
        onClick={onClickOutside}>
        <div
            className={`${styles.dialogBody} flex-col`}
            onClick={(e) => e.stopPropagation()}
        >
            <p className='h5 bold'>Bạn có chắc chắn muốn rời khỏi đây? Nội dung chưa được gửi sẽ bị mất.</p>

            <div className='flex-row justify-between'>
                <button className={`${styles.iconButton} h5 ${styles.danger}`}
                    onClick={() => navigate('/teaching')}
                >
                    Có
                </button>

                <button
                    className={`${styles.iconButton} h5`}
                    onClick={onClickOutside}
                >
                    Không
                </button>
            </div>
        </div>
    </div>
}

export default CreateCourse;
