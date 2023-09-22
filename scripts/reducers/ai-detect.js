
export const initialAIState = {
  ai_task: {
    id_agent_ai: 0,
    interval: 1000,
    timer: 30,
    enabled: false,
    check_task: false,
  },
  deep_analyst:{
    cpu:"4 core",
    ram:"31.13GB",
    total_disk:"454.88GB",
    log_disk:"1.7G",
    disk_usage:"85.23%",
    traffic:"100 Mb/s",
    cpu_brand:"12th Gen Intel(R) Core(TM) i5-12400",
    hostname:"ubuntusrv",
    uuid:"d759a1a8-a929-0000-0000-000000000000",
    pid:4082974,
    name:"deep-analyst",
    status: 1,
    live_host:"6/6",
    cpu_usage: "1.18%",
    memory_usage: "9.90%",
    log_disk_usage: "",
    traffic_volume: "4 Mb/s",
    vitual_machine_cluster_usage:1,
    failed_vitual_machine_cluster:1,
    start_time:"Jun14",
    runtime: 122706,
    command: ""
  },
  config: {
    agent_ip: "192.168.14.151",
    hostname: "ubuntusrv",
    name: "ai-detect",
    // type: "services",
    cmd: "",
    cmd_stop: "",
    dir: "",
    bin: "",
    script: "start.sh"
  }
};

export default function AIReducer(state = initialAIState, action){
	switch (action.type) {
    case 'SET_CONFIG_DEEP_ANALYST':
      return {
        ...state,
        config: action.payload.config
      };
    case 'GET_DEEP_ANALYST':
			return {
				...state,
				deep_analyst: action.payload.deep_ai
			};
    // service da
    case 'GET_CURRENT_AGENT_AI-DETECT':
      return {
        ...state,
        ai_task: {
          ...state.ai_task,
          id_agent_ai: action.payload.id_current_agent
        }
      };
    case 'SET_AI-DETECT_CHECK_TASK':
      return {
        ...state,
        ai_task: {
          ...state.ai_task,
          check_task: action.payload.check_task
        }
      };
    case 'SET_AI-DETECT_TIMER':
      return {
        ...state,
        ai_task: {
          ...state.ai_task,
          timer: action.payload.timer
        }
      };
    case 'SET_AI-DETECT_TIME_INTERVAL':
      return {
        ...state,
        ai_task: {
          ...state.ai_task,
          interval: action.payload.interval
        }
      };
    case 'SET_AI-DETECT_ENABLED':
      return {
        ...state,
        ai_task: {
          ...state.ai_task,
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
