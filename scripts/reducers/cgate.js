
export const initialCgateState = {
  cgate_task: {
    id_agent_cgate: 0,
    interval: 1000,
    timer: 30,
    enabled: false,
    check_task: false,
  },
  cgate:
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
      pid:1272476,
      name:"cgate",
      status:1,
      cpu_usage:"50.25%",
      memory_usage:"0.00%",
      log_disk_usage:"",
      traffic_volume:"0 Mb/s",
      start_time:"May23",
      runtime: 4493170,
      command: "/opt/cerberus/cgate/cgate"
    },
    config: {
      name: "cgate",
      // type: "services",
      cmd: "/opt/cerberus/cgate/cgate",
      dir: "opt/cerberus/cgate",
      bin: "",
      script: "start.sh"
    }
};

export default function CgateReducer(state = initialCgateState, action){
	switch (action.type) {
    case 'SET_CONFIG_CGATE':
      return {
        ...state,
        config: action.payload.config
      };
		case 'GET_CGATE':
			return {
				...state,
        cgate: action.payload.cgate
			};
    // service cgate
    case 'GET_CURRENT_AGENT_CGATE':
      return {
        ...state,
        cgate_task: {
          ...state.cgate_task,
          id_agent_cgate: action.payload.id_current_agent
        }
      };
    case 'SET_CGATE_CHECK_TASK':
      return {
        ...state,
        cgate_task: {
          ...state.cgate_task,
          check_task: action.payload.check_task
        }
      };
    case 'SET_CGATE_TIMER':
      return {
        ...state,
        cgate_task: {
          ...state.cgate_task,
          timer: action.payload.timer
        }
      };
    case 'SET_CGATE_TIME_INTERVAL':
      return {
        ...state,
        cgate_task: {
          ...state.cgate_task,
          interval: action.payload.interval
        }
      };
    case 'SET_CGATE_ENABLED':
      return {
        ...state,
        cgate_task: {
          ...state.cgate_task,
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
