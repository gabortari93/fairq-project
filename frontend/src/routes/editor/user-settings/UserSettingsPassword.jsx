import {useEffect} from "react";
import FormFieldGroup from "../../../components/FormFieldGroup.jsx";
import InputField from "../../../components/InputField.jsx";
import MediumButton from "../../../components/MediumButton.jsx";
import LargeButton from "../../../components/LargeButton.jsx";

export default function UserSettingsPassword() {
    useEffect(() => {
        document.title = `User Settings Password - fairQ`;
    });

    return <div className="max-w-[1180px] w-full block mb-20">
        <form
            className="w-full text-start sm:w-2/3 lg:w-1/2">


            <FormFieldGroup
                title={"Change password"}
                intro={""}
                style={"w-full text-start sm:w-2/3 lg:w-1/2"}
                align="left">
                <InputField
                    label={"Enter your current password"}
                    is_required={true}
                    type={"password"}
                    placeholder={""}/>
                <InputField
                    label={"Enter your new password"}
                    is_required={true}
                    type={"password"} placeholder={""}
                />
                <InputField
                    label={"Re-enter your new password"}
                    is_required={true}
                    type={"password"} placeholder={""}/>
                <div className="w-full mt-8">
                            <LargeButton
                                label={"Save password"}
                                type={"submit"}
                                variant="primary"
                            />
                        </div>
            </FormFieldGroup>
        </form>
    </div>;
}