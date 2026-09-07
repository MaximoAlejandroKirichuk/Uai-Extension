import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../../core/entities/user.entity";


interface UserState {
    value: {
        user: User | null;
    }
}

const initialState: UserState = {
    value:{
        user: null,
    }
}

export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: { 
        setUser: (state, {payload}: PayloadAction<User>) => {
           state.value.user = {
            emailUser: payload.emailUser,
            localId: payload.localId,
            token: payload.token,
            readonly: payload.readonly,
            canWrite: payload.canWrite,
            isAnonymous: payload.isAnonymous,
           }
        },
        clearUser: (state) => {
            state.value.user = null;
        },
     },
});

export const { clearUser, setUser  } = userSlice.actions;
