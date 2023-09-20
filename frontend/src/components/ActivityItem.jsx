import {AiOutlineEdit, AiOutlineInfo, AiOutlineUsergroupAdd} from "react-icons/ai";
import dayjs from "dayjs";
import {useSelector} from "react-redux";

export default function ActivityItem({data}) {
    const {user, waiting_list, application, created_date, activity, note} = data
    const customBranding = useSelector(state => state.applicant.customBranding)


    const getActivityIcon = (activity) => {

        if (activity === "apply") {
            return <AiOutlineUsergroupAdd/>
        } else if (activity === "edit_list") {
            return <AiOutlineEdit/>
        }
        else if (activity === "recalculate_positions") {
            return <AiOutlineEdit/>
        }
        else {
            return <AiOutlineInfo/>
        }
    }

    const getActivityText = (activity, waiting_list, user, application, note) => {
        if (activity === "apply") {
            return <>{application.applicant.user.first_name} {application.applicant.user.last_name} {note} {waiting_list.name}</>
        } else if (activity === "edit_list") {
            return <>{user.first_name} {user.last_name} {note}</>
        }
        else if (activity === "recalculate_positions") {
            return <>{user.first_name} {user.last_name} {note}</>
        }
        else {
            return <>{user.first_name} {user.last_name} {note}</>
        }

    }

    return (
        <div className="flex w-full gap-4 justify-start items-center">
            <div
                style={customBranding && {backgroundColor:customBranding.accent_color}}
                className={`w-fit ${!customBranding && "bg-primary"} text-base-200 flex items-center justify-center rounded-full`}>
                <span
                    className="h-6 sm:h-10 md:h-14 w-6 sm:w-10 md:w-14 text-xs sm:text-lg md:text-2xl lg:text-3xl flex items-center justify-center">{getActivityIcon(activity)}</span>
            </div>
            <div className="flex flex-col">
                <div className="flex flex-row gap-1 text-sm md:text-lg">
                    {getActivityText(activity, waiting_list, user, application, note)}
                </div>
                <div className="opacity-50 text-xs sm:text-sm md:text-md w-full md:w-fit text-start">
                    {dayjs().to(dayjs(created_date))}
                </div>
            </div>
        </div>
    );
}
