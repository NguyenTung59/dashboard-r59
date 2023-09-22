
export const initialAlertState = {
  notifies: [],
  data: [],
  alert: {},
  systems: [
    {
      title: "CPU",
      source: "RDE",
      message: "Warning! Better check your operating system, Temperature CPU high",
      type: "warning",
      status: "new",
      created_at: "2023-08-18 15:25:10"
    }, {
      title: "Core",
      source: "RDE",
      message: "Heads up! This alert needs your attention, Censor service stopped",
      type: "info",
      status: "fixed",
      created_at: "2023-08-17 13:41:10"
    }, {
      title: "AI",
      source: "ADE",
      message: "Oh snap! AI detect attack ddos",
      type: "danger",
      status: "new",
      created_at: "2023-08-18 3:15:32"
    }, {
      title: "Core",
      source: "RDE",
      type: "success",
      message: `Well done! You successfully have fixed rule has sid:122424 .`,
      status: "fixed",  
      created_at: "2023-08-15 14:40:20"
    }
  ]
};

export default function AlertReducer(state = initialAlertState, action){
	switch (action.type) {
    case 'SET_ALERTS':
      return {
        ...state,
        data: [...action.payload.alerts]
      };
    case 'UPDATE_ALERT':
      return {
        ...state,
        alert: action.payload.alert
      };
    case 'SET_NOTIFY':
      return {
        ...state,
        notifies: [...action.payload.notifies]
      };
		default:
			// throw new Error(`Unhandled action type: ${action.type}`);
			return {
        ...state
      }
	}
};
