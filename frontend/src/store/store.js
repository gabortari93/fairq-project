import {configureStore} from "@reduxjs/toolkit";

import userReducer from "./slices/user";
import editorReducer from "./slices/editor"
import applicantReducer from "./slices/applicant"


const store = configureStore({
    reducer: {
        user: userReducer,
        editor: editorReducer,
        applicant: applicantReducer,
    },
});

export default store;
