import {BrowserRouter, Route, Routes} from "react-router-dom";

import PublicLayout from "./public/Layout.jsx";
import Home from "./public/Home.jsx";
import SignUp from "./public/SignUp.jsx";
import SignIn from "./public/SignIn.jsx";
import UserLoginLink from "./public/UserLoginLink.jsx";
import EditorLayout from "./editor/Layout.jsx";
import CreateOrganization from "./editor/CreateOrganization.jsx";
import CreateWaitinglist from "./editor/CreateWaitinglist.jsx";
import WaitinglistEditorLayout from "./editor/list/Layout.jsx";
import WaitinglistSettings from "./editor/list/WaitinglistSettings.jsx";
import WaitinglistActivity from "./editor/list/WaitinglistActivity.jsx";
import WaitinglistApplicants from "./editor/list/WaitinglistApplicants.jsx";
import WaitinglistAnalytics from "./editor/list/WaitinglistAnalytics.jsx";
import WaitinglistImportExport from "./editor/list/WaitinglistImportExport.jsx";
import UserSettingsLayout from "./editor/user-settings/Layout.jsx";
import UserSettingsPersonal from "./editor/user-settings/UserSettingsPersonal.jsx";
import OrgSettingsLayout from "./editor/org-settings/Layout.jsx";
import OrgSettingsGeneral from "./editor/org-settings/OrgSettingsGeneral.jsx";
import UserSettingsPassword from "./editor/user-settings/UserSettingsPassword.jsx";
import OrgSettingsTeam from "./editor/org-settings/OrgSettingsTeam.jsx";
import OrgSettingsBranding from "./editor/org-settings/OrgSettingsBranding.jsx";
import ApplicantLayout from "./applicant/Layout.jsx";
import ApplicantWaitinglistStart from "./applicant/ApplicantWaitinglistStart.jsx";
import ApplicantWaitinglistApply from "./applicant/ApplicantWaitinglistApply.jsx";
import ApplicantLoginLink from "./applicant/ApplicantLoginLink.jsx";
import ApplicantDashboardLayout from "./applicant/dashboard/Layout.jsx";
import ApplicantWaitinglistDashboardOverview from "./applicant/dashboard/ApplicantWaitinglistDashboardOverview.jsx";
import ApplicantWaitinglistDashboardActivity from "./applicant/dashboard/ApplicantWaitinglistDashboardActivity.jsx";
import ApplicantWaitinglistDashboardDelete from "./applicant/dashboard/ApplicantWaitinglistDashboardDelete.jsx";
import ApplicantWaitinglistDashboardData from "./applicant/dashboard/ApplicantWaitinglistDashboardData.jsx";
import CompleteProfile from "./public/CompleteProfile.jsx";
import EditorStart from "./editor/EditorStart.jsx";
import Privacy from "./public/Privacy.jsx";
import NotFound from "./public/NotFound.jsx";


const PageRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicLayout/>}>
                    <Route path="/" element={<Home/>}/>
                    <Route path="*" element={<NotFound/>}/>
                    <Route path="/privacy" element={<Privacy/>}/>
                    <Route path="/sign-up" element={<SignUp/>}/>
                    <Route path="/sign-in" element={<SignIn/>}/>
                    <Route path="/complete-profile" element={<CompleteProfile/>}/>
                    <Route path="/login-link" element={<UserLoginLink/>}/>
                </Route>
                <Route element={<EditorLayout/>}>
                    <Route path="/editor" element={<EditorStart/>}/>
                    <Route path="/editor/create-organization" element={<CreateOrganization/>}/>
                    <Route path="/editor/create-list/:orgId" element={<CreateWaitinglist/>}/>
                    <Route element={<WaitinglistEditorLayout/>}>
                        <Route path="/editor/list/:listId/settings" element={<WaitinglistSettings/>}/>
                        <Route path="/editor/list/:listId/activity" element={<WaitinglistActivity/>}/>
                        <Route path="/editor/list/:listId/applicants" element={<WaitinglistApplicants/>}/>
                        <Route path="/editor/list/:listId/analytics" element={<WaitinglistAnalytics/>}/>
                        <Route path="/editor/list/:listId/import-export" element={<WaitinglistImportExport/>}/>
                    </Route>
                    <Route element={<UserSettingsLayout/>}>
                        <Route path="/editor/user/settings/personal" element={<UserSettingsPersonal/>}/>
                        <Route path="/editor/user/settings/password" element={<UserSettingsPassword/>}/>
                    </Route>
                    <Route element={<OrgSettingsLayout/>}>
                        <Route path="/editor/org/:orgId/settings/general" element={<OrgSettingsGeneral/>}/>
                        <Route path="/editor/org/:orgId/settings/team" element={<OrgSettingsTeam/>}/>
                        <Route path="/editor/org/:orgId/settings/branding" element={<OrgSettingsBranding/>}/>
                    </Route>
                </Route>
                <Route element={<ApplicantLayout/>}>
                    <Route path="/list/:listSlug" element={<ApplicantWaitinglistStart/>}/>
                    <Route path="/list/:listSlug/apply" element={<ApplicantWaitinglistApply/>}/>
                    <Route path="/list/:listSlug/login-link" element={<ApplicantLoginLink/>}/>
                    <Route element={<ApplicantDashboardLayout/>}>
                        <Route path="/list/:listSlug/dashboard" element={<ApplicantWaitinglistDashboardOverview/>}/>
                        <Route path="/list/:listSlug/data" element={<ApplicantWaitinglistDashboardData/>}/>
                        <Route path="/list/:listSlug/activity" element={<ApplicantWaitinglistDashboardActivity/>}/>
                        <Route path="/list/:listSlug/delete" element={<ApplicantWaitinglistDashboardDelete/>}/>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default PageRoutes;
