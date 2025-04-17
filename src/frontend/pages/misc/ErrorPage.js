import React from "react";
import { BiErrorCircle } from "react-icons/bi";
import styles from "./ErrorPage.module.css";

const ErrorPage = ({ message = "Đã xảy ra lỗi. Vui lòng thử lại sau." }) => {
    return (
        <div className={styles["loading-container"]}>
            <BiErrorCircle className={styles["loading-icon"]} />
            <h2 className="text-2xl font-semibold mb-2">Oops!</h2>
            <p className="text-lg">{message}</p>
        </div>
    );
};

export default ErrorPage;