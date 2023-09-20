import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import FormFieldGroup from "../../../components/FormFieldGroup.jsx";
import SelectionField from "../../../components/SelectionField.jsx";
import FilePreview from "../../../components/FilePreview.jsx";
import {useSelector, useDispatch} from "react-redux"
import Toast from "../../../components/Toast.jsx";
import Loading from "../../../components/Loading.jsx";
import {api} from "../../../axios/index.js";
import {loadOrganization} from "../../../store/slices/editor.js";
import CheckboxItem from "../../../components/CheckboxItem.jsx";
import CustomColourPicker from "../../../components/CustomColorPicker.jsx";


export default function OrgSettingsBranding() {
    const {orgId} = useParams();
    const token = useSelector((state) => state.user.accessToken);
    const organization = useSelector((state) => state.editor.organization);
    const [organizationState, setOrganizationState] = useState(organization);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const dispatch = useDispatch();


    const options = [{
        "key": 0,
        "value": "FairQ"
    },
        {
            "key": 1,
            "value": "Custom"
        }];

    const fontsArray = [
        {"key": "Arial", "value": "Arial"},
        {"key": "Helvetica", "value": "Helvetica"},
        {"key": "Verdana", "value": "Verdana"},
        {"key": "Trebuchet MS", "value": "Trebuchet MS"},
        {"key": "Geneva", "value": "Geneva"},
        {"key": "Roboto", "value": "Roboto"},
        {"key": "Times New Roman", "value": "Times New Roman"},
        {"key": "Georgia", "value": "Georgia"},
        {"key": "Palatino Linotype", "value": "Palatino Linotype"},
        {"key": "Courier New", "value": "Courier New"},
    ];
    const handleInputChange = (e) => {
        setOrganizationState({...organizationState, [e.target.id]: e.target.value});
    };

    useEffect(() => {
        setOrganizationState(organization)
        if (organization) {
            document.title = `${organization.name} Settings - fairQ`;
            setLoading(false);
        }

    }, [organization]);


    const handleChecked = async (e) => {

        const data = {}
        data[e.target.id] = e.target.checked

        try {
            const res = await api.patch(`/org/${orgId}/`, data, {
                headers: {Authorization: "Bearer " + token},
            });

            dispatch(loadOrganization(res.data));
            setLoading(false)
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
    };

    const handleSelect = async (e) => {
        const data = {}
        data[e.target.id] = e.target.value
        try {
            const res = await api.patch(`/org/${orgId}/`, data, {
                headers: {Authorization: "Bearer " + token},
            });
            dispatch(loadOrganization(res.data));
            setToastMessage("Changes saved!");
            setToastType("success");
            setToastVisible(true);

        } catch (e) {
            setToastMessage("We could not save your changes");
            setToastType("error");
            setToastVisible(true);
        }

    };

    const handleColorChange = async (field, color) => {
        const data = {}
        data[field] = color
        try {
            const res = await api.patch(`/org/${orgId}/`, data, {
                headers: {Authorization: "Bearer " + token},
            });

            dispatch(loadOrganization(res.data));
            setLoading(false)
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

    };

    const handleUploadFile = async (field, file) => {
        try {
            setLoading(true)

            const formData = new FormData();
            formData.append(field, file);

            const res = await api.patch(`/org/${orgId}/`, formData, {
                headers: {
                    Authorization: "Bearer " + token,
                    'Content-Type': 'multipart/form-data'
                }
            });

            dispatch(loadOrganization(res.data));
            setLoading(false)
            setToastMessage("File uploaded!");
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

    const handleDeleteFile = async (field) => {
        try {
            setLoading(true)

            const res = await api.patch(`/org/${orgId}/`, {[field]: null}, {
                headers: {
                    Authorization: "Bearer " + token,
                }
            });

            dispatch(loadOrganization(res.data));
            setLoading(false)
            setToastMessage("File deleted!");
            setToastType("success");
            setToastVisible(true);
            setError({})
        } catch (e) {
            setError({})
            setToastMessage("Technical error. We could not delete your file.");
            setToastType("error");
            setToastVisible(true);
        }
    }


    if (loading || !organization) return <Loading/>
    else return (<div className="w-full md:w-10/12 lg:w-8/12 flex flex-col gap-5 mr-auto pb-20">
        <form className="w-full md:w-1/2 lg:w-1/2 flex flex-col m-0 p-0 " onChange={handleInputChange}>
            <FormFieldGroup align={"start"} title={"Branding"}
                            intro={"Customize the visual appearance of your waiting lists. You can either use fairQ's default branding, or define your own colors, fonts, and logo."}>
                <CheckboxItem options={options}
                              id="custom_branding"
                              label={"Enable custom branding"}
                              style={"self-start"}
                              checked={organization.custom_branding}
                              onChange={(e) => {
                                  handleChecked(e)
                              }}
                />
            </FormFieldGroup>
            <div className={!organization.custom_branding ? "opacity-40" : ""}>
                <FormFieldGroup
                    title={"Logo and banner"}
                    intro=""
                    align={"left"}
                >
                    <FilePreview
                        id={"logo"}
                        label={"Logo"}
                        sublabel={"a GIF, PNG, or JPEG file"}
                        errorMessage={""}
                        url={organization.logo}
                        onFileChange={handleUploadFile}
                        onDelete={handleDeleteFile}

                    />
                    <FilePreview
                        id={"banner"}
                        label={"Banner"}
                        sublabel={"a GIF, PNG, or JPEG file"}
                        errorMessage={""}
                        url={organization.banner}
                        onFileChange={handleUploadFile}
                        onDelete={handleDeleteFile}

                    />
                </FormFieldGroup>
                <FormFieldGroup
                    title={"Custom fonts and colors"}
                    align={"left"}
                    intro={"Customize the visual appearance of your waiting list"}>

                    <SelectionField options={fontsArray}
                                    id="font"
                                    label={"Font"}
                                    size="md"
                                    value={organization.font}
                                    onChange={(e) => {
                                        handleSelect(e)
                                    }}
                    />
                    <CustomColourPicker
                        id="background_color"
                        value={organizationState.background_color}
                        onColorChange={handleColorChange}
                        label={"Background color"}
                        sublabel={"select a light color"}
                    />
                    <CustomColourPicker
                        id="font_color"
                        value={organization.font_color}
                        onColorChange={handleColorChange}
                        label={"Font Colour"}
                        sublabel={"select a dark color"}
                    />
                    <CustomColourPicker
                        id="accent_color"
                        value={organization.accent_color}
                        onColorChange={handleColorChange}
                        label={"Accent Colour"}
                        sublabel={"a vibrant color for buttons etc."}
                    />
                </FormFieldGroup>
            </div>
        </form>
        {toastVisible && (
            <Toast type={toastType} onClose={() => setToastVisible(false)}>
                {toastMessage}
            </Toast>
        )}
    </div>);
}