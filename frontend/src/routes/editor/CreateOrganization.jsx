import {useEffect, useState} from "react";
import FormFieldGroup from "../../components/FormFieldGroup.jsx";
import InputField from "../../components/InputField.jsx";
import TextareaField from "../../components/TextareaField.jsx";
import LargeButton from "../../components/LargeButton.jsx";
import {api} from "../../axios/index.js";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {loadMemberships, loadOrganization} from "../../store/slices/editor.js";
import Toast from "../../components/Toast.jsx";

export default function CreateOrganization() {
    const token = useSelector((state) => state.user.accessToken);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState({});
    const [formData, setFormData] = useState({});
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");


    useEffect(() => {
        document.title = `Create organization - fairQ`;
    });

    const handleInputChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value});
    };

    const fetchMemberships = async () => {
        try {
            const res = await api.get("user/me/memberships", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            dispatch(loadMemberships(res.data))

        } catch (e) {
            console.log(e);
            navigate("/sign-in")
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const orgData = {
            "name": formData.name,
            "description": formData.description,
            "website_url": formData.website_url,
            "contact_url": formData.contact_url,
            "privacy_url": formData.privacy_url
        }

        let errors = {};
        if (!formData.name) errors.name = "Please let us know your first name.";
        if (!formData.description) errors.description = "Please describe your organization.";
        if (!formData.website_url) errors.website_url = "Please provide website link of your organization.";
        if (!formData.contact_url) errors.contact_url = "Please provide contact page link of your organization.";
        if (!formData.privacy_url) errors.privacy_url = "Please provide privacy policy page link of your organization.";

        if (Object.keys(errors).length > 0) {
            setToastMessage("We're missing some data. Please review your entry.");
            setToastType("error");
            setToastVisible(true);
            setError(errors);
        } else {
            try {
                const res = await api.post(`/org/`, orgData, {
                    headers: {Authorization: "Bearer " + token},
                });
                dispatch(loadOrganization(res.data))
                setError({})
                const memberships = await fetchMemberships()

                navigate(`/editor/create-list/${res.data.id}`);

            } catch (e) {
                if (e.response.status === 400 && e.response.data.errors) {
                    setError(e.response.data.errors)
                    setToastMessage("Some data is not correct yet. Please review your entry.");
                    setToastType("error");
                    setToastVisible(true);
                } else if (e.response.status === 400 && e.response.data) {
                    setError(e.response.data)
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

    return <div
        className="max-w-[1180px] w-full px-4 md:px-8 my-1 mb-20 h-full flex flex-col justify-center items-center justify-self-center self-center">
        <form
            className="w-full md:w-1/2 lg:w-1/3 flex flex-col justify-center items-center"
            onSubmit={(e) => handleSubmit(e)}>
            <FormFieldGroup title={"First, let’s create an organization"}
                            style={"sm:w-full lg:w-full text-start "}
                            intro={"Please let us know on behalf of what company, club, or authority you will be managing a waiting list."}>
                <InputField id={"name"}
                            label={"Name"}
                            sublabel={"the name of your organisation"}
                            placeholder="e.g. ACME company Ltd."
                            is_required={true}
                            style={"w-4/5 mt-2"}
                            errorMessage={error.name}
                            browser_validate={false}
                            onChange={(e) => handleInputChange(e)}/>
                <TextareaField id={"description"}
                               label={"Description"}
                               sublabel="a short summary of who you are"
                               style={"w-4/5 mt-2 "}
                               is_required={true}
                               errorMessage={error.description}
                               browser_validate={false}
                               onChange={(e) => handleInputChange(e)}
                               placeholder={"e.g. We are a football club located in Zurich, Switzerland."}/>
                <InputField id={"website_url"}
                            label={"Home page"}
                            sublabel={"where people can read more about you"}
                            placeholder="https://your-website.com"
                            is_required={true}
                            errorMessage={error.website_url}
                            browser_validate={false}
                            onChange={(e) => handleInputChange(e)}
                            style={"w-4/5 mt-2"}/>
                <InputField id={"contact_url"}
                            label={"Contact URL"}
                            sublabel="your contact page"
                            placeholder="https//your-website.com/contact-us"
                            is_required={true}
                            errorMessage={error.contact_url}
                            browser_validate={false}
                            onChange={(e) => handleInputChange(e)}/>
                <InputField id={"privacy_url"}
                            label={"Privacy URL"}
                            sublabel={"your privacy policy"}
                            placeholder="https//your-website.com/privacy"
                            is_required={true}
                            errorMessage={error.privacy_url}
                            browser_validate={false}
                            onChange={(e) => handleInputChange(e)}/>
                <div className="pt-8 w-full">
                    <LargeButton
                        label={`Create ${(!formData.name || formData.name.length > 25) ? ("organisation") : (formData.name)}`}
                        type="submit"
                        variant="primary"
                    />
                </div>
            </FormFieldGroup>
        </form>
        {toastVisible && (
            <Toast type={toastType} onClose={() => setToastVisible(false)}>
                {toastMessage}
            </Toast>
        )}

    </div>;
}