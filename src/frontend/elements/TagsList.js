import React from "react";
import styles from "./TagsList.module.css";

const processTags = (tags) => {
    return (tags.length > 2 ? ([...tags.slice(0, 2), `+${tags.length - 2}`]) : tags);
}

const TagsList = ({tags}) => {
    const processedTags = processTags(tags);
    return <div className={styles["tags-list"]}>
        {processedTags ? processedTags.map((tag) => 
            <TagChip tag={tag} />
        ) : null}
    </div>
}

const TagChip = ({tag}) => {
    return <div className={styles.chip}>
        <p className={styles.tag}>{tag}</p>
    </div>
}

export default TagsList;