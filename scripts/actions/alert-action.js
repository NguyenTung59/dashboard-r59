const ROOT_URL = 'http://192.168.14.165:8000';
let token = localStorage.getItem('token')
	? JSON.parse(localStorage.getItem('token'))
	: '';

export async function getAlerts(dispatch, payload) {
  const requestOptions = {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
			'C-Api-Key': `QmVhcmVyIGJtTnpYMk52Y21WZk1qQXlNdz09`
    },
    body: JSON.stringify(payload.body)
  };

  try {
    let response = await fetch(`${ROOT_URL}/api/alert/list`, requestOptions);
    let result = await response.json();
    if (response.status > 200) {
      // dispatch({ type: 'GET_ERROR', error: response.statusText });
      return
    }

    if (result.data) {
      var arr = result.data.map((item, i) => {
        item.edit = false
        return item
      })
      dispatch({ type: 'SET_ALERTS', payload: {alerts: arr} });
      return arr;
    }

  } catch (error) {
    console.log(error);
  }
}

export async function updateAlert(dispatch, payload) {
  const requestOptions = {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
			'C-Api-Key': `QmVhcmVyIGJtTnpYMk52Y21WZk1qQXlNdz09`
    },
    body: JSON.stringify(payload.body)
  };

  try {
    let response = await fetch(`${ROOT_URL}/api/alert/update`, requestOptions);
    let result = await response.json();
    if (response.status > 200) {
      // dispatch({ type: 'GET_ERROR', error: response.statusText });
      return
    }

    if (result.data) {
      dispatch({ type: 'UPDATE_ALERT', payload: {alerts: result.data} });
      return result.data;
    }

  } catch (error) {
    console.log(error);
  }
}

export async function getNotifies(dispatch, payload) {
  const requestOptions = {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    let response = await fetch(`${ROOT_URL}/api/alert/notify/list`, requestOptions);
    let result = await response.json();
    if (response.status > 200) {
      dispatch({ type: 'GET_ERROR', error: response.statusText });
      return 
    }

    if (result.data) {
      dispatch({ type: 'SET_NOTIFY', payload: {notifies: result.data} });
      return [];
    }

  } catch (error) {
    console.log(error);
  }
}

export async function updateNotify(dispatch, payload) {
  const requestOptions = {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload.body)
  };

  try {
    let response = await fetch(`${ROOT_URL}/api/alert/notify/update`, requestOptions);
    if (response.status > 200) {
      dispatch({ type: 'GET_ERROR', error: response.statusText });
      return 
    }

  } catch (error) {
    console.log(error);
  }
}