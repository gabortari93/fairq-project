import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    waitingList: null, // Here we'll store the current waitinglist
    application: null, // Here we'll store the current application
    customBranding: undefined, // Here we store the custom Branding data
    reconfirmation: null, // Here we store pending reconfirmations
};

const applicantSlice = createSlice({
    name: "applicant",
    initialState,
    reducers: {
        loadWaitingList: (state, action) => {
            state.waitingList = action.payload;
        },
        loadApplication: (state, action) => {
            state.application = action.payload;
        },
        clearApplicant: (state, action) => {
            state.application = null
        },
        clearWaitinglist: (state, action) => {
            state.waitingList = null
            state.customBranding = null
        },
        setCustomBranding: (state, action) => {
            state.customBranding = action.payload;
        },
        loadReconfirmation: (state, action) => {
            state.reconfirmation = action.payload;
        },
        clearReconfirmation: (state, action) => {
            state.reconfirmation = null
        },
    },

});

export const {
    loadWaitingList,
    loadApplication,
    clearApplicant,
    clearWaitinglist,
    setCustomBranding,
    loadReconfirmation,
    clearReconfirmation,
} = applicantSlice.actions;
export default applicantSlice.reducer;
