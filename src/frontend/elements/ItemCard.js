import React from "react";
import styles from "./ItemCard.module.css";
import TagsList from "./TagsList";
import star from "../assets/star.png"

function processPrice(price) {
    if (price === undefined) return "";
    return price.toLocaleString("vi-VN") + "₫";
}

function processName(name) {
    return (name.length >= 45 ? (name.slice(0, 45) + "...") : (name))
}

function ItemCard({img, name, tags, ratings, enrolCount, price, discountedPrice}) {
    return <div className={styles.card}>
        <img className={styles.img} src={img} alt="" />
        <div className={styles.info}>
            <h1 className={styles.name}>{processName(name)}</h1>
            <div>
                <TagsList tags={tags} />
                <div className={styles["stars-and-price"]}>
                    <div>
                        <div className={styles["flex-row"]}>
                            <p className={styles.rating}>{ratings}</p>
                            <img className={styles.star} src={star} alt="" />
                        </div>
                        {enrolCount ? <p className={styles["enrol-count"]}>{`${enrolCount} đã đăng ký`}</p> : null}
                    </div>
                    
                    <div className={styles["flex-row"]}>
                        {discountedPrice ? (<>
                            <p className={styles["old-price"]}>{processPrice(price)}</p>
                            <p className={styles.price}>{processPrice(discountedPrice)}</p>
                        </>
                        ) : (<>
                            <p className={styles.price}>{processPrice(price)}</p>
                        </>)
                        }
                    </div>
                    
                </div>
                
                
            </div>
            
        </div>
        
    </div>
}

export default ItemCard;