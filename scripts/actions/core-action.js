import {initialState} from "../reducers/core"

const ROOT_URL = 'http://192.168.14.165:8000';
let token = localStorage.getItem('token')
	? JSON.parse(localStorage.getItem('token'))
	: '';

export async function GetSystemInfo(dispatch, payload) { 
  const requestOptions = {
		method: 'GET',
		headers: { 
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
			'C-Api-Key': `QmVhcmVyIGJtTnpYMk52Y21WZk1qQXlNdz09`
		}
	};

  try {
		let response = await fetch(`${payload.url}/api/agent/system/info`, requestOptions);
		let result = await response.json();
		if (result.code > 200) return

    if (result.data) {
      dispatch({ type: 'GET_SYSTEM_INFO', payload: {system: JSON.parse(result.data)} });
      return JSON.parse(result.data)
    }
  } catch (error) {
		console.log(error);
	}
}

export async function GetMetrics(dispatch, payload) { 
  const requestOptions = {
		method: 'GET',
		headers: { 
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
			'C-Api-Key': `QmVhcmVyIGJtTnpYMk52Y21WZk1qQXlNdz09`
		}
	};

  try {
		let response = await fetch(`${payload.url}/api/agent/process/core/metrics`, requestOptions);
		let result = await response.json();
		if (result.code > 200) return

    if (result.data) {
      dispatch({ type: 'GET_METRICS', payload: {data: JSON.parse(result.data)} });
      return JSON.parse(result.data)
    }
  } catch (error) {
		console.log(error);
	}
}

export async function GetAgents(dispatch) { 
  const requestOptions = {
		method: 'GET',
		headers: { 
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
			'C-Api-Key': `QmVhcmVyIGJtTnpYMk52Y21WZk1qQXlNdz09`
		}
	};

  try {
		let response = await fetch(`${ROOT_URL}/api/agent/list`, requestOptions);
		let result = await response.json();
		if (result.code > 200) return

    if (result.data) {
      dispatch({ type: 'GET_AGENTS', payload: {agents: JSON.parse(result.data)} });
      return JSON.parse(result.data)
    }
  } catch (error) {
		console.log(error);
	}
}

export async function GetProcessCore(dispatch, payload) {
	const requestOptions = {
		method: 'GET',
		headers: { 
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
			'C-Api-Key': `QmVhcmVyIGJtTnpYMk52Y21WZk1qQXlNdz09`
		}
	};

	try {
		let response = await fetch(`${payload.url}/api/agent/process/core?name=${payload.name}`, requestOptions);
		let result = await response.json();
    switch (payload.name) {
      case 'censor':
        if (result.data) {
          dispatch({ type: 'GET_CENSOR', payload: {censor: JSON.parse(result.data)} });
          return JSON.parse(result.data)
        }
      case 'cgate':
        if (result.data) {
          dispatch({ type: 'GET_CGATE', payload: {cgate: JSON.parse(result.data)} });
          return JSON.parse(result.data)
        }
      case 'deep-analyst':
        if (result.data) {
          dispatch({ type: 'GET_DEEP_ANALYST', payload: {deep_ai: JSON.parse(result.data)} });
          return JSON.parse(result.data)
        }
			default:
				dispatch({ type: 'GET_LIST_PROCESS', payload: {process: JSON.parse(result.data)} });
				return JSON.parse(result.data)
    }
	} catch (error) {
		console.log(error);
	}
}

export async function GetProcessExporters(dispatch, payload) {
	const requestOptions = {
		method: 'GET',
		headers: { 
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
			'C-Api-Key': `QmVhcmVyIGJtTnpYMk52Y21WZk1qQXlNdz09`
		}
	};

	try {
		let response = await fetch(`${payload.url}/api/agent/process/exporter/list`, requestOptions);
		let result = await response.json();

		if (result) {
			if (result.data) {
				const data = result.data.map((r, i) => JSON.parse(r))
				dispatch({ type: 'GET_LIST_EXPORTERS', payload: data });
				return data
			}
		}
		
		dispatch({ type: 'GET_LIST_EXPORTERS', payload: initialState.exporters });
		return initialState.exporters
    
	} catch (error) {
		console.log(error);
	}
}

export async function StartProcessCore(dispatch, payload) {
	const requestOptions = {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
			'C-Api-Key': `QmVhcmVyIGJtTnpYMk52Y21WZk1qQXlNdz09` 
		},
		body: JSON.stringify(payload.body),
	};

	try {
		let response = await fetch(`${payload.url}/api/agent/start/process/core`, requestOptions);
		// console.log("response ", response)
		if (response) {
			if (response.status > 200) {return}
			let data = await response.json();
			return data
		}

	} catch (error) {
		console.log(error);
	}
}

export async function StopProcessCore(dispatch, payload) {
	// console.log(payload.body)
	const requestOptions = {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
			'C-Api-Key': `QmVhcmVyIGJtTnpYMk52Y21WZk1qQXlNdz09` 
		},
		body: JSON.stringify(payload.body),
	};

	try {
		let response = await fetch(`${payload.url}/api/agent/stop/process/core`, requestOptions);
		if (response) {
			if (response.status > 200) {return}

			let data = await response.json();
			return data
		}

	} catch (error) {
		console.log(error);
	}
}