import {useEffect} from "react";
import TitleWithDescription from "../../../components/TitleWithDescription.jsx";
import FormFieldGroup from "../../../components/FormFieldGroup.jsx";
import SmallButton from "../../../components/SmallButton.jsx";
import {useDispatch, useSelector} from "react-redux";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import Loading from "../../../components/Loading.jsx";
import IdentityVerification from "../../../components/IdentityVerification.jsx";
import {api} from "../../../axios/index.js";
import {loadApplication, loadReconfirmation} from "../../../store/slices/applicant.js";
import {useNavigate} from "react-router-dom";
import MediumButton from "../../../components/MediumButton.jsx";

dayjs.extend(relativeTime)


export default function ApplicantWaitinglistDashboardOverview() {
    const token = useSelector(state => state.user.accessToken)
    const waitingList = useSelector(state => state.applicant.waitingList)
    const application = useSelector(state => state.applicant.application)
    const reconfirmmation = useSelector(state => state.applicant.reconfirmation)
    const dispatch = useDispatch()

    useEffect(() => {
        document.title = `${waitingList.name} - Dashboard Overview - fairQ`;
    });

    const relativePositionText = (percentage) => {
        if (percentage >= 90) {
            return "You're in the top 10%. Almost there!";
        } else if (percentage >= 70) {
            return "You're in the top 30%. Good progress!";
        } else if (percentage >= 50) {
            return "You're in the top half. You've come a long way!";
        } else if (percentage >= 25) {
            return "You're in the top 75%. Moving steadily up the list!";
        } else {
            return "Just starting, your journey to the top has begun. Keep patience.";
        }
    }

    const absolutePositionText = (position) => {
        if (position <= 5) {
            return "You're almost at the top! Just a few more spots to go!";
        } else if (position <= 10) {
            return "Great progress! You're in the top 10 positions!";
        } else if (position <= 20) {
            return "You're moving up! Top 20 is a great place to be!";
        } else if (position <= 50) {
            return "You're in the top 50. Keep going, your turn will come!";
        } else {
            return "There's a bit of a queue, but hang in there. Everyone gets their turn!";
        }
    }

    const handleAcceptReconfirmation = async (e) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const res = await api.post(`/list/${waitingList.id}/application/${application.id}/reconfirmation`, {}, config)
            dispatch(loadReconfirmation(res.data))
            location.reload()

        } catch (e) {
            console.log(e)
        }
    }

    const handleDeclineReconfirmation = async (e) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const res = await api.delete(`/list/${waitingList.id}/application/${application.id}/reconfirmation`, config)
            dispatch(loadReconfirmation(res.data))
            location.reload()

        } catch (e) {
            console.log(e)
        }
    }


    if (application && application.status === "waiting") {
        const today = dayjs();
        return (
            <div className=" max-w-[1180px] w-full">
                {reconfirmmation && today.isAfter(dayjs(reconfirmmation.first_reminder)) &&
                    <div
                        className="card bg-warning bg-opacity-10 border-warning border p-4 my-4 rounded-lg flex flex-col gap-4">
                        <h2 className="text-xl font-bold">Action required</h2>
                        <p>{waitingList.organisation.name} asks everyone on {waitingList.name} to reconfirm their
                            interest every {waitingList.reconfirmation_cycle} months.</p>
                        <p>Please let them know by <span
                            className="font-bold">{dayjs(reconfirmmation.deadline).format("DD. MMMM YYYY HH:mm")}</span> whether
                            you would like to stay on the waiting list or not. </p>
                        {waitingList.reconfirmation_remove &&
                            <p className={"font-bold"}>If you do not take action by then, you will be removed from the
                                waiting list.</p>}
                        <div className="flex flex-col md:flex-row justify-start items-center gap-2">
                            <button
                                onClick={(e) => handleAcceptReconfirmation(e)}
                                className="btn btn-accent normal-case w-full md:w-fit"
                            >I am still interested
                            </button>
                            <button
                                onClick={(e) => handleDeclineReconfirmation(e)}
                                className="btn btn-error normal-case w-full md:w-fit"
                            >I am no longer interested
                            </button>
                        </div>
                    </div>
                }


                <TitleWithDescription
                    title={`Waiting list joined: ${dayjs().to(dayjs(application.waiting_since_date))}`}
                    description={`Since joining, ${(application.num_waiting_after && application.position) || "no"} additional people have registered.`}/>

                {
                    (waitingList.see_absolute_position && application.position) &&
                    <TitleWithDescription
                        title={`Current position: ${application.position}`}
                        description={absolutePositionText(application.position)}/>
                }

                {
                    (waitingList.see_relative_position && application.relative_position !== null && application.relative_position !== undefined) &&
                    <TitleWithDescription
                        title={`Relative position: Ahead of ${application.relative_position.toFixed(0)}% of applicants`}
                        description={relativePositionText(parseInt(application.relative_position))}/>
                }

                {
                    (waitingList.see_calculated_waiting_time && application.estimated_selection_date) &&
                    <TitleWithDescription
                        title={`Estimated waiting time: ${dayjs(application.estimated_selection_date).fromNow(true)}`}
                        description={"This is an estimation based on the current rate of application processing. Actual waiting times may vary."}/>
                }
            </div>)
    } else if (application && application.status == "selected") {
        return (<div className=" max-w-[1180px] w-full">
                <FormFieldGroup align={"left"}
                                title={`Selection status: Successful`}
                                intro={`You were selected by ${waitingList.organisation.name} ${dayjs().to(dayjs(application.selected_date))}. Please contact them to proceed.`}>
                    <SmallButton
                        style={"self-start"}
                        label={`Contact ${waitingList.organisation.name}`}
                        onClick={(e) => window.open(waitingList.organisation.contact_url, "_blank")}
                    />

                </FormFieldGroup>
            </div>
        )
    } else if (application && application.status == "removed") {
        return (<div className=" max-w-[1180px] w-full">
                <FormFieldGroup align={"left"}
                                title={`Application status: Removed`}
                                intro={`Your application is no longer active on this waiting list. Please contact ${waitingList.organisation.name} if you have any queries.`}>
                    <MediumButton
                        style={"self-start btn-primary"}
                        label={`Contact ${waitingList.organisation.name}`}
                        onClick={(e) => window.open(waitingList.organisation.contact_url, "_blank")}
                    />

                </FormFieldGroup>
            </div>
        )
    } else if (application && waitingList && application.status == "created" && waitingList.identity_verification_required) {
        return (<div className=" max-w-[1180px] w-full">
                <FormFieldGroup title={`Application status: Incomplete`}
                                intro={`To finalize your application, please provide the missing information.`}
                                align={"left"}
                >
                    <IdentityVerification/>

                </FormFieldGroup>
            </div>
        )
    } else {
        return <Loading/>
    }
}