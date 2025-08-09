import { Children } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ children }) => {
    const isloggeduser = useSelector((state) => state.auth.user)

    if (!isloggeduser) {
        return <Navigate to='login' />
    }

    return children

}



export default ProtectedRoute;