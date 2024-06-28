import {atom} from 'recoil';

type AuthStateType = {
    loggedIn: boolean;
    username : string;
}

const initialAuthState : AuthStateType = {
    loggedIn : false,
    username : ""
}

export const authState = atom<AuthStateType>({
    key:'authState',
    default: initialAuthState
})