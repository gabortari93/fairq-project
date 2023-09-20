import {useDispatch, useSelector} from "react-redux";
import Loading from "./Loading.jsx";
import FilePreview from "./FilePreview.jsx";
import FormFieldGroup from "./FormFieldGroup.jsx";
import dayjs from "dayjs";
import MediumButton from "./MediumButton.jsx";
import {useState} from "react";
import {api} from "../axios/index.js";
import {loadApplication} from "../store/slices/applicant.js";

export default function IdentityVerification() {
    const [loading, setLoading] = useState(false)
    const token = useSelector(state => state.user.accessToken)
    const waitingList = useSelector(state => state.applicant.waitingList)
    const application = useSelector(state => state.applicant.application)
    const [files, setFiles] = useState(null)
    const dispatch = useDispatch()
    const [error, setError] = useState("")

    const setFilesFunc = (id, file) => {
        setFiles({...files, [id]: file})
    }

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


    const handleCreateIdentityVerification = async (e) => {
        e.preventDefault()

        if (!files || !files.file_front || !files.file_back) {
            setError("Please provide two files.")
            return
        }

        try {
            setLoading(true)

            const formData = new FormData();
            files.file_front && formData.append("file_front", files.file_front);
            files.file_back && formData.append("file_back", files.file_back);

            const res = await api.post(`/identity-verification/${application.applicant.id}/create/`, formData, {
                headers: {
                    Authorization: "Bearer " + token,
                    'Content-Type': 'multipart/form-data'
                }
            });

            fetchApplication();

            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setError("There was an error uploading your files. Please try again")
        }


    }

    if (loading) {
        return <Loading/>
    } else if (waitingList && application) {

        if (application.latest_identity_verification) {

            const {id, status, created_date, file_back, file_front} = application.latest_identity_verification


            if (status === "pending") {
                return <>
                    <FormFieldGroup
                        title={"We currently review your identity documents"}
                        intro={"You will enter the waiting list as soon as this is done."}
                        align={"left text-primary"}
                    >
                        <div className="my-2 font-semibold text-neutral-500">Documents
                            uploaded {dayjs().to(dayjs(created_date))}</div>
                        <FilePreview
                            label="Front"
                            sublabel="front side"
                            url={`${import.meta.env.VITE_BACKEND_BASEURL}${file_front}`}
                            interactive={false}
                        />
                        <FilePreview
                            label="Back"
                            sublabel="back side"
                            url={`${import.meta.env.VITE_BACKEND_BASEURL}${file_back}`}
                            interactive={false}
                        />
                    </FormFieldGroup>
                </>
            } else if (status === "verified") {
                return <>
                    <FormFieldGroup
                        title={"We have successfully confirmed your identity"}
                        intro={"Please wait a few moments until we move you to the waiting list."}
                        align={"left text-accent"}
                    >
                        <div className="my-2 font-semibold text-neutral-500">Documents
                            uploaded {dayjs().to(dayjs(created_date))}</div>
                        <FilePreview
                            label="Front"
                            sublabel="front side"
                            url={`${import.meta.env.VITE_BACKEND_BASEURL}${file_front}`}
                            interactive={false}
                        />
                        <FilePreview
                            label="Back"
                            sublabel="back side"
                            url={`${import.meta.env.VITE_BACKEND_BASEURL}${file_back}`}
                            interactive={false}
                        />
                    </FormFieldGroup>
                </>
            }

        }

        return <form onSubmit={(e) => handleCreateIdentityVerification(e)}>
            <FormFieldGroup
                title={"We need to verify your identity"}
                intro={"Please upload a copy of your passport or ID."}
                align={"left text-warning"}
            >
                <div className="my-2 font-semibold text-neutral-500"></div>
                <div className="text-neutral">

                    <FilePreview
                        id="file_front"
                        label="Front"
                        sublabel="front side"
                        url={``}
                        onFileChange={setFilesFunc}
                        interactive={true}
                    />
                    <FilePreview
                        id="file_back"
                        label="Back"
                        sublabel="back side"
                        url={``}
                        onFileChange={setFilesFunc}
                        interactive={true}
                    />
                </div>
                {error && <div className="text-error">{error}</div>}
                <MediumButton label={"Upload"} type="submit"/>
            </FormFieldGroup>
        </form>


    } else {
        <Loading/>
    }

}