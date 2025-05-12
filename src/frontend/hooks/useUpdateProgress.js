import { useState } from "react";
import { BASE_API } from "../utils/constant";

const useUpdateProgress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProgress = async (courseId, videoId) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Bạn chưa đăng nhập.");
      }

      const response = await fetch(`${BASE_API}/api/user/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ courseId, videoId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi cập nhật tiến độ.");
      }

      return data.ownedCourse; // Trả về bản ghi ownedCourse đã cập nhật
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateProgress, loading, error };
};

export default useUpdateProgress;
