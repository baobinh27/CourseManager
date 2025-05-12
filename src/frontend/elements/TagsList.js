import React from "react";
import styles from "./TagsList.module.css";

const processTags = (tags) => {
    return (tags.length > 2 ? ([...tags.slice(0, 2), `+${tags.length - 2}`]) : tags);
}

const TagsList = ({ tags, shorten = true, mini = false }) => {
    const processedTags = shorten ? processTags(tags) : tags;
    return <div className={styles["tags-list"]}>
        {processedTags ? processedTags.map((tag) =>
            <TagChip tag={tag} mini={mini} />
        ) : null}
    </div>
}

const TagChip = ({ tag, mini }) => {
    return <div style={{
        borderRadius: `${mini ? "0.2rem" : "0.5rem"}`, 
        backgroundColor: "#eeeeee"
    }}>
        <p
            className={`${styles.tag} ${mini ? "h8" : "h6"}`}
            style={{
                border: 0,
                padding: `${mini ? "0.15rem 0.25rem" : "0.25rem 0.5rem"}`,
            }}
        >
            {tag}
        </p>
    </div>
}

export default TagsList;