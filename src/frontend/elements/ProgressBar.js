import styles from "./ProgressBar.module.css";

const ProgressBar = ({ percent }) => {
    return (
        <div className={styles["progress-container"]}>
            <p className="h7">{percent}%</p>
            <div className={styles["progress-bar"]}>
                <div className={styles["progress-fill"]} style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
};

export default ProgressBar;