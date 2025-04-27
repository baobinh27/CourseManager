import React from "react";
import error404 from "../../assets/404-not-found.jpg"
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useNavigate } from "react-router-dom";

function NotFound() {
    useDocumentTitle("404 - Not Found");
    const navigate = useNavigate();

    return <div style={{backgroundColor: "honeydew", height: "100vh"}}>
        <div style={{ margin: "0 20vw", gap: "1vw" }} className="flex-col">
            <img style={{ width: "60vw" }} src={error404} alt="Page not found" />
            <h1 style={{ width: "100%", textAlign: "center"}} className="h2">Trang bạn tìm kiếm không tồn tại.</h1>
            <div className="flex-col align-center">
                <button
                    className="h5 bold"
                    style={{
                        padding: "0.5vw 1vw",
                        color: "honeydew",
                        backgroundColor: "forestgreen",
                        borderRadius: "0.5vw",
                        border: 0,
                        cursor: "pointer"
                    }}
                    onClick={() => navigate('/')}
                >
                    Quay lại trang chủ
                </button>
            </div>
        </div>

    </div>
}

export default NotFound;