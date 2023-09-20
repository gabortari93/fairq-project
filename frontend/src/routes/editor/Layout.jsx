import {Navigate, Outlet, useNavigate} from "react-router-dom";
import EditorHeader from "../../components/EditorHeader.jsx";
import EditorFooter from "../../components/EditorFooter.jsx";
import {useDispatch, useSelector} from "react-redux";
import {api} from "../../axios/index.js";
import {loadUserDetails} from "../../store/slices/user.js";
import {loadMemberships} from "../../store/slices/editor.js";
import {useEffect} from "react";

export default function EditorLayout() {
    const token = useSelector((state) => state.user.accessToken);
    const isLoggedIn = useSelector((state) => state.user.accessToken);
    const authUserDetails = useSelector((state) => state.user.details);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    useEffect(() => {
        fetchMemberships(); // load memberships
    }, [token])

    const loadProfileDetails = async () => {
        try {
            const res = await api.get("auth/me/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            dispatch(loadUserDetails(res.data))

        } catch (e) {
            console.log(e);
            navigate("/sign-in")
        }
    };

    const fetchMemberships = async () => {
        try {
            const res = await api.get("user/me/memberships", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            dispatch(loadMemberships(res.data))

        } catch (e) {
            console.log(e);
            navigate("/sign-in")
        }
    };

    if (!isLoggedIn) {
        return <Navigate to="/sign-in"/>;
    } else if (!authUserDetails) {
        loadProfileDetails(); // load logged-in users profile to store if not already there
    } else if (!authUserDetails.is_org_user) {
        // user is logged in but has no organisation user
        console.log(
            `${authUserDetails.first_name} is not related to any organisation`
        );
        return <Navigate to="/"/>;
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-tl from-[#EBEFFF] to-white">
            <EditorHeader/>
            <div className="max-w-[1180px] w-full flex-grow overflow-visible flex">
                <Outlet/>
            </div>
            <EditorFooter className="w-full"/>
        </div>
    );
}
