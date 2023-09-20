import {Outlet, useNavigate, useParams} from "react-router-dom";
import TabNavigation from "../../../components/TabNavigation.jsx";
import {api} from "../../../axios/index.js";
import {loadConfiguration} from "../../../store/slices/editor.js";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import Loading from "../../../components/Loading.jsx";

export default function WaitinglistEditorLayout() {
    const token = useSelector(state => state.user.accessToken)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const {listId} = useParams()
    const waitingList = useSelector(state => state.editor.configuration)
    const navigate = useNavigate()

    const tabs = [
        {to: `/editor/list/${listId}/activity`, label: "Latest activity"},
        {to: `/editor/list/${listId}/applicants`, label: "Applications"},
        {to: `/editor/list/${listId}/analytics`, label: "Analytics"},
        {to: `/editor/list/${listId}/import-export`, label: "Export data"},
        {to: `/editor/list/${listId}/settings`, label: "Settings"},
    ];

    useEffect(() => {
        fetchList();
    }, [listId])

    const fetchList = async () => {
        try {
            const response = await api.get(`list/${listId}/`, {
                headers: {Authorization: "Bearer " + token},
            });
            const data = response.data;
            dispatch(loadConfiguration(data));
            setLoading(false);
        } catch (error) {
            console.error("Error fetching waiting list:", error);
            navigate("/editor")
        }
    };

    if (loading || !waitingList) {
        return <Loading/>
    } else {
        return (
            <div className="max-w-[1180px] w-full px-4 md:px-8">
                <TabNavigation tabs={tabs} title={waitingList.name}/>
                <Outlet/>
            </div>);
    }


}

