import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import FormFieldGroup from "../../components/FormFieldGroup.jsx";
import InputField from "../../components/InputField.jsx";
import MediumButton from "../../components/MediumButton.jsx";
import {useSelector} from "react-redux";
import Loading from "../../components/Loading.jsx";
import LargeButton from "../../components/LargeButton.jsx";
import {api} from "../../axios/index.js";
import Toast from "../../components/Toast.jsx";

export default function ApplicantWaitinglistStart() {
    const waitingList = useSelector(state => state.applicant.waitingList)
    const {listSlug} = useParams()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");  // success by default
    const isLoggedIn = useSelector(state => state.user.accessToken)
    const user = useSelector(state => state.user.details)
    const customBranding = useSelector(state => state.applicant.customBranding)

    useEffect(() => {
        document.title = `${waitingList.name} - fairQ`;
    }, [waitingList]);

    const handleRequestLoginLink = async (e) => {
        e.preventDefault()
        const data = {
            email: email,
            waiting_list: waitingList.id,
        }

        try {
            const res = await api.post(`auth/login/request-link`, data)
            setToastMessage("If an account with this email exists, a login link will be sent.");
            setToastType("success");
            setToastVisible(true);
            setEmail("")
        } catch (e) {
            setToastMessage("There was a problem processing your request. Please try again.");
            setToastType("error");
            setToastVisible(true);
        }
    }

    if (!waitingList || customBranding === undefined) {
        return <Loading/>
    } else {
        return (
            <div
                className="w-full px-4 md:px-8 md:w-2/3 lg:w-1/2 mx-auto flex flex-col gap-10 self-center justify-self-center">
                <div className="hero min-h-max w-full self-start mt-14">
                    <div className="hero-content text-center px-0">
                        <div className="max-w-2xl">
                            {(customBranding && customBranding.logo) && <div className="w-full flex justify-center items-center">
                                <div className="w-36 h-fit mb-6">
                                    <img alt="logo" src={customBranding.logo}/>
                                </div>
                            </div>}
                            <h2 className={`pb-4 text-lg sm:text-xl md:text-2xl lg:text-3xl opacity-70`}>{waitingList.organisation.name}</h2>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold hyphens-auto">{waitingList.name}</h1>
                            {waitingList.usual_waiting_time &&
                                <div className="mt-8 opacity-70">Usual waiting time on this waiting list is<span
                                    className="lowercase ml-1">{waitingList.usual_waiting_time}</span></div>}

                            <p className="py-8 md:text-lg opacity-80 leading-relaxed text-justify">{waitingList.description}</p>
                            <LargeButton
                                customBranding={customBranding}
                                variant={isLoggedIn ? "secondary" : "primary"}
                                label="Register now"
                                onClick={(e) => navigate(`/list/${listSlug}/apply`)}
                            />
                            {toastVisible && (
                                <Toast type={toastType} onClose={() => setToastVisible(false)}>
                                    {toastMessage}
                                </Toast>
                            )}
                        </div>
                    </div>
                </div>
                {isLoggedIn && user ? (
                    <div className="container w-full h-auto mb-16" id="registered">
                        <FormFieldGroup title={`Welcome back, ${user.first_name}.`}
                                        intro={`You are already logged in. Access the dashboard to see and manage your application for ${waitingList.name}.`}>
                            <LargeButton
                                customBranding={customBranding}
                                label="Open dashboard"
                                variant="primary"
                                type="submit"
                                onClick={(e) => navigate(`/list/${waitingList.slug}/dashboard`)}
                            />
                        </FormFieldGroup>
                    </div>
                ) : (
                    <div className="container w-full h-auto mb-16" id="registered">
                        <form onSubmit={(e) => handleRequestLoginLink(e)}>
                            <FormFieldGroup title={"Already registered?"}
                                            intro={"Request a login link to access your dashboard."}>
                                <div
                                    className={"w-full flex flex-col sm:flex-row justify-between items-center sm:gap-x-5"}>
                                    <InputField
                                        label="Email"
                                        is_required={true}
                                        placeholder="yourname@email.com"
                                        value={email} size="md"
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                    />
                                    <MediumButton
                                        customBranding={customBranding}
                                        label="Get login link"
                                        variant="primary"
                                        type="submit" disabled={!email}/>
                                </div>
                            </FormFieldGroup>
                        </form>
                    </div>
                )}

            </div>

        );
    }
}