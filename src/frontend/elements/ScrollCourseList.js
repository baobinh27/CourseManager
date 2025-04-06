import React, { useEffect } from "react";
import ItemCard from "./ItemCard";
import styles from "./ScrollCourseList.module.css";
import { useState } from "react";

const ScrollList = ({title, items}) => {
    const visibleCount = 4;
    const [showLeftScrollBtn, setShowLeftScrollBtn] = useState(false);
    const [showRightScrollBtn, setShowRightScrollBtn] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (items.length > 4) {
            setShowLeftScrollBtn(currentIndex > 0);
            setShowRightScrollBtn(currentIndex < items.length - visibleCount);
        }
    }, [items, currentIndex])

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1));
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    };

    return <>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles["flex-row"]}>
            <button disabled={!showLeftScrollBtn} onClick={prevSlide} className={styles.prev}>❮</button>
            <div className={styles.list}>
            <div className={styles["carousel-track"]} style={{ transform: `translateX(-${currentIndex/items.length * 100}%)`}}>
                {items.map((item) => 
                    <ItemCard 
                        course={item}
                    />
                )}
            </div>
        </div>
            <button disabled={!showRightScrollBtn} onClick={nextSlide} className={styles.next}>❯</button>
        </div>
    </> 
    
    
}

export default ScrollList;