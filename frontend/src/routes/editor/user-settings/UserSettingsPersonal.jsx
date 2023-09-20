import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {api} from "../../../axios/index.js";
import {loadUserDetails} from "../../../store/slices/user.js";
import FormFieldGroup from "../../../components/FormFieldGroup.jsx";
import InputField from "../../../components/InputField.jsx";
import MediumButton from "../../../components/MediumButton.jsx";
import Loading from "../../../components/Loading.jsx";
import Toast from "../../../components/Toast.jsx";
import LargeButton from "../../../components/LargeButton.jsx";

export default function UserSettingsPersonal() {
    const dispatch = useDispatch();
    const userDetails = useSelector((state) => state.user.details);
    const token = useSelector((state) => state.user.accessToken);
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");  // success by default
    const [error, setError] = useState({});


    useEffect(() => {
        document.title = `User Settings Personal - fairQ`;

        const fetchUserDetails = async () => {
            try {
                const response = await api.get("auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = response.data;
                dispatch(loadUserDetails(data));
                setLoading(false);
                if (data) {
                    setFirstName(data.first_name);
                    setLastName(data.last_name);
                    setEmail(data.email);
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, []);

    useEffect(() => {
        if (userDetails) {
            setFirstName(userDetails.first_name);
            setLastName(userDetails.last_name);
        }
    }, [userDetails]);

    const handleUpdateName = async (e) => {
        e.preventDefault()

        let errors = {};
        if (!firstName) errors.firstName = "First name cannot be blank.";
        if (!lastName) errors.lastName = "Last name cannot be blank.";

        setError(errors);

        if (Object.keys(errors).length === 0) {
            try {
                const patchData = {first_name: firstName, last_name: lastName};
                const response = await api.patch("auth/me/", patchData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                dispatch(loadUserDetails(response.data));
                setToastMessage("Name updated successfully!");
                setToastType("success");
                setToastVisible(true);

            } catch (error) {
                console.error("Error updating names:", error);
                setToastMessage("Name could not be updated.");
                setToastType("error");
                setToastVisible(true);
            }
        }
    };

    if (loading || !userDetails) {
        return <Loading/>;
    } else {
        return (
            <div className="max-w-[1180px] w-full block mb-20">
                <form
                    className="w-full text-start sm:w-2/3 lg:w-1/2"
                    onSubmit={(e) => handleUpdateName(e)}>
                    <FormFieldGroup
                        title={"About You"}
                        intro={""}
                        align="left"

                    >
                        <InputField
                            label={"eMail"}
                            sublabel="this cannot be changed"
                            is_required={true}
                            value={email}
                            disabled={true}
                        />
                        <InputField
                            label={"First name"}
                            is_required={true}
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                            errorMessage={error.firstName}
                        />
                        <InputField
                            label={"Last name"}
                            is_required={true}
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                            errorMessage={error.lastName}
                        />

                        {/*             <span className="w-full mt-11 text-xl sm:text-2xl font-bold">Language</span>
        <SelectionField label={"Select a display language"}/> */}
                        <div className="w-full mt-8">
                            <LargeButton
                                label={"Update name"}
                                type={"submit"}
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
            </div>
        );
    }
}
