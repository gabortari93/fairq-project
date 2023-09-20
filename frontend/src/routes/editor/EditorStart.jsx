import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import TitleWithDescription from "../../components/TitleWithDescription.jsx";
import Loading from "../../components/Loading.jsx";
import {Navigate, useNavigate} from "react-router-dom";
import {AiOutlinePlusCircle} from "react-icons/ai";
import {api} from "../../axios/index.js";
import {loadMemberships} from "../../store/slices/editor.js";

export default function EditorStart() {
    const user = useSelector((state) => state.user.details);
    const memberships = useSelector((state) => state.editor.memberships);
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        document.title = `Editor Start - fairQ`;
    });

    const determineBadgeClass = (role) => {
        switch (role) {
            case 1:
                return "";
            case 2:
                return "badge-primary";
            case 3:
                return "badge-accent";
            default:
                return "";
        }
    }

    if (!user || !memberships) { // until the memberships and the user are loaded from the store, show a loader
        return <Loading/>
    } else if (memberships && memberships.length === 0) { // if user does not have any memberships, ask him to create a first organisation
        return <Navigate to={"/editor/create-organization"}/>
    } else if (memberships && memberships.length === 1 && memberships[0].organisation.waiting_lists.length === 0) { // if the user has one membership, but its organisation has no waiting lists yet, ask to create one
        return <Navigate to={`/editor/create-list/${memberships[0].organisation.id}`}/>
    } else {
        return <div className="w-full mb-20">
            <TitleWithDescription title={`Hey, ${user.first_name}`} align="center"
                                  description="Here's your overview of all the organisations you are part of, and all its waiting lists."/>
            {memberships.map((membership) => {
                return <div key={membership.id}
                            className="flex flex-col w-full justify-start items-center mt-10 mb-10 md:mb-20">
                    <div className="flex flex-col sm:flex-row justify-start gap-2 items-center">
                        <span className="text-xl sm:text-2xl font-bold">{membership.organisation.name}</span>
                        <span
                            className={`badge ${determineBadgeClass(membership.role)} badge-outline`}>{membership.role_name}</span>
                    </div>
                    <div className="flex flex-wrap justify-center w-full gap-4 my-2 md:my-8 p-2 md:p-8">
                        {membership.organisation.waiting_lists.map((waitingList) => {
                            return <div key={waitingList.id}
                                        className="card bg-base-200 max-w-md w-full min-h-[200px] h-fit shadow-md hover:shadow-xl ease-in-out transition-all duration-200">
                                <div className="card-body">
                                    <h2 className="text-2xl font-medium text-center">
                                        {waitingList.name}
                                    </h2>
                                    <div className="stats bg-base-200 stats-vertical sm:stats-horizontal">

                                        <div className="stat place-items-center">
                                            <div className="stat-title">Waiting list</div>
                                            <div
                                                className="stat-value font-light">{waitingList.waiting_applications}</div>
                                            <div className="stat-desc">people are waiting</div>
                                        </div>

                                        <div className="stat place-items-center">
                                            <div className="stat-title">Selected</div>
                                            <div
                                                className="stat-value font-light">{waitingList.selected_applications}</div>
                                            <div className="stat-desc">people were selected</div>
                                        </div>

                                    </div>
                                    <div className="card-actions justify-center mt-4">
                                        <button className="btn btn-sm normal-case btn-accent rounded"
                                                onClick={() => navigate(`/editor/list/${waitingList.id}/activity`)}>Open
                                        </button>
                                        <button className="btn btn-sm normal-case btn-accent btn-outline rounded"
                                                onClick={() => navigate(`/list/${waitingList.slug}`)}>Public page
                                        </button>
                                    </div>
                                </div>
                            </div>
                        })}

                        {membership.role > 1 && (
                            <div key={`${membership.id}-add`}
                                 className="card bg-base-200 max-w-md w-full min-h-[200px] shadow-md hover:shadow-xl ease-in-out transition-all duration-200 cursor-pointer select-none">
                                <div className="card-body flex items-center justify-center"
                                     onClick={(e) => navigate(`/editor/create-list/${membership.organisation.id}`)}>
                                <span className={"flex justify-start items-center gap-1"}>
                                    <AiOutlinePlusCircle size={20} className="text-accent" />
                                    <span>
                                        {
                                            membership.organisation.waiting_lists.length > 0 ? ("Create another waiting list") : ("Create your first waiting list")
                                        }
                                    </span>
                                </span>
                                </div>
                            </div>)
                        }

                    </div>

                </div>

            })}
            <div className="w-full flex justify-center items-center">
                <button className="btn btn-md normal-case btn-accent btn-outline rounded rounded-lg hover:shadow-xl ease-in-out transition-all duration-200"
                                                onClick={() => navigate(`/editor/create-organization/`)}>Create another organisation
                                        </button>
            </div>
        </div>;
    }


}