import {useEffect, useState} from "react";
import FormFieldGroup from "../../../components/FormFieldGroup.jsx";
import InputField from "../../../components/InputField.jsx";
import TitleWithDescription from "../../../components/TitleWithDescription.jsx";
import TextareaField from "../../../components/TextareaField.jsx";
import {useDispatch, useSelector} from "react-redux";
import SelectionField from "../../../components/SelectionField.jsx";
import Toast from "../../../components/Toast.jsx";
import {api} from "../../../axios/index.js";
import Loading from "../../../components/Loading.jsx";
import {loadApplication} from "../../../store/slices/applicant.js";

export default function ApplicantWaitinglistDashboardData() {
    const waitingList = useSelector(state => state.applicant.waitingList)
    const [error, setError] = useState({})
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");  // success by default
    const application = useSelector(state => state.applicant.application)
    const dispatch = useDispatch()

    const [editorFields, setEditorFields] = useState(undefined)
    const token = useSelector(state => state.user.accessToken)


    const refreshData = () => {
    const allFields = {};

    // initialize all waiting list fields to an empty string
    waitingList.fields.filter(f=>f.is_displayed===true).forEach(field => {
        allFields[field.name] = "";
    });

    // overwrite with actual values from application.fields where they exist
    const filledFields = application.fields.reduce((acc, field) => ({
        ...acc,
        [field.waiting_list_field.name]: field.value
    }), {});

    const data = {...allFields, ...filledFields};

    setError({});
    setEditorFields(data);
}


    useEffect(() => {
        refreshData();
    }, [application, waitingList]);

    const handleInputChange = (e) => {
    const newState = {...editorFields, [e.target.id]: e.target.value}
    setEditorFields(newState)
    setError({})
}

    const handleInputSave = async (e) => {
        let currentErrors = {...error};
        waitingList.fields.forEach(field => {
            if (field.is_required && e.target.value === "" && field.name === e.target.id) {
                currentErrors = {...currentErrors, [e.target.id]: `Changes not saved. ${field.label} is required.`}
            }
        });

        if (Object.keys(currentErrors).length > 0) { // this is never executed. due to state being async?
            setToastMessage(currentErrors[e.target.id]);
            setToastType("error");
            setToastVisible(true);
            refreshData();
        } else {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
                const res = await api.patch(`/list/${waitingList.id}/application/${application.id}/`, {fields: {[e.target.id]: e.target.value}}, config)
                dispatch(loadApplication(res.data));
                setToastMessage("Changes saved!");
                setToastType("success");
                setToastVisible(true);
            } catch (e) {
                if (e.response.status === 400 && e.response.data.errors) {
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
    }

    const sections = [
        {
            id: "about",
            title: "Personal Information",
            intro: "Review and update your personal details.",
            fields: waitingList.fields.filter(field => field.section === "about" && field.is_displayed)
        },
        {
            id: "contact",
            title: "Contact Details",
            intro: "Make sure your contact information is up to date.",
            fields: waitingList.fields.filter(field => ["contact", "address"].includes(field.section) && field.is_displayed)
        },
        {
            id: "motivation",
            title: "Your Motivation",
            intro: "Revisit your initial motivation and update if necessary.",
            fields: waitingList.fields.filter(field => field.section === "motivation" && field.is_displayed)
        },
        {
            id: "others",
            title: "Additional Information",
            intro: "Manage and update any other information you've provided.",
            fields: waitingList.fields.filter(field => field.section === "other" && field.is_displayed)
        },
]


    useEffect(() => {
        document.title = `${waitingList?.name} - Your data - fairQ`;
    }, [waitingList]);

    if (waitingList && application && editorFields) {
        return (<div className="max-w-[1180px] mb-20 flex flex-col">
            <TitleWithDescription text_style={"text-4xl"} title={"Your application data"}
                                  description={"Review and manage the information you've provided in your application."}/>
            <form className="w-full md:w-2/3 lg:w-1/2">
                <FormFieldGroup align="start" title={"General Information"} intro={"Review your primary account details."}>
                    <InputField
                        id="first_name"
                        type="text"
                        label="First name"
                        sublabel="this cannot be changed"
                        disabled={true}
                        placeholder="First name"
                        value={application.applicant.user.first_name}
                        size="lg"
                    />
                    <InputField
                        id="last_name"
                        type="text"
                        label="Last name"
                        sublabel="this cannot be changed"
                        disabled={true}
                        placeholder="Last name"
                        value={application.applicant.user.last_name}
                        size="lg"
                    />
                    <InputField
                        id="email"
                        type="text"
                        label="Email"
                        sublabel="this cannot be changed"
                        disabled={true}
                        placeholder="Email"
                        value={application.applicant.user.email}
                        size="lg"
                    />
                </FormFieldGroup>
                {sections.map(section =>
                    section.fields.length > 0 &&
                    <FormFieldGroup key={section.id} align="start" title={section.title} intro={section.intro}>
                        {
                            section.fields
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
                                            value={editorFields[field.name]}
                                            onChange={(e) => handleInputChange(e)}
                                            onBlur={(e) => handleInputSave(e)}
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
                                            value={editorFields[field.name]}
                                            options={field.data}
                                            onChange={(e) => handleInputSave(e)}
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
                                            value={editorFields[field.name]}
                                            onChange={(e) => handleInputChange(e)}
                                            onBlur={(e) => handleInputSave(e)}
                                            errorMessage={error[field.name]}
                                            browser_validate={false}
                                            size="lg"
                                        />)
                                    }
                                })
                        }
                    </FormFieldGroup>
                )}
            </form>
            {toastVisible && (
                <Toast type={toastType} onClose={() => {
                    setToastVisible(false);
                }}>
                    {toastMessage}
                </Toast>
            )}
        </div>);
    } else {
        return <Loading/>
    }
}