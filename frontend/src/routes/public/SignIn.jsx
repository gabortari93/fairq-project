import {useEffect, useState} from "react";
import InputField from "../../components/InputField.jsx";
import LargeButton from "../../components/LargeButton.jsx";
import useLogin from "../../hooks/useLogin.js";
import TitleWithDescription from "../../components/TitleWithDescription.jsx";
import FormFieldGroup from "../../components/FormFieldGroup.jsx";


export default function SignIn() {
    const query = new URLSearchParams(location.search);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {handleLogin, loginError} = useLogin(email, password);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        await handleLogin(email, password);
    };

    useEffect(() => {
        if (query.get("email")) {
            setEmail(decodeURIComponent(query.get("email")))
            query.delete("email")
        }
    }, [])

    useEffect(() => {
        document.title = `Sign in - fairQ`;
    }, []);


    return (
        <div
            className="max-w-[1180px] w-full px-4 md:px-8 my-1 h-full flex flex-col justify-center items-center justify-self-center self-center">
            <form className="w-full md:w-1/2 lg:w-1/3 flex flex-col justify-center items-center"
                  onSubmit={(e) => handleLoginSubmit(e)}>
                <FormFieldGroup
                    title="Log in"
                    intro="Log in to manage your waiting list"
                    align="center"
                >
                    <InputField
                        type="email"
                        placeholder="name@email.com"
                        label="Email"
                        is_required={true}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        errorMessage={loginError?.email}
                        size="lg"
                    />
                    <InputField
                        type="password"
                        placeholder="******"
                        label="Password"
                        is_required={true}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        errorMessage={loginError?.password}
                        size="lg"
                    />
                    <div className="pt-8 w-full">
                        <LargeButton
                            label={"Log in"}
                            type={"submit"}
                            errorMessage={loginError?.detail}
                            variant="primary"
                        />
                    </div>
                </FormFieldGroup>
            </form>
        </div>);
}