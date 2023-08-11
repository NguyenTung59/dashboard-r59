import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import {Row, Col} from 'react-bootstrap'
import { GetProcessCore, GetSystemInfo, GetAgents } from '../../../actions/core-action';
import {SecondsToDhms} from '../utilities/utility'
import { checkPercentWarning, checkTrafficWarning } from '../utilities/check-warning';
import ListAgents from '../forms/agents/form-list-agents';
import FormSchedulerRefresh from '../forms/form-scheduler-refresh';
import HeaderModule from '../../../common/module-header'
import ControlProcess from '../../../components/control'

const ROOT_URL = 'http://192.168.14.165:8000';
const PORT = 8000

class AIDectect extends Component {
  constructor(props) {
		super(props);
    this.state = {
      name: "deep-analyst",
      service: this.props.history.location.pathname.split("/")[2].toUpperCase(),
      system: this.props.cores.system,
			// ais: this.props.cores.ai,
      current_agent: this.props.cores.agents[this.props.ais.ai_task.id_agent_ai],
      init_refresh: null,
      scheduler_task: [],
		}
  }

  async componentDidMount() {
    try {
      // const resSys = await GetSystemInfo(this.props.dispatch, {url: `http://${this.state.current_agent.ip}:${PORT}`})
      // if (resSys) {
      //   this.setState({
      //     ...this.state,
      //     system: resSys
      // })}

      await GetAgents(this.props.dispatch)
      await GetProcessCore(this.props.dispatch, {name: this.state.name, url: `http://${this.state.current_agent.ip}:${PORT}`});

      let refresh_init = setInterval(async () => {
        if (this.props.ais.ai_task.enabled) {
          if (!this.props.ais.ai_task.check_task) {
            if (this.props.ais.ai_task.timer == 0 ) {
              let refresh_ai = setInterval(async () => {
                var current_agent = this.props.cores.agents[this.props.ais.ai_task.id_agent_ai]

                await GetProcessCore(this.props.dispatch, {name: this.state.name, url: `http://${current_agent.ip}:${PORT}`});
                this.props.dispatch({type: `SET_${this.state.service}_CHECK_TASK`, payload: {check_task: true}})
              }, this.props.ais.ai_task.interval)

              this.setState({
                scheduler_task: [
                  ...this.state.scheduler_task,
                  {
                    id: refresh_ai,
                    name: "refresh_ai"
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

  turnOffService() {
    console.log("turn off deep-analyst ")
  }
  
  resetService() {
    console.log("reset deep-analyst ")
  }

  configService() {
    console.log("config deep-analyst")
  }

  
  render() {
    const {cores, ais} = this.props
    const current_da = ais.deep_analyst

    return (
      <Fragment>
				<HeaderModule text="AI Detect"/>
				<Row>
					<Col sm={7}>
              <div className="card">
              <div className="card-header ch-alt">
                <h2>
                  {current_da.name.charAt(0).toUpperCase() + current_da.name.slice(1)} Information
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
                      <li className="ng-binding">{current_da.status > 0 ? <i className="zmdi zmdi-check-circle"></i> : <i className="zmdi zmdi-close-circle"></i>} Status </li>
                      <li className="ng-binding"><i className="zmdi zmdi-time"></i> Start time </li>
                      <li className="ng-binding"><i className="zmdi zmdi-timer"></i> Runtime: {SecondsToDhms(current_da.runtime)}</li>
                    </ul>
                  </Col>
                  <Col sm={8}>
                    <ul>
                      <li className="ng-binding"> {current_da.cpu}</li>
                      <li className="ng-binding"> {current_da.ram}</li>
                      <li className="ng-binding"> {current_da.total_disk}</li>
                      <li className="ng-binding"> {current_da.log_disk}</li>
                      <li className="ng-binding"> {current_da.traffic}</li>
                      <li className="ng-binding"> {current_da.uuid != "" ? current_da.uuid : "-"}</li>
                      <li className="ng-binding"> {current_da.hostname != "" ? current_da.hostname : "localhost"}</li>
                      <li className="ng-binding"> {current_da.status > 0 ? "Running" : "Stopped"} </li>
                      <li className="ng-binding"> {current_da && current_da.start_time ? current_da.start_time : "-"} </li>
                      <li className="ng-binding">                     
                        {/* <Col sm={4}> <a onClick={this.turnOffService.bind(this)}><i className="zmdi zmdi-power"></i></a></Col>
                        <Col sm={4}> <a onClick={this.resetService.bind(this)}><i className="zmdi zmdi-refresh"></i></a></Col>
                        <Col sm={4}> <a onClick={this.configService.bind(this)}><i className="zmdi zmdi-wrench"></i></a></Col>  */}
                        <ControlProcess 
                          service={{
                            name: this.state.name,
                            status: current_da.status,
                            pid: current_da.pid
                          }}
                          config={{
                            name: this.state.name,
                            cmd: this.props.ais.config.cmd,
                            dir: this.props.ais.config.dir,
                            bin: this.props.ais.config.bin,
                            script: this.props.ais.config.script
                          }}
                          current_process={current_da}
                          dispatch={this.props.dispatch}
                          current_agent={this.props.cores.agents[this.props.ais.ai_task.id_agent_ai]}
                        />
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
                name: this.state.name,
                id_agent: this.props.ais.ai_task.id_agent_ai,
              }}
              dispatch={this.props.dispatch}
              cores={cores}
            />
            {/* scheduler  */}
            <FormSchedulerRefresh 
              location={this.props.location} 
              service={{
                interval: this.props.ais.ai_task.interval, 
                enabled: this.props.ais.ai_task.enabled, 
                check_task: this.props.ais.ai_task.check_task, 
                timer: this.props.ais.ai_task.timer, 
              }}/>
          </Col>
				</Row>
        {/* Performance */}
        <div className="module-head"> 
          <h2>Performance</h2>
        </div>
        <Row>
          <Col sm={3}>
            <div className="card">
              <div className={checkPercentWarning(current_da.cpu_usage)}>
                <h5>
                  CPU usage
                </h5>
              </div>            
              <div className="card-body card-padding">
                {current_da.cpu_usage ? current_da.cpu_usage : "0.00%"}
              </div>
            </div>
          </Col>
          <Col sm={3}>
            <div className="card">
              <div className={checkPercentWarning(current_da.memory_usage)}>
                <h5>
                  RAM usage
                </h5>
              </div>            
              <div className="card-body card-padding">
                {current_da.memory_usage ? current_da.memory_usage : "0.00%"}
              </div>
            </div>
          </Col>
          <Col sm={3}>
            <div className="card">
              <div className={checkPercentWarning(current_da.disk_usage)}>
                <h5>
                  Disk usage
                </h5>
              </div>            
              <div className="card-body card-padding">
                {current_da.disk_usage ? current_da.disk_usage : "0.00%"}
              </div>
            </div>
          </Col>
          <Col sm={3}>
            <div className="card">
              <div className={checkTrafficWarning(current_da.traffic_volume)}>
                <h5>
                  Traffic 
                </h5>
              </div>            
              <div className="card-body card-padding">
                {current_da.traffic_volume ? current_da.traffic_volume : "0 kb/s"}
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
    ais: state.ai
	};
}

export default connect(mapStateToProps)(AIDectect);