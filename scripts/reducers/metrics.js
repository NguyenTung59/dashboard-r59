let data_bw = window.sessionStorage.getItem("DATA_BW") ? JSON.parse(window.sessionStorage.getItem("DATA_BW")) : []
let data_pkts = window.sessionStorage.getItem("DATA_PKTS") ? JSON.parse(window.sessionStorage.getItem("DATA_PKTS")) : []
let data_time = window.sessionStorage.getItem("DATA_TIME") ? JSON.parse(window.sessionStorage.getItem("DATA_TIME")) : []

export const initialMetricsState = {
  metrics_task: {
    id_agent_metrics: 0,
    interval: 1000,
    timer: 10,
    enabled: false,
    check_task: false,
  },
  data: {
    timestamp: "2023-07-28T17:06:57.560167791+07:00",
    src_ip: "192.168.14.151",
    in_speed: 28075848,
    in_pkts_speed: 3957
  },
  data_bw: data_bw,
  data_pkts: data_pkts,
  data_time: data_time,
};

export default function MetricsReducer(state = initialMetricsState, action){
	switch (action.type) {
		case 'GET_METRICS':
			return {
				...state,
        data: action.payload.data
			};

    case 'SET_DATA_TIME':
      window.sessionStorage.setItem("DATA_TIME", JSON.stringify(action.payload.data))

      return {
        ...state,
        data_time: [...action.payload.data]
      };

    case 'SET_DATA_BW':
      window.sessionStorage.setItem("DATA_BW", JSON.stringify(action.payload.data))

      return {
        ...state,
        data_bw: [...action.payload.data]
      };

    case 'SET_DATA_PKTS':
      window.sessionStorage.setItem("DATA_PKTS", JSON.stringify(action.payload.data))

      return {
        ...state,
        data_pkts: [...action.payload.data]
      };
    
		default:
			// throw new Error(`Unhandled action type: ${action.type}`);
			return {
        ...state
      }
	}
};
