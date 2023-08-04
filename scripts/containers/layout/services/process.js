import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import {Row, Col, NavDropdown, MenuItem} from 'react-bootstrap'
import { GetAgents, GetProcessCore, GetSystemInfo } from '../../../actions/core-action';
import {SecondsToDhms} from '../utilities/utility'
import { checkPercentWarning, checkTrafficWarning } from '../utilities/check-warning';
// import HeaderSearch from '../../../components/header-search-bar';
import HeaderModule from '../../../common/module-header'
import FormSchedulerRefresh from '../forms/form-scheduler-refresh';
import ListAgents from '../forms/agents/form-list-agents';

// const ROOT_URL = 'http://192.168.14.165:8000';
const PORT = 8000

class Process extends Component {
  constructor(props) {
		super(props);
    this.state = {
      name: this.props.cores.process_name,
      service: this.props.history.location.pathname.split("/")[2].toUpperCase(),
      system: this.props.cores.system,
      current_agent: this.props.cores.agents[this.props.cores.process_task.id_agent_process],
      init_refresh: null,
      current_process : this.props.cores.current_process,
      result : this.props.cores.process,
      scheduler_task: [],
		}
    this.onChangeSearch = this.onChangeSearch.bind(this)
    this.onClickSearch = this.onClickSearch.bind(this)
  }

  async componentDidMount() {
    try {
      const resSys = await GetSystemInfo(this.props.dispatch, {url: `http://${this.state.current_agent.ip}:${PORT}`})
      if (resSys) {
        this.setState({
          system: resSys
      })}

      await GetAgents(this.props.dispatch)
      await GetProcessCore(this.props.dispatch, {name: this.state.name, url: `http://${this.state.current_agent.ip}:${PORT}`});

      let refresh_init = setInterval(async () => {
        if (this.props.cores.process_task.enabled) {
          if (!this.props.cores.process_task.check_task) {
            if (this.props.cores.process_task.timer == 0 ) {
              let refresh_process = setInterval(async () => {
              const res = await GetProcessCore(this.props.dispatch, {name: this.state.name, url: `http://${this.state.current_agent.ip}:${PORT}`});
              this.props.dispatch({type: `SET_${this.state.service}_CHECK_TASK`, payload: {check_task: true}})
              }, this.props.cores.process_task.interval)

              this.setState({
                scheduler_task: [
                  ...this.state.scheduler_task,
                  {
                    id: refresh_process,
                    name: "refresh_process"
                  }
                ],
              })
            }
          }
        } else {
          if (this.state.scheduler_task.length > 0){
            this.state.scheduler_task.map((task, i) => {
              clearInterval(task.id)
            })
            this.setState({scheduler_task: []})
          }
          this.props.dispatch({type: `SET_${this.state.service}_CHECK_TASK`, payload: {check_task: false}})
        }

      }, 1000);

      this.setState({
        init_refresh: refresh_init
      })

    } catch(e) {
      console.log(e);
    }
  }

  componentWillUnmount() {
    if (this.state.scheduler_task.length > 0){
      this.state.scheduler_task.map((task, i) => {
        clearInterval(task.id)
      })
    }
    clearInterval(this.state.init_refresh)
    this.props.dispatch({type: `SET_${this.state.service}_CHECK_TASK`, payload: {check_task: false}})
  } 

  onSwitchProcess(pid, ev){
    this.props.cores.process.map(async (e, i) => {
      if (e.pid == pid) {
        this.setState({
          current_process: e
        })
        this.props.dispatch({ type: 'GET_CURRENT_PROCESS', payload: {current_process: e} });
      }
    })
  }

  onChangeSearch(ev) {
    const {name, value} = ev.target 
    this.setState({
      [name]: value
    })
  }

  async onClickSearch() {
    // console.log("129 ", this.state.name)
    // console.log(this.state.name, this.state.current_agent)

    this.props.dispatch({ type: 'GET_CURRENT_NAME', payload: {name: this.state.name} });
    const result = await GetProcessCore(this.props.dispatch, {name: this.props.cores.process_name, url: `http://${this.state.current_agent.ip}:${PORT}`});
    // console.log("result ", result)
    this.setState({
      result: [...result]
    })
  }

  turnOffService() {
    console.log("turn off ", this.state.name)
  }
  
  resetService() {
    console.log("reset ", this.state.name)
  }

  configService() {
    console.log("config ", this.state.name)
  }

