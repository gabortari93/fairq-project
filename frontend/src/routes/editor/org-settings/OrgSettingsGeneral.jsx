import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import FormFieldGroup from "../../../components/FormFieldGroup.jsx";
import InputField from "../../../components/InputField.jsx";
import TextareaField from "../../../components/TextareaField.jsx";
import TitleWithDescription from "../../../components/TitleWithDescription.jsx";
import {api} from "../../../axios/index.js";
import {useDispatch, useSelector} from "react-redux";
import {loadOrganization} from "../../../store/slices/editor.js";
import Loading from "../../../components/Loading.jsx";
import Toast from "../../../components/Toast.jsx";


export default function OrgSettingsGeneral() {
    const token = useSelector((state) => state.user.accessToken);
    const organization = useSelector((state) => state.editor.organization);
    const [organizationState, setOrganizationState] = useState(organization);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const {orgId} = useParams();
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");


    useEffect(() => {
        setOrganizationState(organization)
        if (organization) {
            document.title = `${organization.name} Settings - fairQ`;
        }
    }, [organization]);

    useEffect(() => {
        fetchOrganization();
    }, [orgId]);

    const handleInputChange = (e) => {
        setOrganizationState({...organizationState, [e.target.id]: e.target.value});
    };

    const fetchOrganization = async () => {
        try {
            const response = await api.get(`/org/${orgId}/`, {
                headers: {Authorization: "Bearer " + token},
            });
            const data = response.data;
            dispatch(loadOrganization(data));
            setLoading(!loading);
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };

    const handleInputData = async (e) => {
        e.preventDefault();
        const orgData = {
            "name": organizationState.name,
            "description": organizationState.description,
            "website_url": organizationState.website_url,
            "contact_url": organizationState.contact_url,
            "privacy_url": organizationState.privacy_url
        }

        let errors = {};
        if (!organizationState.name) errors.name = "Please enter your organization's name";
        if (!organizationState.description) errors.description = "Please describe your organization.";
        if (!organizationState.website_url) errors.website_url = "Please provide website link of your organization.";
        if (!organizationState.contact_url) errors.contact_url = "Please provide contact page link of your organization.";
        if (!organizationState.privacy_url) errors.privacy_url = "Please provide privacy policy page link of your organization.";

        if (organizationState === organization) {
            // if field was not changed, do not send API request
            return
        }

        if (Object.keys(errors).length > 0) {
            setToastMessage("We're missing some data. Please review your entry.");
            setToastType("error");
            setToastVisible(true);
            setError(errors);
        } else {
            try {
                const res = await api.patch(`/org/${orgId}/`, orgData, {
                    headers: {Authorization: "Bearer " + token},
                });
                dispatch(loadOrganization(res.data));
                setToastMessage("Changes saved!");
                setToastType("success");
                setToastVisible(true);
                setError({})
            } catch (e) {
                setError({})
                setToastMessage("Technical error. We could not save your changes.");
                setToastType("error");
                setToastVisible(true);
            }
        }
    };

    if (loading || !organization) return <Loading/>
    else return (<div className="max-w-[1180px] w-full block mb-20">
        <form className="w-full text-start sm:w-2/3 lg:w-1/2">
            <FormFieldGroup
                style={"w-full text-start sm:w-2/3 lg:w-1/2"}
                title={"About the organization"}
                intro={""}
                align={"left"}>
                <InputField id={"name"}
                            value={organizationState.name}
                            label={"Name"}
                            sublabel={"the name of your organisation"}
                            placeholder="e.g. ACME company Ltd."
                            is_required={true}
                            errorMessage={error.name}
                            browser_validate={false}
                            onChange={(e) => handleInputChange(e)}
                            onBlur={(e) => handleInputData(e)}/>

                <TextareaField id={"description"}
                               value={organizationState.description}
                               label={"Description"}
                               sublabel="a short summary of who you are"
                               is_required={true}
                               errorMessage={error.description}
                               browser_validate={false}
                               onChange={(e) => handleInputChange(e)}
                               onBlur={(e) => handleInputData(e)}
                               placeholder={"Summarize what your organization stands for. This will be displayed to the people applying for your waiting list."}/>
            </FormFieldGroup>
            <FormFieldGroup
                title={"Links"}
                intro={""}
                style={"w-full text-start sm:w-2/3 lg:w-1/2"}
                align={"left"}
            >
                <InputField id={"website_url"}
                            value={organizationState.website_url}
                            label={"Home page"}
                            sublabel={"where people can read more about you"}
                            placeholder="https://your-website.com"
                            is_required={true}
                            errorMessage={error.website_url}
                            browser_validate={false}
                            onChange={(e) => handleInputChange(e)}
                            onBlur={(e) => handleInputData(e)}/>

                <InputField id={"contact_url"}
                            value={organizationState.contact_url}
                            label={"Link to contact page"}
                            sublabel="your contact page"
                            placeholder="https//your-website.com/contact-us"
                            is_required={true}
                            errorMessage={error.contact_url}
                            browser_validate={false}
                            onChange={(e) => handleInputChange(e)}
                            onBlur={(e) => handleInputData(e)}/>

                <InputField id={"privacy_url"}
                            value={organizationState.privacy_url}
                            label={"Link to privacy policy"}
                            sublabel={"your privacy policy"}
                            placeholder="https//your-website.com/privacy"
                            is_required={true}
                            errorMessage={error.privacy_url}
                            browser_validate={false}
                            onChange={(e) => handleInputChange(e)}
                            onBlur={(e) => handleInputData(e)}/>

            </FormFieldGroup>
        </form>
        {
            toastVisible && (
                <Toast type={toastType} onClose={() => setToastVisible(false)}>
                    {toastMessage}
                </Toast>
            )
        }
    </div>)
        ;
}