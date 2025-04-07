import { Link } from "react-router-dom";
import React from "react";

function MyCourses() {
    return <div>
        <Link to={"/learning?courseId=67d51d9a3e4c59c84ba9e651"}>
            <button>
                learning test
            </button>
        </Link>
    </div>
}

export default MyCourses;