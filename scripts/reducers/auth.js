import { data } from "jquery";

let user = localStorage.getItem('currentUser')
	? JSON.parse(localStorage.getItem('currentUser')).user
	: '';
let token = localStorage.getItem('currentUser')
	? JSON.parse(localStorage.getItem('currentUser')).access_token
	: '';


export const initialState = {
	user: '' || user,
	token: '' || token,
	loading: false,
	errorMessage: null,
	isAuth: token != "" ? true : false,
};

export default function AuthReducer(state = initialState, action){

	switch (action.type) {
		case 'REQUEST_LOGIN':
			return {
				...state,
				loading: true,
			};
		case 'LOGIN_SUCCESS':
			return {
				...state,
				user: action.payload.user,
				token: action.payload.access_token,
				loading: false,
				isAuth: true
			};
		case 'LOGOUT':
			return {
				...state,
				user: '',
				token: '',
				isAuth: false
			};

		case 'LOGIN_ERROR':
			return {
				...state,
				loading: false,
				errorMessage: action.error,
				isAuth: false
			};

		default:
			// throw new Error(`Unhandled action type: ${action.type}`);
			return {...state}
	}
};
