
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
const Admin = ({ children }) => {
    const { user } = useSelector((state) => state.auth)
    if (user?.role != 'admin') {
        return <Navigate to='/' />
    }

    return children;
}


export default Admin;