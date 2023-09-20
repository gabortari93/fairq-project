import {useEffect, useState} from "react";
import FormFieldGroup from "../../components/FormFieldGroup.jsx";
import MediumButton from "../../components/MediumButton.jsx";
import InputField from "../../components/InputField.jsx";
import {api} from "../../axios/index.js";
import {useSelector, useDispatch} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {loadConfiguration, loadMemberships, loadOrganization} from "../../store/slices/editor.js";
import Toast from "../../components/Toast.jsx";
import Loading from "../../components/Loading.jsx";
import LargeButton from "../../components/LargeButton.jsx";


export default function CreateWaitinglist() {
    const token = useSelector((state) => state.user.accessToken);
    const organization = useSelector((state) => state.editor.organization);
    const memberships = useSelector((state) => state.editor.memberships);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState({});
    const [name, setName] = useState("");
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const {orgId} = useParams()
    const [organisationId, setOrganisationId] = useState(null)

    useEffect(() => {
        // get memberships from state and find related organisation

        if (memberships && memberships.length > 0) {

            let found = false;

            for (let i = 0; i < memberships.length; i++) {
                // if organisation id matches the orgId
                if (parseInt(memberships[i].organisation.id) === parseInt(orgId)) {
                    // dispatch organisation
                    dispatch(loadOrganization(memberships[i].organisation));
                    setOrganisationId(memberships[i].organisation.id);
                    found = true;
                    break;
                }
            }

            if (!found) navigate('/editor'); // Redirect if memberships data is fetched and no matching organization is found
        }


    }, [orgId, memberships]);


    let listData = {
        name: name,
        organisation: organisationId
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let errors = {};
        if (!name) errors.name = "Please give your waiting list a descriptive name .";
        if (Object.keys(errors).length > 0) {
            setToastMessage("We're missing some data. Please review your entry.");
            setToastType("error");
            setToastVisible(true);
            setError(errors);
        } else {
            try {
                const res = await api.post(`/list/`, listData, {
                    headers: {Authorization: "Bearer " + token},
                });
                dispatch(loadConfiguration(res.data));
                setError({})
                await fetchMemberships();
                navigate(`/editor/list/${res.data.id}/settings`);
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
        }
    };

    if (!organization) return <Loading/>
    else return <div
        className="max-w-[1180px] w-full px-4 md:px-8 my-1 mb-20 h-full flex flex-col justify-center items-center justify-self-center self-center">
        <form
            className="w-full md:w-1/2 lg:w-1/3 flex flex-col justify-center items-center"
            onSubmit={(e) => handleSubmit(e)}>
            <FormFieldGroup title={`Create a waiting list for ${organization.name}`}
                            style={"sm:w-full lg:w-full text-enter "}
                            intro={"You can configure all settings in the next step."}>
                <InputField id={"waiting-list"}
                            label="Name"
                            sublabel="this will be your main identifier"
                            placeholder="My waiting list"
                            is_required={true}
                            errorMessage={error.name}
                            browser_validate={false}
                            onChange={(e) => setName(e.target.value)}/>
                <div className="pt-8 w-full">
                    <LargeButton
                        label={`Create waiting list`}
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