  render() {
    const {cores} = this.props
    const {system} = this.state
    const current_process = cores.current_process
    
    return (
      <Fragment>
				<HeaderModule text="Processes"/>
				<Row>
					<Col sm={7}>
            <div className="card">
              <div className="card-header ch-alt">
                <h2>
                  <a>{current_process.pid} {current_process.command ? current_process.command.charAt(0).toUpperCase() + current_process.command.slice(1) : ""}</a> - Information
                </h2>
              </div>
              <div className="card-body card-padding">
                <Row className="pmo-contact">
                  <Col sm={4}>
                    <ul>
                      <li className="ng-binding">
                        <i className="zmdi zmdi-laptop"></i> CPU </li>
                      <li className="ng-binding">
                        <i className="zmdi zmdi-card-sd"></i> RAM </li>
                      <li className="ng-binding">
                        <i className="zmdi zmdi-dns"></i> Disk </li>
                      <li className="ng-binding">
                        <i className="zmdi zmdi-floppy"></i> Log Disk</li>
                      <li className="ng-binding">
                        <i className="zmdi zmdi-router"></i> Traffic </li>
                      <li className="ng-binding">
                        <i className="zmdi zmdi-devices"></i> UUID </li>
                      <li className="ng-binding">
                        <i className="zmdi zmdi-desktop-mac"></i> Host Name </li>
                      <li className="ng-binding">{current_process.status > 0 ? <i className="zmdi zmdi-check-circle"></i> : <i className="zmdi zmdi-close-circle"></i>} Status </li>
                      <li className="ng-binding"><i className="zmdi zmdi-time"></i> Start time </li>
                      <li className="ng-binding"><i className="zmdi zmdi-timer"></i> Runtime: {SecondsToDhms(current_process.runtime)}</li>
                    </ul>
                  </Col>
                  <Col sm={8}>
                    <ul>
                      <li className="ng-binding"> {system.cpu}</li>
                      <li className="ng-binding"> {system.ram}</li>
                      <li className="ng-binding"> {system.total_disk}</li>
                      <li className="ng-binding"> {system.log_disk}</li>
                      <li className="ng-binding"> {system.traffic}</li>
                      <li className="ng-binding"> {system.uuid != "" ? system.uuid : "-"}</li>
                      <li className="ng-binding"> {system.hostname != "" ? system.hostname : "localhost"}</li>
                      <li className="ng-binding"> {current_process.status > 0 ? "Running" : "Stopped"} </li>
                      <li className="ng-binding"> {current_process.start_time ? current_process.start_time : "-"} </li>
                      <li className="ng-binding">                     
                        <Col sm={4}> <a onClick={this.turnOffService.bind(this)}><i className="zmdi zmdi-power"></i></a></Col>
                        <Col sm={4}> <a onClick={this.resetService.bind(this)}><i className="zmdi zmdi-refresh"></i></a></Col>
                        <Col sm={4}> <a onClick={this.configService.bind(this)}><i className="zmdi zmdi-wrench"></i></a></Col> 
                      </li>
                    </ul>
                  </Col>
                </Row>
              </div>
            </div>
					</Col>
          <Col sm={5}>
            {/* list agents */}
            <ListAgents 
              service={{
                name: this.state.service,
                id_agent: this.props.cores.process_task.id_agent_process,
              }}
              dispatch={this.props.dispatch}
              cores={cores}
            />

            {/* scheduler  */}
            <FormSchedulerRefresh 
              location={this.props.location} 
              service={{
                interval: this.props.cores.process_task.interval, 
                enabled: this.props.cores.process_task.enabled, 
                check_task: this.props.cores.process_task.check_task, 
                timer: this.props.cores.process_task.timer, 
              }}/>
          </Col>
				</Row>
        {/* list process */}
        <Row>
          <Col sm={12}>
            <div className="card">
              <div className="card-header ch-alt">
                <Row>
                <Col sm={8}>
                  <h2>
                    Search Process
                  </h2>
                </Col>
                <Col sm={4} className="search-process">
                  <input type="search" placeholder="Search..." name="name" onChange={this.onChangeSearch}/>
                  <button className="btn btn-search" tabIndex="0" onClick={this.onClickSearch}>
                    <i className="zmdi zmdi-search" tabIndex="0"></i>
                  </button>
                </Col>
                </Row>
              </div>
              <div className="card-body card-padding">
                <div style={{maxHeight: "100px", overflow: "auto"}}>
                {this.state.result.length > 0 ? this.state.result.sort((a, b) => a.command - b.command).map((e, i) => (
                    <div key={i} onClick={this.onSwitchProcess.bind(this, e.pid)}>
                        <ul className="list-unstyled module-action">
                          <li>
                            <a>{e.pid} {e.command}</a>
                          </li>
                        </ul>
                    </div>)
                  ): <div>No rows</div>
                }
                </div>
              </div>
            </div>
          </Col>
        </Row>
        {/* Performance */}
        <div className="module-head">
          <h2>Performance</h2>
        </div>
        <Row>
          <Col sm={3}>
            <div className="card">
              <div className={checkPercentWarning(current_process.cpu_usage)}>
                <h5>
                  CPU usage
                </h5>
              </div>            
              <div className="card-body card-padding">
                {current_process.cpu_usage ? current_process.cpu_usage : "0.00%"}
              </div>
            </div>
          </Col>
          <Col sm={3}>
            <div className="card">
              <div className={checkPercentWarning(current_process.memory_usage)}>
                <h5>
                  RAM usage
                </h5>
              </div>            
              <div className="card-body card-padding">
                {current_process.memory_usage ? current_process.memory_usage : "0.00%"}
              </div>
            </div>
          </Col>
          <Col sm={3}>
            <div className="card">
              <div className={checkPercentWarning(current_process.disk_usage)}>
                <h5>
                  Disk usage
                </h5>
              </div>            
              <div className="card-body card-padding">
                {current_process.disk_usage ? current_process.disk_usage : "0.00%"}
              </div>
            </div>
          </Col>
          <Col sm={3}>
            <div className="card">
              <div className={checkTrafficWarning(current_process.traffic_volume)}>
                <h5>
                  Traffic 
                </h5>
              </div>            
              <div className="card-body card-padding">
                {current_process.traffic_volume ? current_process.traffic_volume : "0 kb/s"}
              </div>
            </div>
          </Col>
        </Row>
			</Fragment>
    )
  }
}

const mapStateToProps = (state) => {
	return {
		auth: state.auth,
    cores: state.cores,
    cores: state.cores,
	};
}

export default connect(mapStateToProps)(Process);