
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
  map: [[1,28075],[2,22075]]
};

export default function MetricsReducer(state = initialMetricsState, action){
	switch (action.type) {
		case 'GET_Metrics':
			return {
				...state,
        data: action.payload.data
			};
    
		default:
			// throw new Error(`Unhandled action type: ${action.type}`);
			return {
        ...state
      }
	}
};
