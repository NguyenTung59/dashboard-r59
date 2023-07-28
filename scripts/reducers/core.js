
let user = localStorage.getItem('currentUser')
	? JSON.parse(localStorage.getItem('currentUser')).user
	: '';
let token = localStorage.getItem('currentUser')
	? JSON.parse(localStorage.getItem('currentUser')).access_token
	: '';

export const initialState = {
	user: '' || user,
	token: '' || token,
  agents: [
    {
      name: "tungnm-MS-7D82",
      endpoint_guid: "_192.168.14.165_agent",
      ip: "192.168.14.165",
      port: "19999",
      instance_address: ""
    },
    {
      name: "ubuntusrv",
      endpoint_guid: "_192.168.14.151_agent",
      ip: "192.168.14.151",
      port: "19999",
      instance_address: ""
    }
  ],
  timer_default: 10,
  system: {
    cpu:"4 core",
    ram:"31.13GB",
    total_disk:"454.88GB",
    log_disk:"1.7G",
    disk_usage:"85.23%",
    traffic:"100 Mb/s",
    cpu_brand:"12th Gen Intel(R) Core(TM) i5-12400",
    hostname:"ubuntusrv",
    uuid:"d759a1a8-a929-0000-0000-000000000000",
  },
  exporter_task: {
    id_agent_exporter: 0,
    interval: 2000,
    timer: 30,
    enabled: false,
    check_task: false,
  },
  process_task: {
    id_agent_process: 0,
    interval: 2000,
    timer: 10,
    enabled: false,
    check_task: false,
  },
  process:[],
  current_process: {
    command: "redis-server",
    cpu_usage: "0.10%",
    log_disk_usage: "",
    memory_usage: "0.00%",
    name: "redis",
    pid: 3451,
    runtime: 40,
    start_time: "09:04",
    status: 1,
  },
    exporters: [],
    current_exporter: {
      pid: 0,
      guid: "",
      port: 0,
      name: "",
      cmd: "",
      run_cmd: "",
      path: "",
      status: "stopped"
    }
};

export default function CoreReducer(state = initialState, action){
	switch (action.type) {
    case 'SET_NAME_SERVICE':
      return {
        ...state,
        service: action.payload.services
      };
    case 'GET_AGENTS':
			return {
				...state,
				agents: [...action.payload.agents]
			};
		case 'GET_SYSTEM_INFO':
			return {
				...state,
				system: action.payload.system
			};
    case 'GET_LIST_PROCESS':
      return {
        ...state,
        process: [...action.payload.process]
      };
    case 'GET_LIST_EXPORTERS':
      return {
        ...state,
        exporters: [...action.payload]
      };
    case 'GET_CURRENT_EXPORTER':
      return {
        ...state,
        current_exporter: action.payload
      };

    // manager process 
    case 'GET_CURRENT_AGENT_EXPORTER':
      return {
        ...state,
        // id_agent_censor: action.payload.id_current_agent,
        exporter_task: {
          ...state.exporter_task,
          id_agent_exporter: action.payload.id_current_agent
        }
      };
    case 'SET_EXPORTER_CHECK_TASK':
      return {
        ...state,
        exporter_task: {
          ...state.exporter_task,
          check_task: action.payload.check_task
        }
      };
    case 'SET_EXPORTER_TIMER':
      return {
        ...state,
        exporter_task: {
          ...state.exporter_task,
          timer: action.payload.timer
        }
      };
    case 'SET_EXPORTER_TIME_INTERVAL':
      return {
        ...state,
        exporter_task: {
          ...state.exporter_task,
          interval: action.payload.interval
        }
      };
    case 'SET_EXPORTER_ENABLED':
      return {
        ...state,
        exporter_task: {
          ...state.exporter_task,
          enabled: action.payload.enabled
        }
      };

      // process
    case 'GET_CURRENT_AGENT_PROCESS':
      return {
        ...state,
        // id_agent_censor: action.payload.id_current_agent,
        process_task: {
          ...state.process_task,
          id_agent_exporter: action.payload.id_current_agent
        }
      };
    case 'GET_CURRENT_PROCESS':
      return {
        ...state,
        current_process: action.payload.current_process
      };
    case 'SET_PROCESS_CHECK_TASK':
      return {
        ...state,
        process_task: {
          ...state.process_task,
          check_task: action.payload.check_task
        }
      };
    case 'SET_PROCESS_TIMER':
      return {
        ...state,
        process_task: {
          ...state.process_task,
          timer: action.payload.timer
        }
      };
    case 'SET_PROCESS_TIME_INTERVAL':
      return {
        ...state,
        process_task: {
          ...state.process_task,
          interval: action.payload.interval
        }
      };
    case 'SET_PROCESS_ENABLED':
      return {
        ...state,
        process_task: {
          ...state.process_task,
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
