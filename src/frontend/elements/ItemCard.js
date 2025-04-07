import { Link } from "react-router-dom";
import React from "react";
import styles from "./ItemCard.module.css";
import TagsList from "./TagsList";
import star from "../assets/star.png"

function processPrice(price) {
    if (price === undefined) return "";
    return price.toLocaleString("vi-VN") + "₫";
}

function ItemCard({course, discountedPrice}) {
    return <Link to={`/course/${course._id}`} className={styles.link}>
    <div className={styles.card}>
        <img className={styles.img} src={course.banner} alt="" />
        <div className={styles.info}>
            <h1 className={`${styles.name} multiline-truncate`}>{course.name}</h1>
            <div>
                <TagsList tags={course.tags} />
                <div className={styles["stars-and-price"]}>
                    <div>
                        <div className={styles["flex-row"]}>
                            <p className={styles.rating}>{course.ratings}</p>
                            <img className={styles.star} src={star} alt="" />
                        </div>
                        {course.enrolCount ? <p className={styles["enrol-count"]}>{`${course.enrolCount} đã đăng ký`}</p> : null}
                    </div>
                    
                    <div className={styles["flex-row"]}>
                        {discountedPrice ? (<>
                            <p className={styles["old-price"]}>{processPrice(course.price)}</p>
                            {/* <p className={styles.price}>{processPrice(discountedPrice)}</p> */}
                        </>
                        ) : (<>
                            <p className={styles.price}>{processPrice(course.price)}</p>
                        </>)
                        }
                    </div>
                    
                </div>
                
                
            </div>
            
        </div>
        
    </div>
    </Link> 
}

export default ItemCard;