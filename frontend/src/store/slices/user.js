import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    accessToken: undefined,
    details: null,

};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.accessToken = action.payload;
        },
        logout: (state) => {
            state.accessToken = null;
            state.details = null;
        },
        loadUserDetails: (state, action) => {
            state.details = action.payload;
        },

    },

});

export const {login, logout, loadUserDetails} = userSlice.actions;
export default userSlice.reducer;
