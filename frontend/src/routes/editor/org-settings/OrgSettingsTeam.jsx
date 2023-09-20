import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {api} from "../../../axios/index.js";
import Loading from "../../../components/Loading.jsx";
import {useDispatch, useSelector} from "react-redux";
import TeamMember from "../../../components/TeamMember";
import InvitedTeamMember from "../../../components/InvitedTeamMember";
import {
    addTeamMember,
    loadTeam,
    updateTeamMember,
} from "../../../store/slices/editor.js";
import InputField from "../../../components/InputField.jsx";
import SelectionField from "../../../components/SelectionField.jsx";
import MediumButton from "../../../components/MediumButton.jsx";
import FormFieldGroup from "../../../components/FormFieldGroup.jsx";
import Toast from "../../../components/Toast.jsx";

export default function OrgSettingsTeam() {
    const {orgId} = useParams();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.user.accessToken);
    const user = useSelector((state) => state.user.details);
    const roleOptions = [
        {id: 1, label: "Viewer"},
        {id: 2, label: "Administrator"},
        {id: 3, label: "Owner"},
    ];
    const [loading, setLoading] = useState(true);
    const team = useSelector((state) => state.editor.team);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState(1);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success"); // success by default

    const fetchMembers = async () => {
        try {
            const res = await api.get(`org/${orgId}/members/`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            dispatch(loadTeam(res.data));
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        document.title = `Organization #${orgId} Manage Team - fairQ`;
    }, []);

    useEffect(() => {
        fetchMembers();
    }, [orgId]);

    const patchMemberRole = async (userId, newRole) => {
        try {
            const res = await api.patch(
                `org/${orgId}/members/${userId}/`,
                {
                    role: newRole,
                },
                {
                    headers: {Authorization: `Bearer ${token}`},
                }
            );
            dispatch(updateTeamMember(res.data));
            setToastMessage(`Team member updated!`);
            setToastType("success");
            setToastVisible(true);
        } catch (error) {
            setToastMessage("We could not save your changes.");
            setToastType("error");
            setToastVisible(true);
        }
    };

    const removeMember = async (userId) => {
        try {
            const res = await api.delete(`org/${orgId}/members/${userId}/`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            fetchMembers();
            setToastMessage("Team member removed!");
            setToastType("success");
            setToastVisible(true);
        } catch (error) {
            setToastMessage("Team member could not be deleted.");
            setToastType("error");
            setToastVisible(true);
        }
    };

    const handleInviteMember = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(
                `org/${orgId}/members/`,
                {
                    email: inviteEmail,
                    role: inviteRole,
                },
                {
                    headers: {Authorization: `Bearer ${token}`},
                }
            );
            dispatch(addTeamMember(res.data));
            setInviteEmail("")
            setInviteRole(1)
            setToastMessage("New team member successfully invited!")
            setToastType("success")
            setToastVisible(true)
        } catch (error) {
            setToastMessage("Email could not be sent.");
            setToastType("error");
            setToastVisible(true);
        }
    };

    if (!orgId || !team || !user) {
        return <Loading/>;
    } else {
        return (
            <div className="w-full md:w-10/12 lg:w-8/12 flex flex-col gap-5 mr-auto pb-20">
                <FormFieldGroup
                    title="Team members"
                    intro="Your current team members"
                    align="start"
                >
                    <>
                        {team
                            .filter((m) => m.status == 2)
                            .map((membership, index) => {
                                return (
                                    <TeamMember
                                        membership={membership}
                                        roleOptions={roleOptions}
                                        key={index}
                                        isYou={user.email === membership.member.user.email}
                                        onUpdateRole={patchMemberRole}
                                        onRemoveMember={removeMember}
                                    />
                                );
                            })}
                    </>
                </FormFieldGroup>

                <FormFieldGroup
                    title="Invite team members"
                    intro="Enter an email address to invite another team member"
                    align="start"
                >
                    <form
                        className="container flex flex-col md:flex-row w-full h-fit md:h-20 mt-5 items-center md:justify-between gap-2"
                        onSubmit={(e) => handleInviteMember(e)}
                    >
                        <div className="w-full flex-grow md:w-3/5">
                            <InputField
                                id="email"
                                type="email"
                                label="Email"
                                is_required={true}
                                placeholder="email@company.com"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-auto flex flex-col items-center md:flex-row gap-2">
                            <SelectionField
                                options={[{1: "Viewer"}, {2: "Administrator"}]}
                                label="Role"
                                is_required={true}
                                value={inviteRole}
                                onChange={(e) => setInviteRole(e.target.value)}
                            />
                            <button className="btn btn-outline btn-md btn-primary rounded rounded-lg w-full md:w-fit"
                                    type={"submit"}>Invite
                            </button>
                        </div>
                    </form>
                </FormFieldGroup>

                {team.filter((m) => m.status === 1).length > 0 && (

                    <FormFieldGroup
                        title="Invited"
                        intro="Team members already invited to join"
                        align="start"
                    >

                        {team
                            .filter((m) => m.status === 1)
                            .map((membership, index) => {
                                return (
                                    <InvitedTeamMember
                                        membership={membership}
                                        key={index}
                                        onCancelInvite={removeMember}
                                    />
                                );
                            })}

                    </FormFieldGroup>

                )}


                {toastVisible && (
                    <Toast type={toastType} onClose={() => setToastVisible(false)}>
                        {toastMessage}
                    </Toast>
                )}
            </div>
        );
    }
}
