import { useNavigate } from "react-router-dom";
import React from "react";
import styles from "./HorizontalItemCard.module.css";
import TagsList from "./TagsList";
import star from "../assets/star.png";
import ProgressBar from "./ProgressBar";

function processPrice(price) {
    if (price === undefined) return "";
    return price.toLocaleString("vi-VN") + "₫";
}

function HorizontalItemCard({ course, discountedPrice, type = 'not-owned', percent = 0, scale = 20 }) {
    const navigate = useNavigate();

    const textScaleH5 = {
        fontSize: `${scale * 0.8 / 20.0}rem`
    }

    return (
        <div onClick={() => { if (type === "not-owned") navigate(`/course/${course._id}`) }} className={`${styles.card} flex-col`}>
            <div className="flex-row justify-between">
                <img className={styles.image} src={course.banner} alt={course.name} />
                <div className={`${styles.info} ${type === 'not-owned' ? 'justify-evenly' : 'justify-between'}`}>
                    <h2 className={`bold multiline-truncate`} style={textScaleH5}>{course.name}</h2>
                    {type === 'not-owned' && <TagsList tags={course.tags} mini />}

                    {type === "owned" && <div className={`${styles.bottom} flex-row justify-between align-center`} style={{ gap: "0.5rem" }}>
                        <button onClick={() => navigate(`/learning?courseId=${course._id}`)} className={`${styles.continueButton} h7 bold`}>
                            Tiếp tục học
                        </button>
                        <div style={{width: "40%"}}>
                            <ProgressBar percent={percent} />
                        </div>
                    </div>}
                    {type === "created" && <div className={`${styles.bottom} flex-row justify-between align-center`} style={{ gap: "0.5rem" }}>
                        <button onClick={() => navigate(`/course/${course._id}`)} className={`${styles.continueButton} h7 bold`}>
                            Xem chi tiết
                        </button>
                    </div>}
                </div>
            </div>
            {type === 'not-owned' && <div className={`${styles.bottom} flex-row justify-between align-center`}>
                <div className={`flex-row`} style={{ gap: "0.5rem" }}>
                    <div className={styles.rating}>
                        <span className="h7">{course.averageRating}</span>
                        <img src={star} alt="rating" className={styles.star} />
                        <span className="h7">({course.reviewCount})</span>
                    </div>
                    {course.enrollCount && (
                        <p className="h7">{course.enrollCount} đã đăng ký</p>
                    )}
                </div>

                <div className={styles.priceBlock}>
                    {discountedPrice ? (
                        <>
                            <p className={styles.oldPrice}>{processPrice(course.price)}</p>
                            <p className={styles.price}>{processPrice(discountedPrice)}</p>
                        </>
                    ) : (
                        <p className={styles.price}>{processPrice(course.price)}</p>
                    )}
                </div>
            </div>}

        </div>
    );
}

export default HorizontalItemCard;
