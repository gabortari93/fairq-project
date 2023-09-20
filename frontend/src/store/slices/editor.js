import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    configuration: null, // Here we'll store the current configuration when editing a list
    organization: null,
    team: undefined, // here we will store the memberships of the team members
    fields: [], // Here we'll store all the fields of a waiting list
    configurationOptions: null, // Here we'll store all dropdown options
    applications: [], // Here we'll store an array of all applications
    applicationsCount: 0, // here we'll store the number of applications
    organisationId: 0,
    memberships: undefined, // here we store all memberships of a user, including organisation details and a list of waiting lists
};

const editorSlice = createSlice({
    name: "editor",
    initialState,
    reducers: {
        loadApplications: (state, action) => {
            state.applications = action.payload.results;
            state.applicationsCount = action.payload.count;
        },
        loadConfiguration: (state, action) => {
            state.configuration = action.payload;
            state.fields = action.payload.fields;
        },
        loadMemberships: (state, action) => {
            state.memberships = action.payload;
        },
        loadTeam: (state, action) => {
            state.team = action.payload;
        },
        updateTeamMember: (state, action) => {
            for (let i = 0; i < state.team.length; i++) {
                if (state.team[i].member.id === action.payload.member.id) {
                    state.team[i] = action.payload
                }
            }
        },
        addTeamMember: (state, action) => {
            let updated = false
            for (let i = 0; i < state.team.length; i++) {
                if (state.team[i].member.id === action.payload.member.id) {
                    state.team[i] = action.payload
                    updated=true
                }
            }
            if(!updated) {
                state.team.push(action.payload)
            }
        },
        loadOrganization: (state, action) => {
            state.organization = action.payload;
        },
        updateField: (state, action) => {
            for (let i = 0; i < state.fields.length; i++) {
                if (state.fields[i].id === action.payload.id) {
                    state.fields[i] = action.payload
                }
            }
        },
        loadOptions: (state, action) => {
            state.configurationOptions = action.payload;
        },
        setOrganisationId: (state, action) => {
            state.organisationId = action.payload;
        },
        clearEditor: (state, action) => {
            state.configuration = null
            state.organization = null
            state.fields = []
            state.configurationOptions = null
            state.applications = []
            state.applicationsCount = 0
            state.organisationId = 0
            state.memberships = undefined
        },

    },

});

export const {
    loadApplications,
    loadMemberships,
    loadConfiguration,
    loadOrganization,
    loadOptions,
    updateField,
    loadTeam,
    updateTeamMember,
    addTeamMember,
    setOrganisationId,
    clearEditor,
} = editorSlice.actions;
export default editorSlice.reducer;
