import { useState, useEffect } from "react";
import { BASE_API } from "../utils/constant";

export const useGetCreatedCourses = () => {
  const [createdCourses, setCreatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCreatedCourses = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${BASE_API}/api/course/myCreatedCourse`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCreatedCourses(data);
        } else {
          console.error("Unauthorized or error fetching data");
        }
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatedCourses();
  }, []);

  return { createdCourses, loading, error };
};