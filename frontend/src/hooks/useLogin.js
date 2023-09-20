import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {loadUserDetails, login, logout} from "../store/slices/user";
import {api} from "../axios";
import {clearEditor} from "../store/slices/editor.js";
import {clearApplicant, clearWaitinglist} from "../store/slices/applicant.js";

const useLogin = (email, password) => {
    const [loginError, setLoginError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        setLoginError("");
        try {
            const res = await api.post("auth/token/", {
                email,
                password,
            });
            const token = res.data.access;
            dispatch(login(token));
            localStorage.setItem("token", token);

            const resUser = await api.get("auth/me/", {
                headers: {Authorization: `Bearer ${token}`}
            });

            dispatch(loadUserDetails(resUser.data))
            navigate(`/editor`);

        } catch (error) {
            if (error.response) {
                setLoginError(error.response.data);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
        }
    };


    const handleLogout = (target="/sign-in") => {
        localStorage.removeItem("token");
        dispatch(logout());
        dispatch(clearEditor());
        dispatch(clearApplicant());
        dispatch(clearWaitinglist());
        location.href=target
    };


    return {
        handleLogin,
        handleLogout,
        loginError,
    };
};

export default useLogin;
