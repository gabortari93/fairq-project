import {useDispatch, useSelector} from "react-redux";
import Router from "./routes";
import {api} from "./axios";
import {useEffect} from "react";
import {loadUserDetails, login} from "./store/slices/user";
import {logout} from "./store/slices/user";
import Loading from "./components/Loading";

function App() {
    const accessToken = useSelector((state) => state.user.accessToken);
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.details)

    useEffect(() => {
        const localToken = localStorage.getItem("token");
        if (localToken) {
            api
                .post("auth/token/verify/", {token: localToken})
                .then(() => dispatch(login(localToken)))
                .catch(() => {
                    localStorage.removeItem("token");
                    dispatch(logout());
                });
        } else {
            // no local token
            dispatch(logout());
        }
    }, [dispatch]);

    useEffect(() => {
        const loadProfileDetails = async () => {
            if (!user && accessToken) {
                try {
                    const res = await api.get("auth/me/", {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    dispatch(loadUserDetails(res.data));
                } catch (e) {
                    console.log(e);
                }
            }
        };
        if (accessToken) {
            loadProfileDetails();
        }
    }, [accessToken, dispatch, user]);

    if (accessToken || accessToken === null) return <Router/>; // user is logged in or logged out
    return <Loading/>; // login state was not identified yet
}

export default App;
