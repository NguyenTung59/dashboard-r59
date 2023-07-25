
let user = localStorage.getItem('currentUser')
	? JSON.parse(localStorage.getItem('currentUser')).user
	: '';
let token = localStorage.getItem('currentUser')
	? JSON.parse(localStorage.getItem('currentUser')).access_token
	: '';

export const initialState = {
	user: '' || user,
	token: '' || token,
  service: "censor",
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
  id_agent_cgate: 0,
  id_agent_da: 0,
  id_agent: 0,
  interval: 2000,
  timer: 30,
  enabled: false,
  check_task: false,
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
  censor_task: {
    id_agent_censor: 0,
    interval: 1000,
    timer: 30,
    enabled: false,
    check_task: false,
  },
  exporter_task: {
    id_agent_exporter: 0,
    interval: 2000,
    timer: 30,
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
      runtime: 4493170
    },
  da:
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
      runtime: 122706
    },
  process:
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
      name: "redis",
      status: 1,
      cpu_usage: "26.25%",
      memory_usage: "0.50%",
      log_disk_usage: "",
      traffic_volume:"0 Mb/s",
      start_time: "May23",
      runtime: 4492724
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
  console.log(action)
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
		case 'GET_CENSOR':
			return {
				...state,
        censor: action.payload.censor
			};
		case 'GET_CGATE':
			return {
				...state,
				cgate: action.payload.cgate
			};
		case 'GET_DEEP_ANALYST':
			return {
				...state,
				da: action.payload.deep_ai
			};
    case 'GET_PROCESS':
      return {
        ...state,
        process: action.payload.process
      };
    case 'GET_CURRENT_AGENT_CGATE':
      return {
        ...state,
        id_agent_cgate: action.payload.id_current_agent
      };
    case 'GET_CURRENT_AGENT_DA':
      return {
        ...state,
        id_agent_da: action.payload.id_current_agent
      };
    case 'GET_CURRENT_AGENT':
      return {
        ...state,
        id_agent: action.payload.id_current_agent
      };
    case 'GET_LIST_EXPORTERS':
      return {
        ...state,
        exporters: [...action.payload]
      };
    case 'GET_CURRENT_EXPORTER':
      return {
        ...state,
        current_exporter: action.payload.current_exporter
      };
    case 'SET_TIME_INTERVAL':
      return {
        ...state,
        interval: action.payload.interval
      };
    case 'SET_TIMER':
      return {
        ...state,
        timer: action.payload.timer
      };
    case 'SET_CHECK_TASK':
      return {
        ...state,
        check_task: action.payload.check_task
      };
    case 'SET_ENABLED':
      return {
        ...state,
        enabled: action.payload.enabled
      };
    // service censor
    case 'GET_CURRENT_AGENT_CENSOR':
      return {
        ...state,
				// id_agent_censor: action.payload.id_current_agent,
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

		default:
			// throw new Error(`Unhandled action type: ${action.type}`);
			return {
        ...state
      }
	}
};
