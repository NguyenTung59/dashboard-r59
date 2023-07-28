
export const initialCensorState = {
  censor_task: {
    id_agent_censor: 0,
    interval: 1000,
    timer: 10,
    enabled: false,
    check_task: false,
  },
  censor:
    {
      cpu:"4 core",
      ram:"31.13GB",
      total_disk:"454.88GB",
      log_disk:"1.7G",
      disk_usage:"85.23%",
      traffic:"100 Mb/s",
      cpu_brand:"12th Gen Intel(R) Core(TM) i5-12400",
      hostname:"ubuntusrv",
      uuid:"d759a1a8-a929-0000-0000-000000000000",
      pid: 1275228,
      name: "censor",
      status: 1,
      used_rule_version: "[1.00].[14.07.2023][002]",
      waiting_update_rule_version: "[1.00].[14.07.2023][002]",
      cpu_usage: "26.25%",
      memory_usage: "0.50%",
      log_disk_usage: "",
      traffic_volume:"0 Mb/s",
      rule_applied_amount: 36861,
      fail_rule_amount: 0,
      censor_version: "v1.0.0.1",
      start_time: "May23",
      runtime: 4492724
    }
};

export default function CensorReducer(state = initialCensorState, action){
	switch (action.type) {
		case 'GET_CENSOR':
			return {
				...state,
        censor: action.payload.censor
			};
    // service censor
    case 'GET_CURRENT_AGENT_CENSOR':
      return {
        ...state,
        censor_task: {
          ...state.censor_task,
          id_agent_censor: action.payload.id_current_agent
        }
      };
    case 'SET_CENSOR_CHECK_TASK':
      return {
        ...state,
        censor_task: {
          ...state.censor_task,
          check_task: action.payload.check_task
        }
      };
    case 'SET_CENSOR_TIMER':
      return {
        ...state,
        censor_task: {
          ...state.censor_task,
          timer: action.payload.timer
        }
      };
    case 'SET_CENSOR_TIME_INTERVAL':
      return {
        ...state,
        censor_task: {
          ...state.censor_task,
          interval: action.payload.interval
        }
      };
    case 'SET_CENSOR_ENABLED':
      return {
        ...state,
        censor_task: {
          ...state.censor_task,
          enabled: action.payload.enabled
        }
      };
		default:
			// throw new Error(`Unhandled action type: ${action.type}`);
			return {
        ...state
      }
	}
};
