import {useEffect, useState} from "react";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import TitleWithDescription from "../../components/TitleWithDescription.jsx";
import FormFieldGroup from "../../components/FormFieldGroup.jsx";
import InputField from "../../components/InputField.jsx";
import TextareaField from "../../components/TextareaField.jsx";
import CheckboxItem from "../../components/CheckboxItem.jsx";
import CheckboxGroup from "../../components/CheckboxGroup.jsx";
import {useSelector} from "react-redux";
import SelectionField from "../../components/SelectionField.jsx";
import {api} from "../../axios/index.js";
import Toast from "../../components/Toast.jsx";
import Loading from "../../components/Loading.jsx";
import LargeButton from "../../components/LargeButton.jsx";

export default function ApplicantWaitinglistApply() {
    const waitingList = useSelector(state => state.applicant.waitingList)
    const [error, setError] = useState({})
    const [formData, setFormData] = useState({})
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");  // success by default
    const [submitted, setSubmitted] = useState(false)
    const customBranding = useSelector(state=>state.applicant.customBranding)

    const aboutFields = waitingList.fields.filter(field => field.section === "about" && field.is_displayed);
    const contactFields = waitingList.fields.filter(field => ["contact", "address"].includes(field.section) && field.is_displayed);
    const motivationFields = waitingList.fields.filter(field => field.section === "motivation" && field.is_displayed);
    const otherFields = waitingList.fields.filter(field => field.section === "other" && field.is_displayed);


    const handleInputChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({...formData, [e.target.id]: value});
    };

    const handleApplicationSubmit = async (e) => {
        e.preventDefault();

        let errors = {};
        if (!formData.first_name) errors.first_name = "Please let us know your first name.";
        if (!formData.last_name) errors.last_name = "Please provide your last name.";
        if (!formData.email) errors.email = "Please provide an email address.";

        waitingList.fields.forEach(field => {
            if (field.is_displayed && field.is_required && !formData[field.name]) {
                errors[field.name] = `The field '${field.label}' is required.`
            }
        })

        if (!formData.org_policy) errors.org_policy = `Please accept the terms of ${waitingList.organisation.name}`
        if (!formData.policy) errors.policy = `Please accept our legal terms`

        if (Object.keys(errors).length > 0) {
            console.log(errors)
            setToastMessage("We're missing some data. Please review your entry.");
            setToastType("error");
            setToastVisible(true);
            setError(errors);
        } else {

            let submitFields = Object.entries(formData).reduce((acc, [key, value]) => {
                if (!["email", "first_name", "last_name", "policy", "org_policy"].includes(key) && value !== "" && value !== null && value !== undefined) {
                    acc[key] = value;
                }
                return acc;
            }, {});


            const submitData = {
                "email": formData.email,
                "first_name": formData.first_name,
                "last_name": formData.last_name,
                "fields": submitFields
            }

            try {
                const res = await api.post(`list/${waitingList.id}/application/`, submitData)
                setError({})
                setToastMessage("Data saved");
                setToastType("success");
                setToastVisible(true);

                setSubmitted(true)

            } catch (e) {
                if (e.response.status === 400 && e.response.data.message) {
                    setError({})
                    setToastMessage("We cannot receive another entry with this email address.");
                    setToastType("error");
                    setToastVisible(true);
                } else if (e.response.status === 400 && e.response.data.errors) {
                    setError(e.response.data.errors)
                    setToastMessage("Some data is not correct yet. Please review your entry.");
                    setToastType("error");
                    setToastVisible(true);
                } else {
                    setError({})
                    setToastMessage("Technical error. We could not save your application.");
                    setToastType("error");
                    setToastVisible(true);
                }
            }
        }


    };

    useEffect(() => {
        document.title = `${waitingList?.name} Apply - fairQ`;
    },[waitingList]);

    if (!submitted && waitingList && customBranding!==undefined)
        return (<div className="max-w-[1180px] px-4 md:px-8 mb-20 flex flex-col">
            <TitleWithDescription text_style={"text-4xl"} title={waitingList.name}
                                  description={waitingList.description}/>
            <form className="w-full md:w-2/3 lg:w-1/2" onSubmit={(e) => handleApplicationSubmit(e)}>
                <FormFieldGroup align="start" title={"About you"} intro={"Tell us who you are"}>
                    <InputField
                        id="first_name"
                        type="text"
                        label="First name"
                        is_required={true}
                        placeholder="First name"
                        is_controlled={false}
                        onChange={(e) => handleInputChange(e)}
                        errorMessage={error.first_name}
                        browser_validate={false}
                        size="lg"
                    />
                    <InputField
                        id="last_name"
                        type="text"
                        label="Last name"
                        is_required={true}
                        placeholder="Last name"
                        is_controlled={false}
                        onChange={(e) => handleInputChange(e)}
                        errorMessage={error.last_name}
                        browser_validate={false}
                        size="lg"
                    />
                    {
                        aboutFields
                            .sort((a, b) => a.order - b.order)
                            .map((field) => {
                                if (["text", "email", "phone", "date"].includes(field.type)) {
                                    return (<InputField
                                        key={field.id}
                                        id={field.name}
                                        type={field.type}
                                        label={field.label}
                                        is_required={field.is_required}
                                        placeholder={field.placeholder}
                                        is_controlled={false}
                                        onChange={(e) => handleInputChange(e)}
                                        errorMessage={error[field.name]}
                                        browser_validate={false}
                                        size="lg"
                                    />)
                                } else if (field.type === "select") {
                                    return (<SelectionField
                                        key={field.id}
                                        id={field.name}
                                        label={field.label}
                                        is_required={field.is_required}
                                        placeholder={field.placeholder}
                                        is_controlled={false}
                                        options={field.data}
                                        onChange={(e) => handleInputChange(e)}
                                        errorMessage={error[field.name]}
                                        browser_validate={false}
                                        size="lg"
                                    />)
                                } else if (field.type === "textarea") {
                                    return (<TextareaField
                                        key={field.id}
                                        id={field.name}
                                        label={field.label}
                                        is_required={field.is_required}
                                        placeholder={field.placeholder}
                                        is_controlled={false}
                                        onChange={(e) => handleInputChange(e)}
                                        errorMessage={error[field.name]}
                                        browser_validate={false}
                                        size="lg"
                                    />)
                                }
                            })
                    }
                </FormFieldGroup>


                <FormFieldGroup align="start" title={"Contact details"} intro={"How can we reach you?"}>
                    <InputField
                        id="email"
                        type="email"
                        label="Email"
                        is_required={true}
                        placeholder="Email address"
                        is_controlled={false}
                        onChange={(e) => handleInputChange(e)}
                        errorMessage={error.email}
                        browser_validate={false}
                        size="lg"
                    />
                    {
                        contactFields
                            .filter(field => ["contact", "address"].includes(field.section) && field.is_displayed)
                            .sort((a, b) => a.order - b.order)
                            .map((field) => {
                                if (["text", "email", "phone", "date"].includes(field.type)) {
                                    return (<InputField
                                        key={field.id}
                                        id={field.name}
                                        type={field.type}
                                        label={field.label}
                                        is_required={field.is_required}
                                        placeholder={field.placeholder}
                                        is_controlled={false}
                                        onChange={(e) => handleInputChange(e)}
                                        errorMessage={error[field.name]}
                                        browser_validate={false}
                                        size="lg"
                                    />)
                                } else if (field.type === "select") {
                                    return (<SelectionField
                                        key={field.id}
                                        id={field.name}
                                        label={field.label}
                                        is_required={field.is_required}
                                        placeholder={field.placeholder}
                                        is_controlled={false}
                                        options={field.data}
                                        onChange={(e) => handleInputChange(e)}
                                        errorMessage={error[field.name]}
                                        browser_validate={false}
                                        size="lg"
                                    />)
                                } else if (field.type === "textarea") {
                                    return (<TextareaField
                                        key={field.id}
                                        id={field.name}
                                        label={field.label}
                                        is_required={field.is_required}
                                        placeholder={field.placeholder}
                                        is_controlled={false}
                                        onChange={(e) => handleInputChange(e)}
                                        errorMessage={error[field.name]}
                                        browser_validate={false}
                                        size="lg"
                                    />)
                                }
                            })
                    }
                </FormFieldGroup>

                {motivationFields.length > 0 &&
                    <FormFieldGroup align="start" title={"Why you?"}
                                    intro={"Tell us more about your motivation to join the waiting list."}>
                        {
                            motivationFields
                                .filter(field => field.section === "motivation" && field.is_displayed)
                                .sort((a, b) => a.order - b.order)
                                .map((field) => {
                                    if (["text", "email", "phone", "date"].includes(field.type)) {
                                        return (<InputField
                                            key={field.id}
                                            id={field.name}
                                            type={field.type}
                                            label={field.label}
                                            is_required={field.is_required}
                                            placeholder={field.placeholder}
                                            is_controlled={false}
                                            onChange={(e) => handleInputChange(e)}
                                            errorMessage={error[field.name]}
                                            browser_validate={false}
                                            size="lg"
                                        />)
                                    } else if (field.type === "select") {
                                        return (<SelectionField
                                            key={field.id}
                                            id={field.name}
                                            label={field.label}
                                            is_required={field.is_required}
                                            placeholder={field.placeholder}
                                            is_controlled={false}
                                            options={field.data}
                                            onChange={(e) => handleInputChange(e)}
                                            errorMessage={error[field.name]}
                                            browser_validate={false}
                                            size="lg"
                                        />)
                                    } else if (field.type === "textarea") {
                                        return (<TextareaField
                                            key={field.id}
                                            id={field.name}
                                            label={field.label}
                                            is_required={field.is_required}
                                            placeholder={field.placeholder}
                                            is_controlled={false}
                                            onChange={(e) => handleInputChange(e)}
                                            errorMessage={error[field.name]}
                                            browser_validate={false}
                                            size="lg"
                                        />)
                                    }
                                })
                        }
                    </FormFieldGroup>
                }

                {otherFields.length > 0 &&
                    <FormFieldGroup align="start" title={"Other information"} intro={"What else should we know?"}>
                        {
                            otherFields
                                .filter(field => field.section === "other" && field.is_displayed)
                                .sort((a, b) => a.order - b.order)
                                .map((field) => {
                                    if (["text", "email", "phone", "date"].includes(field.type)) {
                                        return (<InputField
                                            key={field.id}
                                            id={field.name}
                                            type={field.type}
                                            label={field.label}
                                            is_required={field.is_required}
                                            placeholder={field.placeholder}
                                            is_controlled={false}
                                            onChange={(e) => handleInputChange(e)}
                                            errorMessage={error[field.name]}
                                            browser_validate={false}
                                            size="lg"
                                        />)
                                    } else if (field.type === "select") {
                                        return (<SelectionField
                                            key={field.id}
                                            id={field.name}
                                            label={field.label}
                                            is_required={field.is_required}
                                            placeholder={field.placeholder}
                                            is_controlled={false}
                                            options={field.data}
                                            onChange={(e) => handleInputChange(e)}
                                            errorMessage={error[field.name]}
                                            browser_validate={false}
                                            size="lg"
                                        />)
                                    } else if (field.type === "textarea") {
                                        return (<TextareaField
                                            key={field.id}
                                            id={field.name}
                                            label={field.label}
                                            is_required={field.is_required}
                                            placeholder={field.placeholder}
                                            is_controlled={false}
                                            onChange={(e) => handleInputChange(e)}
                                            errorMessage={error[field.name]}
                                            browser_validate={false}
                                            size="lg"
                                        />)
                                    }
                                })
                        }
                    </FormFieldGroup>
                }

                <FormFieldGroup align="start" title="Submit your application"
                                intro="You will receive a confirmation email afterwards.">
                    <CheckboxGroup>
                        <CheckboxItem id={"org_policy"}
                                      style={"self-start"}
                                      label={`I agree to the Privacy Policy of ${waitingList.organisation.name}`}
                                      is_controlled={false}
                                      checked={false}
                                      onChange={(e) => handleInputChange(e)}
                                      errorMessage={error.org_policy}
                                      size="lg"
                                      linkURL={waitingList.organisation.privacy_url}
                                      linkTarget="_blank"
                        />
                        <CheckboxItem id={"policy"}
                                      style={"self-start"}
                                      label={"I agree to the Terms and the Privacy Policy of fairQ"}
                                      is_controlled={false}
                                      checked={false}
                                      onChange={(e) => handleInputChange(e)}
                                      errorMessage={error.policy}
                                      size="lg"
                                      linkURL="/privacy"
                                      linkTarget="_blank"

                        />
                    </CheckboxGroup>

                    <div className="flex flex-col w-full h-fit mt-8">
                        <LargeButton
                            customBranding={customBranding}
                            label={"Submit application"}
                            type="submit"
                            variant="primary"
                            onClick={e => handleApplicationSubmit(e)}/>
                    </div>

                </FormFieldGroup>
            </form>
            {toastVisible && (
                <Toast type={toastType} onClose={() => setToastVisible(false)}>
                    {toastMessage}
                </Toast>
            )}
        </div>);
    else if (submitted && waitingList) {
        return (
            <div
                className="w-full px-4 md:px-8 md:w-2/3 lg:w-1/2 mx-auto flex flex-col gap-10 self-center justify-self-center">
                <div className="hero min-h-max w-full self-start mt-14">
                    <div className="hero-content text-center px-0">
                        <div className="max-w-2xl">
                            <h2 className={`pb-4 text-lg sm:text-xl md:text-2xl lg:text-3xl opacity-70`}></h2>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold hyphens-auto">Thank you! We have received your application.</h1>
                            <p className="py-8 md:text-lg opacity-80 leading-relaxed text-justify">As a next step, you will receive an email with a link. Please open it to finally complete your registration. You will get access to your personal dashboard, where you can see and manage your waiting list entry.</p>
                            <p className="py-8 md:text-lg opacity-80 leading-relaxed text-justify">You did not receive an email? <NavLink to={"/support"} className="underline">Contact support</NavLink>.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return <Loading/>
    }
}