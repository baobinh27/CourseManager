import { useParams } from "react-router-dom";
import useGetUserDetail from "../hooks/useGetUserDetail";
import Loading from "./misc/Loading";
import ErrorPage from "./misc/ErrorPage";


const Profile = () => {
    const { id } = useParams();
    const { user, loading, error } = useGetUserDetail(id);

    if (loading) {
        return <Loading />
    }

    if (error) return <ErrorPage message={error} />;

    return <>
        <p>Profile</p>
        <p>{user._id}</p>
        <p>{user.username}</p>
    </>
}

export default Profile;