import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import SideNavigation from "../../../components/SideNavigation.jsx";
import FormFieldGroup from "../../../components/FormFieldGroup.jsx";
import InputField from "../../../components/InputField.jsx";
import TextareaField from "../../../components/TextareaField.jsx";
import CheckboxItem from "../../../components/CheckboxItem.jsx";
import SelectionField from "../../../components/SelectionField.jsx";
import MediumButton from "../../../components/MediumButton.jsx";
import {useDispatch, useSelector} from "react-redux";
import {api} from "../../../axios/index.js";
import {loadConfiguration, loadOptions, updateField} from "../../../store/slices/editor.js";
import Loading from "../../../components/Loading.jsx";
import Toast from "../../../components/Toast.jsx";


export default function WaitinglistSettings() {
    const token = useSelector((state) => state.user.accessToken);
    const editor = useSelector((state) => state.editor.configuration);
    const fields = useSelector((state) => state.editor.fields);
    const options = useSelector((state) => state.editor.configurationOptions);
    const dispatch = useDispatch();
    const {listId} = useParams();
    const [deleteError, setDeleteError] = useState("");
    const [nameError, setNameError] = useState("");
    const [slugError, setSlugError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [loading, setLoading] = useState(true);
    const [editorState, setEditorState] = useState(editor);
    const navigate = useNavigate();
    const [deleteConfirmation, setDeleteConfirmation] = useState("")
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");  // success by default

    const menuItems = [
        {target: "general", name: "General", className: ""},
        {target: "participant-registration", name: "Applicant registration", className: ""},
        {target: "identity-verification", name: "Identity verification", className: ""},
        {target: "interest-confirmation", name: "Interest reconfirmation", className: ""},
        {target: "selection", name: "Selection", className: ""},
        {target: "participant-view", name: "Applicant view", className: ""},
        {target: "notifications", name: "Notifications", className: ""},
        {target: "delete-list", name: "Delete list", className: "text-red-500"},
    ];

    useEffect(() => {
        setEditorState(editor)
        if (editor) {
            document.title = `${editor.name} Settings - fairQ`;
        }
    }, [editor])

    useEffect(() => {
        fetchOptions();
    }, [listId]);

    const handleInputChange = (e) => {
        setEditorState({...editorState, [e.target.id]: e.target.value});
    };

    const fetchOptions = async () => {
        try {
            const response = await api.get(`/list/${listId}/options/`, {
                headers: {Authorization: "Bearer " + token},
            });
            const data = response.data;
            dispatch(loadOptions(data));
            setLoading(false)

        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };

    const handleInputData = async (e) => {
        e.preventDefault();
        const listData = {[e.target.id]: editorState[e.target.id]};

        if (e.target.id === "name" && editorState[e.target.id] === "")
            setNameError("Waiting list name can't be empty.");
        else if (e.target.id === "slug" && editorState[e.target.id] === "")
            setSlugError("The slug can't be empty.");
        else if (e.target.id === "description" && editorState[e.target.id] === "")
            setDescriptionError("Please enter description. This field can't be empty.");
        else {

            if (editor[e.target.id] === editorState[e.target.id]) {
                // do not call the API if field was not changed
                return
            }

            try {
                const res = await api.patch(`/list/${listId}/`, listData, {
                    headers: {Authorization: "Bearer " + token},
                });
                dispatch(loadConfiguration(res.data));
                setToastMessage("Changes saved!");
                setToastType("success");
                setToastVisible(true);
                setNameError("");
                setDescriptionError("");
                setSlugError("");
            } catch (e) {
                if (e.response.data.slug) {
                    setSlugError(e.response.data.slug)
                } else {
                    setToastMessage("We could not save your changes");
                    setToastType("error");
                    setToastVisible(true);
                }
            }
        }
    };

    const handleChecked = async (e, fieldId, currentValue) => {
        e.preventDefault();
        try {
            const res = await api.patch(`/list/${listId}/fields/${fieldId}/`, {"is_displayed": !currentValue}, {
                headers: {Authorization: "Bearer " + token},
            });
            dispatch(updateField(res.data));
            setToastMessage("Changes saved!");
            setToastType("success");
            setToastVisible(true);
        } catch (e) {
            setToastMessage("We could not save your changes");
            setToastType("error");
            setToastVisible(true);
        }
    };

    const handleListCheckbox = async (e) => {
        const data = {}
        data[e.target.id] = e.target.checked
        try {
            const res = await api.patch(`/list/${listId}/`, data, {
                headers: {Authorization: "Bearer " + token},
            });
            dispatch(loadConfiguration(res.data));
            setToastMessage("Changes saved!");
            setToastType("success");
            setToastVisible(true);

        } catch (e) {
            setToastMessage("We could not save your changes");
            setToastType("error");
            setToastVisible(true);
        }

    };

    const handleSelect = async (e) => {
        const data = {}
        data[e.target.id] = e.target.value
        try {
            const res = await api.patch(`/list/${listId}/`, data, {
                headers: {Authorization: "Bearer " + token},
            });
            dispatch(loadConfiguration(res.data));
            setToastMessage("Changes saved!");
            setToastType("success");
            setToastVisible(true);

        } catch (e) {
            setToastMessage("We could not save your changes");
            setToastType("error");
            setToastVisible(true);
        }

    };

    const handleDeleteList = async (e) => {
        e.preventDefault();

        if (editor.slug === deleteConfirmation) {
            try {
                const res = await api.delete(`/list/${listId}/`, {
                    headers: {Authorization: "Bearer " + token},
                });

                navigate("/editor/create-list");
            } catch (e) {
                setToastMessage("We could not delete this list");
                setToastType("error");
                setToastVisible(true);
            }
        } else {
            setDeleteError("Slug didn't match")
        }
    };


    if (loading || !editor || !options || !fields) return <Loading/>
    else return (
        <div className="flex flex-col md:flex-row md:gap-2 h-full">
            <div className={"overflow-visible md:w-4/12 lg:w-3/12 sticky top-0"}>
                <div className="hidden md:block w-full h-full pt-12">
                    <SideNavigation menuItems={menuItems} type="list"/>
                </div>
                <div className="block md:hidden w-full h-full pt-8 pb-4">
                    <SideNavigation menuItems={menuItems} type="dropdown"/>
                </div>
            </div>
            <div className="w-full md:w-8/12 lg:w-6/12 flex flex-col gap-5 mr-auto pb-20">
                <form
                    onChange={(e) => handleInputChange(e)}
                >
                    <div className="container block mx-auto w-full" id="general">
                        <FormFieldGroup title={"General"}
                                        intro={"Set up your waiting list's basic profile with a name, URL, and description."}
                                        align={"start"}>
                            <InputField id={"name"}
                                        label={"Name"}
                                        placeholder="e.g. My waiting list"
                                        sublabel="this will be shown everywhere"
                                        value={editorState.name}
                                        is_required={true}
                                        onChange={(e) => handleInputChange(e)}
                                        onBlur={(e) => handleInputData(e)}
                                        errorMessage={nameError}
                                        size="lg"
                            />
                            <InputField id={"slug"}
                                        label={`Slug`}
                                        sublabel="the address where your waiting list can be accessed"
                                        placeholder="e.g. my-waiting-list"
                                        value={editorState.slug}
                                        is_required={true}
                                        onChange={(e) => handleInputChange(e)}
                                        onBlur={(e) => handleInputData(e)}
                                        errorMessage={slugError}
                                        size="lg"
                                        linkURL={`/list/${editor.slug}`}
                                        linkTarget="_blank"
                            />
                            <TextareaField id={"description"}
                                           label={"Description"}
                                           sublabel="displayed below the name"
                                           value={editorState.description}
                                           is_required={true}
                                           placeholder={"e.g. Due to high demand, we ask people to join a waiting list."}
                                           onChange={(e) => handleInputChange(e)}
                                           onBlur={(e) => handleInputData(e)}
                                           size="lg"
                                           errorMessage={descriptionError}
                            />
                            <InputField id={"usual_waiting_time"}
                                        label={"Usual waiting time"}
                                        sublabel="shown to set the expectation for waiting time"
                                        value={editorState.usual_waiting_time}
                                        placeholder="e.g. usually a year"
                                        onChange={(e) => handleInputChange(e)}
                                        onBlur={(e) => handleInputData(e)}
                                        size="lg"
                            />
                        </FormFieldGroup>
                    </div>
                    <div className="container block mx-auto" id="participant-registration">
                        <FormFieldGroup align={"start"}
                                        title={"Applicant registration"}
                                        intro={"Specify the details needed from applicants."}>
                            <span className="self-start">Which details should be displayed?</span>
                            <CheckboxItem style={"self-start"} disabled={true} checked={true}
                                          label={"Email address (cannot be deselected)"}/>
                            <CheckboxItem style={"self-start"} disabled={true} checked={true}
                                          label={"First and last name (cannot be deselected)"}/>
                            {fields.map((field) => {
                                return (<CheckboxItem key={field.id} style={"self-start"}
                                                      id={field.id}
                                                      checked={field.is_displayed}
                                                      label={field.label}
                                                      onClick={(e) => handleChecked(e, field.id, field.is_displayed)}/>)
                            })}
                        </FormFieldGroup>
                    </div>
                    <div className="container block mx-auto" id="identity-verification">
                        <FormFieldGroup align={"start"}
                                        title={"Identity verification"}
                                        intro={"Determine what information and methods will be used to confirm applicants' identities."}>
                                <span className="self-start mt-10">How should we verify applicants&apos; identities?</span>

                            <CheckboxItem style={"self-start"} disabled={true} checked={true}
                                          label={"Double opt-in via link (this cannot be deselected)"}/>

                            <CheckboxItem id={"identity_verification_required"}
                                          checked={editor.identity_verification_required}
                                          style={"self-start"}
                                          label={"By uploading a legal document (ID, passport) before entering the waiting list. The fairQ team will verify the document for you."}
                                          onClick={(e) => handleListCheckbox(e)}/>

                        </FormFieldGroup>
                    </div>
                    <div className="container mx-auto" id="interest-confirmation">
                        <FormFieldGroup align={"start"}
                                        title={"Interest reconfirmation"}
                                        intro={"Set up the frequency for registration expiration and applicant reconfirmation to maintain an active, engaged list. Applicants will be asked occasionally to restate their interest by clicking a link in an email."}>
                            <SelectionField options={options.reconfirmationCycles}
                                            id="reconfirmation_cycle"
                                            label={"Cycle"}
                                            sublabel="how frequently we'll ask applicants to restate their interest"
                                            size="lg"
                                            value={editor.reconfirmation_cycle}
                                            onChange={(e) => handleSelect(e)}/>
                            <SelectionField options={options.reconfirmationReminders}
                                            id="reconfirmation_first_reminder"
                                            label={"1st reminder"}
                                            sublabel="when we'll send the first reminder"
                                            size="lg"
                                            value={editor.reconfirmation_first_reminder}
                                            onChange={(e) => handleSelect(e)}/>
                            <SelectionField options={options.reconfirmationReminders}
                                            id="reconfirmation_second_reminder"
                                            label={"2nd reminder"}
                                            sublabel="when we'll send the second reminder"
                                            size="lg"
                                            value={editor.reconfirmation_second_reminder}
                                            onChange={(e) => handleSelect(e)}/>
                            <TextareaField id={"reconfirmation_message"}
                                           value={editorState.reconfirmation_message}
                                           label={"Custom message"}
                                           sublabel="add your own message to the reconfirmation reminders"
                                           is_required={true}
                                           size="lg"
                                           placeholder={"e.g. In order to make sure our waiting list stays up to date, we periodically ask all applicants to reaffirm their interest. Please let us know if you are no longer interested into a garden plot."}
                                           onChange={(e) => handleInputChange(e)}
                                           onBlur={(e) => handleInputData(e)}/>
                            <CheckboxItem id={"reconfirmation_remove"}
                                          checked={editor.reconfirmation_remove}
                                          style={"self-start"}
                                          label={"Applicants will be removed if they don't reconfirm their interest by the deadline"}
                                          onClick={(e) => handleListCheckbox(e)}/>
                        </FormFieldGroup>
                    </div>
                    <div className="container mx-auto" id="selection">
                        <FormFieldGroup align={"start"}
                                        title={"Selection"}
                                        intro={"Decide on how to move applications from the waiting list to their chosen status. This ensures a fair and transparent progression for everyone."}>
                            <SelectionField options={options.numSelectable}
                                            id={"num_selectable"}
                                            value={editor.num_selectable}
                                            label={"Selection range"}
                                            sublabel="choose from how many applications for the next selection"
                                            onChange={(e) => handleSelect(e)}/>
                            <SelectionField options={options.prioritizationOptions}
                                            id={"prioritization_sorting"}
                                            value={editor.prioritization_sorting}
                                            label={"Selection process"}
                                            disabled={true}
                                            sublabel={"how the selection process will be carried out"}
                                            onChange={(e) => handleSelect(e)}/>
                        </FormFieldGroup>
                    </div>
                    <div className="container mx-auto" id="participant-view">
                        <FormFieldGroup align={"start"}
                                        title={"Applicant view"}
                                        intro={"Personalize the visual and content aspects of your waiting list from an applicant's point of view."}>
                            <span
                                className="self-start mt-10">What should applicants see on their personal page?</span>
                            <CheckboxItem id={"personal_data"}
                                          style={"self-start"}
                                          label={"Their personal data"}
                                          checked={true}
                                          disabled={true}/>
                            <CheckboxItem id={"Status_application"}
                                          style={"self-start"}
                                          label={"Status of their application"} checked={true}
                                          disabled={true}/>
                            <CheckboxItem id={"see_absolute_position"}
                                          style={"self-start"}
                                          checked={editor.see_absolute_position}
                                          label={"Current position on the waiting list (absolute)"}
                                          onClick={(e) => handleListCheckbox(e)}/>
                            <CheckboxItem id={"see_relative_position"}
                                          style={"self-start"}
                                          checked={editor.see_relative_position}
                                          label={"Current position on the waiting list (relative in %)"}
                                          onClick={(e) => handleListCheckbox(e)}
                            />
                            <CheckboxItem id={"see_calculated_waiting_time"}
                                          style={"self-start"}
                                          checked={editor.see_calculated_waiting_time}
                                          label={"Estimated waiting time"}
                                          onClick={(e) => handleListCheckbox(e)}/>

                        </FormFieldGroup>
                    </div>
                    <div className="container mx-auto" id="notifications">
                        <FormFieldGroup align={"start"}
                                        title={"Notifications"}
                                        intro={"Set up automatic notifications for both administrators and applicants for regular updates."}>
                            <span className="self-start">What notifications should applicants receive?</span>
                            <CheckboxItem id={"registering_for_waitinglist"}
                                          style={"self-start"}
                                          disabled={true}
                                          checked={true}
                                          label={"When registering for the waiting list (mandatory)"}/>
                            <CheckboxItem id={"selected_on_waitinglist"}
                                          style={"self-start"}
                                          disabled={true}
                                          checked={true}
                                          label={"When being selected on the waiting list (mandatory)"}/>
                            <CheckboxItem id={"alerts"}
                                          style={"self-start"}
                                          disabled={true}
                                          checked={true}
                                          label={"Expiry and reconfirmation alerts and reminders (mandatory)"}/>
                            <CheckboxItem id={"notify_applicant_monthly"}
                                          checked={editor.notify_applicant_monthly}
                                          onClick={(e) => handleListCheckbox(e)}
                                          style={"self-start"}
                                          label={"Monthly Update"}/>

                            <span className="self-start mt-10">Which notifications should administrators receive?</span>
                            <CheckboxItem style={"self-start"}
                                          disabled={true}
                                          checked={true}
                                          label={"When new applicants register (recommended)"}/>
                            <CheckboxItem id={"notify_org_no_reconfirm"}
                                          checked={editor.notify_org_no_reconfirm}
                                          onClick={(e) => handleListCheckbox(e)}
                                          style={"self-start"}
                                          label={"When an applicant never reconfirmed"}/>
                            <CheckboxItem id={"notify_org_weekly"}
                                          checked={editor.notify_org_weekly}
                                          onClick={(e) => handleListCheckbox(e)}
                                          style={"self-start"}
                                          label={"Weekly digest"}/>
                        </FormFieldGroup>
                    </div>
                </form>
                <form onSubmit={(e) => handleDeleteList(e)}>
                    <div className="container mx-auto h-auto" id="delete-list">
                        <FormFieldGroup align={"start"}
                                        title={"Delete waiting list"}
                                        intro={"You can safely erase your waiting list and all its applications when you're ready for a fresh start. Deleting your waiting list also deletes all its applications. This action cannot be undone."}>
                            <div className={"w-full flex flex-col sm:flex-row justify-between items-center gap-x-5"}>
                                <InputField
                                    style="w-1/2"
                                    placeholder={editor.slug}
                                    label="Enter the slug of your waiting list to confirm"
                                    value={deleteConfirmation}
                                    size="md"
                                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                                    is_required={true}
                                    errorMessage={deleteError}
                                />
                                <MediumButton label="Delete forever" variant="error"
                                              type="submit" disabled={!(deleteConfirmation === editor.slug)}/>
                            </div>
                        </FormFieldGroup>
                    </div>
                </form>
            </div>
            {toastVisible && (
                <Toast
                    type={toastType}
                    onClose={() => setToastVisible(false)}
                >
                    {toastMessage}
                </Toast>
            )}
        </div>
    )
}