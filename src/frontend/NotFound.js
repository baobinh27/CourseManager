import React from "react";
import Header from "./elements/Header";
import error404 from "./assets/404-not-found.jpg"

function NotFound() {
    return <div>
        <Header />
        <div style={{margin: "5vh 20vw"}}>
            <img style={{width: "60vw"}} src={error404} alt="Page not found" />
            <h1 style={{width: "100%", textAlign: "center", marginTop: "5vh", fontFamily: "system-ui", fontSize: "1.5vw"}}>Trang bạn tìm kiếm không tồn tại.</h1>
        </div>
        
    </div>
}

export default NotFound;