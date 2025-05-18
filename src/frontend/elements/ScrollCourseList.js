import React, { useEffect } from "react";
import ItemCard from "./ItemCard";
import styles from "./ScrollCourseList.module.css";
import { useState } from "react";

const ScrollList = ({ items, visibleCount = 4, type = 'not-owned', scale = 20, percents = [] }) => {
    const [showLeftScrollBtn, setShowLeftScrollBtn] = useState(false);
    const [showRightScrollBtn, setShowRightScrollBtn] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (items && items.length > visibleCount) {
            setShowLeftScrollBtn(currentIndex > 0);
            setShowRightScrollBtn(currentIndex < items.length - visibleCount);
        }
    }, [items, currentIndex, visibleCount])

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1));
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    };

    if (!items || items.length === 0) return <div className="h4" style={{padding: "2rem"}}>Không có khoá học nào.</div>

    return <>
        <div className={`${styles["flex-row"]} ${styles.track}`} style={{width: `${(scale + 1) * visibleCount + 6}rem`}}>
            <button disabled={!showLeftScrollBtn} onClick={prevSlide} className={styles.prev}>❮</button>
            <div className={styles.list} style={{width: `${(scale + 1) * visibleCount}rem`}}>
                <div className={styles["carousel-track"]} style={{ transform: `translateX(-${currentIndex/items.length * 100}%)`}}>
                    {items.map((item, index) => 
                        <ItemCard 
                            course={item}
                            type={type}
                            scale={scale}
                            percent={percents[index] || 0}
                        />
                    )}
                </div>
            </div>
            <button disabled={!showRightScrollBtn} onClick={nextSlide} className={styles.next}>❯</button>
        </div>
    </> 
    
    
}

export default ScrollList;