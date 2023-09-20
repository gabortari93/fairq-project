import {Outlet, useNavigate, useParams} from "react-router-dom";
import TabNavigation from "../../../components/TabNavigation.jsx";
import {useDispatch, useSelector} from "react-redux";
import {api} from "../../../axios/index.js";
import {loadOrganization} from "../../../store/slices/editor.js";
import {useEffect, useState} from "react";
import Loading from "../../../components/Loading.jsx";

export default function OrgSettingsLayout() {
    const token = useSelector(state => state.user.accessToken)
    const {orgId} = useParams()
    const organisation = useSelector(state => state.editor.organization)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const memberships = useSelector(state => state.editor.memberships)
    const [isMemberAndNotViewer, setIsMemberAndNotViewer] = useState(false)


    useEffect(() => {
        setLoading(true)
        fetchOrganisation()
    }, [orgId])

    useEffect(() => {
        if (memberships && organisation) {
            checkMembership()
        }
    }, [memberships, organisation])

    const fetchOrganisation = async () => {
        if (!orgId) {
            navigate("/editor")
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const res = await api.get(`org/${orgId}/`, config)
            dispatch(loadOrganization(res.data))
            setLoading(false)
        } catch (e) {
            navigate("/editor")
        }
    }

    const checkMembership = () => {
        if (memberships && organisation) {
            for (let i = 0; i < memberships.length; i++) {
                if (parseInt(memberships[i].organisation.id) === parseInt(orgId)) {
                    if (memberships[i].role > 1) {
                        setIsMemberAndNotViewer(true)
                    } else {
                        setIsMemberAndNotViewer(false)
                        navigate("/editor")
                    }
                }
            }
        } else {
            setIsMemberAndNotViewer(false)
            navigate("/editor")
        }
    }

    const tabs = [
        {to: `/editor/org/${orgId}/settings/general`, label: "General information"},
        {to: `/editor/org/${orgId}/settings/team`, label: "Manage team"},
        {to: `/editor/org/${orgId}/settings/branding`, label: "Branding"},

    ];
    if (loading || !isMemberAndNotViewer) {
        return <Loading/>
    } else {

        return (
            <div className="max-w-[1180px] w-full px-4 md:px-8">
                <TabNavigation tabs={tabs} title="Organization settings"/>
                <Outlet/>
            </div>);
    }
}