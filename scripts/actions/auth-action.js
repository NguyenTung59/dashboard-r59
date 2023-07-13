const ROOT_URL = 'http://192.168.14.165:8000/api';
let token = localStorage.getItem('token')
	? JSON.parse(localStorage.getItem('token'))
	: '';

export async function loginUser(dispatch, loginPayload) {
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(loginPayload),
	};

	try {
		dispatch({ type: 'REQUEST_LOGIN' });
		let response = await fetch(`${ROOT_URL}/auth/login`, requestOptions);
		let data = await response.json();

		if (data.user) {
			dispatch({ type: 'LOGIN_SUCCESS', payload: data });
			localStorage.setItem('currentUser', JSON.stringify(data));
			localStorage.setItem('token', JSON.stringify(data.access_token));
			return data;
		}

		if (data.status == "fail") {
			dispatch({ type: 'LOGIN_ERROR', error: data.message });
			console.log(data.message);
			return;
		}
	} catch (error) {
		dispatch({ type: 'LOGIN_ERROR', error: error });
		console.log(error);
	}
}

export async function logout(dispatch) {
	dispatch({ type: 'LOGOUT' });
	localStorage.removeItem('currentUser');
	localStorage.removeItem('token');
}

export async function getUser(dispatch, payload) {
	const requestOptions = {
		method: 'GET',
		headers: { 
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${payload.token}`
		}
	};

	try {
		let response = await fetch(`${ROOT_URL}/users/me`, requestOptions);
		let result = await response.json();

		if (response.status > 200) {
			dispatch({ type: 'LOGIN_ERROR', error: response.statusText });
			return 
		}

		if (result.data.user) {
			dispatch({ type: 'GET_ME', payload: result.data.user });
			return result.data.user;
		}

	} catch (error) {
		console.log(error);
	}
}