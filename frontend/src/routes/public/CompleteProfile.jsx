import {useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import InputField from "../../components/InputField.jsx";
import LargeButton from "../../components/LargeButton.jsx";
import {api} from "../../axios/index.js";
import Loading from "../../components/Loading.jsx";
import useLogin from "../../hooks/useLogin.js";
import FormFieldGroup from "../../components/FormFieldGroup.jsx";
import Error from "../../components/Error.jsx";

export default function CompleteProfile() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(true);
    const [isTokenValid, setIsTokenValid] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [token, setToken] = useState("")
    const [email, setEmail] = useState("")
    const {handleLogin} = useLogin(email, password)

    useEffect(() => {
        document.title = `Complete your profile - fairQ`;
    }, []);

    useEffect(() => {
        async function validateToken() {
            const query = new URLSearchParams(location.search);
            const email = decodeURIComponent(query.get("email"));
            const token = query.get("token");
            setEmail(email)
            setToken(token)
            try {
                const res = await api.post("user/validate-token/", {
                    email,
                    token,
                });
                if (res.status === 200) {
                    setIsTokenValid(true);
                } else {
                    setError({general: res.data.message});
                }
            } catch (err) {
                setError({general: err.response.data.message || err.response.data.detail});
            } finally {
                setLoading(false);
            }
        }

        validateToken();
    }, [location]);

    const handleRegistrationComplete = () => {
        try {
            handleLogin(email, password);
        } catch (error) {
            console.log(error)
            navigate("/sign-in")
        }
    };


    const handleCompleteProfile = async (e) => {
        e.preventDefault();

        let errors = {};
        if (!firstName) errors.firstName = "First name is required.";
        if (!lastName) errors.lastName = "Last name is required.";
        if (!password) errors.password = "Password is required.";
        if (!passwordConfirm) errors.passwordConfirm = "Password confirmation is required.";
        if (password !== passwordConfirm) errors.passwordConfirm = "Passwords must match.";

        setError(errors);

        if (Object.keys(errors).length === 0) {
            try {
                const res = await api.post("user/complete-profile/", {
                    email: email,
                    first_name: firstName,
                    last_name: lastName,
                    password: password,
                    password_repeat: passwordConfirm,
                    token: token,
                });

                if (res.status === 200) {
                    handleRegistrationComplete()
                } else {
                    setError({general: res.data.message});
                }
            } catch (err) {
                console.log(err)
                setError({general: "An error occurred while completing the profile."});
            }
        }
    }

    if (loading) {
        return <Loading/>;
    } else if (!isTokenValid) {
        return <Error title={"We could not validate your link"} explanation={error.general} resolution={"Contact support"} resolutionFunc={()=>{navigate("/support")}}/>
    } else {
        return (
            <div
                className="max-w-[1180px] w-full px-4 md:px-8 my-1 mb-20 h-full flex flex-col justify-center items-center justify-self-center self-center">
                <form
                    className="w-full md:w-1/2 lg:w-1/3 flex flex-col justify-center items-center"
                    onSubmit={handleCompleteProfile}>
                    <FormFieldGroup
                        title="Complete your profile"
                        intro="Fill out the required information, so that we can create your profile."
                        align="center">
                        <InputField
                            type="text"
                            placeholder="First name"
                            label="First name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            is_required={true}
                            errorMessage={error.firstName}/>
                        <InputField
                            type="text"
                            placeholder="Last name"
                            label="Last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            is_required={true}
                            errorMessage={error.lastName}/>
                        <InputField
                            type="password"
                            placeholder="Password"
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            is_required={true}
                            errorMessage={error.password}/>
                        <InputField
                            type="password"
                            placeholder="Repeat password"
                            label="Repeat password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            is_required={true}
                            errorMessage={error.passwordConfirm}/>
                        <div className="pt-8 w-full">
                            <LargeButton
                                label={"Complete registration"}
                                type="submit"
                                errorMessage={error.general}
                                variant="primary"/>
                        </div>
                    </FormFieldGroup>
                </form>
            </div>
        );
    }
}
