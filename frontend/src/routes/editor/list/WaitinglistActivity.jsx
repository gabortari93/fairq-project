import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import TitleWithDescription from "../../../components/TitleWithDescription.jsx";
import {api} from "../../../axios/index.js";
import {useSelector} from "react-redux";
import Loading from "../../../components/Loading.jsx";
import ActivityItem from "../../../components/ActivityItem.jsx";

export default function WaitinglistActivity() {
    const {listSlug} = useParams()
    const token = useSelector(state => state.user.accessToken)
    const waitingList = useSelector(state => state.editor.configuration)
    const [activities, setActivities] = useState([]);
    useEffect(() => {
        document.title = `${waitingList?.name} - Latest activity - fairQ`;
    });

    useEffect(() => {
        if (waitingList) {
            fetchActivities();
        }
    }, [token, waitingList]);
    const fetchActivities = async (e) => {
        try {
            const res = await api.get(`/list/${waitingList.id}/activities`, {
                headers: {Authorization: "Bearer " + token},
            });
            setActivities(res.data);
        } catch (e) {
            console.log(e);
        }
    }

    if (activities.length === 0) return <Loading/>
    else return (<div className="max-w-[1180px] mb-20 flex flex-col">

        <TitleWithDescription title={"Latest activity"}
                              description={"Stay informed and keep track of all activities and changes related to your waiting list.\n" +
                                  "                    The activity log provides a comprehensive record of actions taken, ensuring transparency and accountability."}/>
        <div className="w-full md:w-10/12 lg:w-8/12 flex flex-col gap-6 md:gap-8 lg:gap-10">
            {activities.map((activity) => {
                return <ActivityItem key={activity.id} data={activity}/>;
            })}

        </div>

    </div>)
};