import {Navigate, Outlet, useParams} from "react-router-dom";
import TabNavigation from "../../../components/TabNavigation.jsx";
import {useDispatch, useSelector} from "react-redux";
import {api} from "../../../axios/index.js";
import {loadUserDetails} from "../../../store/slices/user.js";
import {loadApplication, loadReconfirmation} from "../../../store/slices/applicant.js";
import {useEffect} from "react";
import Loading from "../../../components/Loading.jsx";

export default function ApplicantDashboardLayout() {
    const {listSlug} = useParams()
    const token = useSelector((state) => state.user.accessToken);
    const isLoggedIn = useSelector((state) => state.user.accessToken);
    const authUserDetails = useSelector((state) => state.user.details);
    const dispatch = useDispatch();
    const waitingList = useSelector(state => state.applicant.waitingList)
    const application = useSelector(state => state.applicant.application)


    const tabs = [
        {to: `/list/${listSlug}/dashboard`, label: "Overview"},
        {to: `/list/${listSlug}/data`, label: "Update data"},
        {to: `/list/${listSlug}/activity`, label: "Latest activity"},
        {to: `/list/${listSlug}/delete`, label: "Delete application"},

    ];

    useEffect(() => {
        fetchApplication()
    }, [authUserDetails])

    useEffect(() => {
        fetchReconfirmation()
    }, [application])

    const loadProfileDetails = async () => {
        try {
            api
                .get("auth/me/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => dispatch(loadUserDetails(res.data)));
        } catch (e) {
            console.log(e);
        }
    };

    const fetchApplication = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const res = await api.get(`/list/${waitingList.id}/application/me`, config)
            dispatch(loadApplication(res.data))

        } catch (e) {
            console.log(e)
        }
    }

    const fetchReconfirmation = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        if (application) {
            try {
                const res = await api.get(`/list/${waitingList.id}/application/${application.id}/reconfirmation`, config)
                dispatch(loadReconfirmation(res.data))

            } catch (e) {
                console.log(e)
            }
        }
    }

    if (!isLoggedIn) {
        return <Navigate to={`/list/${listSlug}/`}/>;
    } else if (!authUserDetails) {
        loadProfileDetails(); // load logged-in users profile to store if not already there
    } else if (!authUserDetails.is_applicant) {
        // user is logged in but has no organisation user
        console.log(`${authUserDetails.first_name} is not related to any application`)
        return <Navigate to="/editor"/>;
    } else if (!application) {
        return <Loading/>
    } else {
        return (
            <div className="max-w-[1180px] w-full px-4 md:px-8">
                <TabNavigation
                    tabs={tabs}
                    title={waitingList.name}
                    customFontColor={waitingList.organisation.custom_branding && waitingList.organisation.font_color}
                    customAccentColor={waitingList.organisation.custom_branding && waitingList.organisation.accent_color}
                />
                <Outlet/>
            </div>);
    }
}

