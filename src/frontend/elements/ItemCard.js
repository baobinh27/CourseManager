import { Link, useNavigate } from "react-router-dom";
import React from "react";
import styles from "./ItemCard.module.css";
import TagsList from "./TagsList";
import star from "../assets/star.png"
import ProgressBar from "./ProgressBar";

function processPrice(price) {
    if (price === undefined) return "";
    return price.toLocaleString("vi-VN") + "₫";
}

function ItemCard({course, discountedPrice, type = 'not-owned', scale = 20, percent = 0}) {
    const navigate = useNavigate();

    const cardScales = {
        width: `calc(${scale}rem - 2px)`,
        height: `${scale * 0.9}rem`
    }

    const textScaleH5 = {
        fontSize: `${scale / 20.0}rem`
    }

    if (type === 'not-owned')
    return <div onClick={() => {navigate(`/course/${course._id}`)}} className={styles.card} style={cardScales}>
        <img className={styles.img} src={course.banner} alt="" />
        <div className={styles.info}>
            <h1 className={`${styles.name} multiline-truncate`} style={textScaleH5}>{course.name}</h1>
            <div>
                <TagsList tags={course.tags} />
                <div className={styles["stars-and-price"]}>
                    <div>
                        <div className={styles["flex-row"]}>
                            <p className="h7">{course.averageRating}</p>
                            <img className={styles.star} src={star} alt="" />
                            <p className="h7">({course.reviewCount})</p>
                        </div>
                        {course.enrollCount ? <p className="h7">{`${course.enrollCount} đã đăng ký`}</p> : null}
                    </div>
                    
                    <div className={styles["flex-row"]}>
                        {discountedPrice ? (<>
                            <p className={styles["old-price"]}>{processPrice(course.price)}</p>
                            {/* <p className={styles.price}>{processPrice(discountedPrice)}</p> */}
                        </>
                        ) : (<>
                            <p className={`${styles.price} h3`}>{processPrice(course.price)}</p>
                        </>)
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>

    if (type === 'owned') return (
        <div className={styles.card} style={cardScales}>
            <img src={course.banner} alt={course.name} className={styles.img} />
            <div className={styles.info}>
                <p className={`bold multiline-truncate`} style={textScaleH5}>{course.name}</p>
                <div className="flex-row align-center" style={{gap: "0.5rem", justifyContent: "space-between"}}>
                    <Link to={`/learning?courseId=${course._id}`} className={`${styles.continueButton} h7 bold`}>
                        Tiếp tục học
                    </Link>
                    <div style={{width: "50%"}}>
                        <ProgressBar percent={percent}/>
                    </div>
                </div>
                
            </div>
        </div>
    );

    if (type === 'owned-viewing') return (
        <div className={styles.card} style={cardScales}>
            <img src={course.banner} alt={course.name} className={styles.img} />
            <div className={styles.info}>
                <p className={`bold multiline-truncate`} style={textScaleH5}>{course.name}</p>
                <div className="flex-row align-center" style={{gap: "0.5rem", justifyContent: "space-between"}}>
                    <div style={{width: "50%"}}>
                        <ProgressBar percent={percent}/>
                    </div>
                </div>
                
            </div>
        </div>
    );

    if (type === 'created') return (
        <div className={styles.card} style={cardScales}>
            <img src={course.banner} alt={course.name} className={styles.img} />
            <div className={styles.info}>
                <p className={`bold multiline-truncate`} style={textScaleH5}>{course.name}</p>
                <div>
                    <Link to={`/course/${course._id}`} className={` ${styles.continueButton} h7 bold`}>
                        Xem chi tiết
                    </Link>
                </div>
                
            </div>
        </div>
    );

    console.log("No type found. Available: not-owned, owned, owned-viewing, created");
    return <p className="h5">No type found.</p>
}

export default ItemCard;