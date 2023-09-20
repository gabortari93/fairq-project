import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import FormFieldGroup from "../../../components/FormFieldGroup.jsx";
import InputField from "../../../components/InputField.jsx";
import MediumButton from "../../../components/MediumButton.jsx";
import {api} from "../../../axios/index.js";
import {useDispatch, useSelector} from "react-redux";
import useLogin from "../../../hooks/useLogin.js";
import TitleWithDescription from "../../../components/TitleWithDescription.jsx";
import {clearApplicant} from "../../../store/slices/applicant.js";

export default function ApplicantWaitinglistDashboardDelete() {
    const token = useSelector(state => state.user.accessToken)
    const waitingList = useSelector(state => state.applicant.waitingList)
    const application = useSelector(state => state.applicant.application)
    const [deleteConfirmation, setDeleteConfirmation] = useState("")
    const navigate = useNavigate()
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [deleteError, setDeleteError] = useState("");
    const {handleLogout} = useLogin()
    const dispatch = useDispatch()


    useEffect(() => {
        document.title = `${waitingList.name} - Delete your application - fairQ`;
    });

    const handleDeleteApplication = async (e) => {
            e.preventDefault();

            if (application.applicant.user.email === deleteConfirmation) {
                try {
                    const res = await api.delete(`/list/${waitingList.id}/application/${application.id}`, {
                        headers: {Authorization: "Bearer " + token},
                    });

                    if (res.data.user_deleted) {
                        dispatch(clearApplicant())
                        handleLogout(`/list/${waitingList.slug}/`)
                    } else {
                        dispatch(clearApplicant())
                        navigate(`/list/${waitingList.slug}`)
                    }

                } catch
                    (e) {
                    setToastMessage("We could not delete your application");
                    setToastType("error");
                    setToastVisible(true);
                }
            } else {
                setDeleteError("Please enter your email address.")
            }
        }
    ;

    if (application && ["waiting","removed"].includes(application.status)) {
        return <div className="max-w-[1180px] mb-20 flex flex-col">
            <TitleWithDescription text_style={"text-4xl"} title={"Remove application"}
                                  description={"Remove your application, if circumstances have changed or you no longer wish to remain on this waiting list."}/>
            <form className="w-full md:w-2/3 lg:w-1/2"
                  onSubmit={(e) => handleDeleteApplication(e)}>
                <div className="container mx-auto h-auto" id="delete-list">
                    <FormFieldGroup align={"start"}
                                    title={"Your spot will be lost"}
                                    intro={"Please be aware that this action is irreversible. By proceeding with this action, your spot in the waiting list will be permanently lost. Should you decide to rejoin the waiting list in the future, you will have to start from the end of the queue. Therefore, we strongly recommend you to consider this decision carefully before proceeding."}>
                        <div className={"w-full flex flex-col sm:flex-row justify-between items-center gap-x-5"}>
                            <InputField
                                style="w-1/2"
                                placeholder={application.applicant.user.email}
                                label="Enter your email address to confirm"
                                value={deleteConfirmation}
                                size="md"
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                                is_required={true}
                                errorMessage={deleteError}
                            />
                            <MediumButton label="Delete my application" variant="error"
                                          type="submit"
                                          disabled={!(deleteConfirmation === application.applicant.user.email)}/>
                        </div>
                    </FormFieldGroup>
                </div>
            </form>
        </div>;
    }
}




