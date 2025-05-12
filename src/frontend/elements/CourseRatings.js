import { useState } from "react";
import styles from "./CourseRatings.module.css"; // CSS module
import useCreateReview from "../hooks/reviews/useCreateReview";
import { FaStar } from "react-icons/fa";

const CourseRatings = ({ courseId, reviews, commentEnabled }) => {
    const [comment, setComment] = useState("");
    const [stars, setStars] = useState(0);
    const { createReview } = useCreateReview();
    const [hoveredStar, setHoveredStar] = useState(0);

    const handleStarClick = (rating) => {
        setStars(rating);
    };

    const handleSubmit = async () => {
        await createReview({
            courseId: courseId,
            rating: stars,
            comment: comment,
        })
    }

    return (
        <div className={styles.ratingBox}>
            <h3 className={styles.title}>Đánh giá</h3>

            {commentEnabled ? <form onSubmit={handleSubmit} className={styles.form}>
                <label>Đánh giá: </label>
                <div className="flex-row" style={{gap: "2px"}}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                            key={star}
                            className={styles.star}
                            style={{
                                fill: star <= (hoveredStar || stars) ? "gold" : "#ccc",
                                cursor: "pointer",
                            }}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            onClick={() => handleStarClick(star)}
                        />
                    ))}
                </div>

                <label>Nhận xét:</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                />

                <button type="submit" onClick={handleSubmit} disabled={stars === 0}>Gửi đánh giá</button>
            </form> : <div>Vui lòng mua khoá học để đánh giá</div>}

            <p className="h5 bold">Đánh giá từ học viên</p>

            {!reviews || reviews.length === 0 ? (
                <p className={styles.noRating}>Chưa có đánh giá</p>
            ) : (
                reviews.map((r, i) => (
                    <div key={i} className={styles.reviewItem}>
                        <p className={`${styles.author} h4 bold`}>{r.userId?.username || "Ẩn danh"}</p>
                        <div className="flex-row">
                            {[...Array(5)].map((_, index) => (
                                <FaStar
                                    key={index}
                                    style={{
                                        fill: index < r.rating ? "gold" : "#ccc", // sao vàng hoặc xám
                                        marginRight: 4
                                    }}
                                />
                            ))}
                        </div>
                        <p className={styles.comment}>{r.comment}</p>

                    </div>
                ))
            )}
        </div>
    )
}


export default CourseRatings;