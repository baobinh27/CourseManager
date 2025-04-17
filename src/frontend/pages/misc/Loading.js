import { BiLoaderCircle } from "react-icons/bi";
import styles from "./Loading.module.css";

const Loading = () => {
    return (
        <div className={styles["loading-container"]}>
            <BiLoaderCircle className={styles["loading-icon"]} />
            <p>Đang tải dữ liệu...</p>
        </div>
    );
};

export default Loading;