import {useEffect, useState} from "react";
import CheckboxGroup from "../../components/CheckboxGroup.jsx";
import InputField from "../../components/InputField.jsx";
import CheckboxItem from "../../components/CheckboxItem.jsx";
import LargeButton from "../../components/LargeButton.jsx";
import {api} from "../../axios/index.js";
import Loading from "../../components/Loading.jsx";
import FormFieldGroup from "../../components/FormFieldGroup.jsx";
import {AiOutlineCheckCircle} from "react-icons/ai";

export default function SignUp() {
    const [email, setEmail] = useState("")
    const [terms, setTerms] = useState(false)
    const [privacy, setPrivacy] = useState(false)
    const [error, setError] = useState("")
    const [thanks, setThanks] = useState(false)
    const [loading, setLoading] = useState(false)
    const [res, setRes] = useState(null)

    useEffect(() => {
        document.title = `Sign up - fairQ`;
    });

    const handleRegisterSubmit = async (e) => {
        e.preventDefault()

        if (!email) {
            setError("Please provide an eMail address.")
        } else if (!privacy || !terms) {
            setError("Please accept the legal terms before continuing.")
        } else {
            setLoading(true)
            try {
                const res = await api.post("user/register/", {
                    email,
                });

                setRes(res.data)
                setLoading(false)
                setThanks(true)


            } catch (error) {
                if (error.response) {
                    console.log(error.response.data);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log("Error", error.message);
                }
                setError("An error occurred during the registration.")
                setLoading(false)
            }
        }
    }


    if (loading) {
        return (<Loading/>)
    } else if (thanks) {
        return (
            <div className="hero flex flex-col items-center justify-center select-none">
                <div className="text-center">
                    <AiOutlineCheckCircle size="100" className="mx-auto opacity-50 text-primary"/>
                    <h1 className="text-3xl font-bold mt-4 opacity-90">Thank you for signing up!</h1>
                    <p className="text-xl mt-8">We have sent an email to <span className="font-bold">{email}</span>.</p>
                    <p className="text-xl mt-2">To
                        complete the profile, please check your inbox and follow the instructions.</p>
                </div>
            </div>)
    } else {
        return (
            <div
                className="max-w-[1180px] w-full px-4 md:px-8 my-1 h-full flex flex-col justify-center items-center justify-self-center self-center">
                <form className="w-full md:w-1/2 lg:w-1/3 flex flex-col justify-center items-center"
                      onSubmit={handleRegisterSubmit}>
                    <FormFieldGroup
                        title={"Create an account"}
                        intro={"Register to create your first waiting list."}
                        align="center">
                        <InputField
                            type="email"
                            label="Email"
                            is_required={true}
                            placeholder="name@email.com"
                            size="lg"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <CheckboxGroup>
                            <div className="flex flex-col justify-start w-full">
                                <CheckboxItem id="privacy" checked={privacy} onClick={(e) => setPrivacy(!privacy)}
                                              label="I accept the privacy policy"
                                              linkURL="/privacy"
                                              linkTarget="_blank"
                                />
                                <CheckboxItem id="terms" checked={terms} onClick={(e) => setTerms(!terms)}
                                              label="I accept the terms and conditions"
                                              linkURL="/terms"
                                              linkTarget="_blank"
                                />
                                {/*TODO: Add newsletter signup integration*/}
                                {/*<CheckboxItem id="newsletter" checked={newsletter}*/}
                                {/*              onClick={(e) => setNewsletter(!newsletter)}*/}
                                {/*              label="Keep me informed about new features and benefits"/>*/}
                            </div>
                        </CheckboxGroup>
                        <div className="pt-8 w-full">
                            <LargeButton label={"Sign up"} type="submit" variant="primary"/>
                        </div>
                    </FormFieldGroup>

                    <div className="text-error">{error}</div>
                </form>
            </div>
        );
    }
}