import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import {Row, Col} from 'react-bootstrap'
import { GetAgents, GetProcessCore, GetConfigServices } from '../../../actions/core-action';
import {SecondsToDhms} from '../utilities/utility'
import { checkPercentWarning, checkTrafficWarning } from '../utilities/check-warning';
import HeaderModule from '../../../common/module-header'
import FormSchedulerRefresh from '../forms/form-scheduler-refresh';
import ListAgents from '../forms/agents/form-list-agents';
import ControlProcess from '../../../components/control'

// const ROOT_URL = 'http://192.168.14.165:8000';
const PORT = 8000

class Censor extends Component {
  constructor(props) {
		super(props);
    this.state = {
      name: this.props.history.location.pathname.split("/")[2],
      service: this.props.history.location.pathname.split("/")[2].toUpperCase(),
      system: this.props.cores.system,
      current_agent: this.props.cores.agents[this.props.censors.censor_task.id_agent_censor],
      init_refresh: null,
      scheduler_task: [],
      status: false,
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
      await GetConfigServices(this.props.dispatch, {ip: this.state.current_agent.ip, name: this.state.name, url: `http://192.168.14.165:${PORT}`})
      await GetProcessCore(this.props.dispatch, {name: this.state.name, url: `http://${this.state.current_agent.ip}:${PORT}`});
      let refresh_init = setInterval(async () => {
        if (this.props.censors.censor_task.enabled) {
          if (!this.props.censors.censor_task.check_task) {
            if (this.props.censors.censor_task.timer == 0 ) {
              let refresh_censor = setInterval(async () => {
                var current_agent = this.props.cores.agents[this.props.censors.censor_task.id_agent_censor]
                this.props.dispatch({type: `SET_${this.state.service}_CHECK_TASK`, payload: {check_task: true}})
                await GetProcessCore(this.props.dispatch, {name: this.state.name, url: `http://${current_agent.ip}:${PORT}`});
              }, this.props.censors.censor_task.interval)
              this.setState({
                scheduler_task: [
                  ...this.state.scheduler_task,
                  {
                    id: refresh_censor,
                    name: "refresh_censor"
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
          // this.props.dispatch({type: `SET_${this.state.service}_CHECK_TASK`, payload: {check_task: false}})
        }

      }, 1000);

      this.setState({
        init_refresh: refresh_init
      })

    } catch(e) {
      console.log("78 censor", e);
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

  render() {
    const {cores, censors} = this.props
    const current_censor = censors.censor
    // console.log(this.props.censors.censor_task.enabled)
    // console.log(this.props.censors.config)

    return (
      <Fragment>
				<HeaderModule text="Censor"/>
				<Row>
					<Col sm={7}>
              <div className="card">
              <div className="card-header ch-alt">
                <h2>
                  {current_censor.name.charAt(0).toUpperCase() + current_censor.name.slice(1)} Information
                </h2>
              </div>
              <div className="card-body card-padding">
                <Row className="pmo-contact">
                  <Col sm={4}>
                    <ul>
                      <li className="ng-binding">
                        <i className="zmdi zmdi-laptop"></i> <b>CPU </b></li>
                      <li className="ng-binding">
                        <i className="zmdi zmdi-card-sd"></i> <b>RAM </b></li>
                      <li className="ng-binding">
                        <i className="zmdi zmdi-dns"></i> <b>Disk </b></li>
                      <li className="ng-binding">
                        <i className="zmdi zmdi-floppy"></i> <b>Log Disk</b></li>
                      <li className="ng-binding">
                        <i className="zmdi zmdi-router"></i> <b>Traffic </b></li>
                      <li className="ng-binding">
                        <i className="zmdi zmdi-devices"></i> <b>UUID </b></li>
                      <li className="ng-binding">
                        <i className="zmdi zmdi-desktop-mac"></i> <b>Host Name </b></li>
                      <li className="ng-binding">
                        <i className="zmdi zmdi-assignment"></i>  <b>Rule Version </b></li>
                      <li className="ng-binding">{current_censor.status > 0 ? <i className="zmdi zmdi-check-circle"></i> : <i className="zmdi zmdi-close-circle"></i>}<b> Status</b> </li>
                      <li className="ng-binding"><i className="zmdi zmdi-time"></i><b> Start time </b></li>
                      <li className="ng-binding"><i className="zmdi zmdi-timer"></i><b> Runtime:</b> {SecondsToDhms(current_censor.runtime)}</li>
                    </ul>
                  </Col>
                  <Col sm={8}>
                    <ul>
                      <li className="ng-binding"> {current_censor.cpu}</li>
                      <li className="ng-binding"> {current_censor.ram}</li>
                      <li className="ng-binding"> {current_censor.total_disk}</li>
                      <li className="ng-binding"> {current_censor.log_disk}</li>
                      <li className="ng-binding"> {current_censor.traffic}</li>
                      <li className="ng-binding"> {current_censor.uuid != "" ? current_censor.uuid : "-"}</li>
                      <li className="ng-binding"> {current_censor.hostname != "" ? current_censor.hostname : "localhost"}</li>
                      <li className="ng-binding"> {current_censor.used_rule_version != "" ? current_censor.used_rule_version : "Waitting"}</li>
                      <li className="ng-binding"> {current_censor.status > 0 ? "Running" : "Stopped"} </li>
                      <li className="ng-binding"> {current_censor && current_censor.start_time ? current_censor.start_time : "-"} </li>
                      <li className="ng-binding">                     
                        {/* <Col sm={4}> {current_censor.status > 0 ? <a onClick={this.turnOffService.bind(this, current_censor.pid)} style={{color: 'cyan'}}><i className="zmdi zmdi-power"></i></a> : <a onClick={this.turnOnService.bind(this)} style={{color: 'red'}}><i className="zmdi zmdi-power"></i></a>}</Col>
                        <Col sm={4}> <a onClick={this.resetService}><i className="zmdi zmdi-refresh"></i></a></Col>
                        <Col sm={4}> <a onClick={this.configService}><i className="zmdi zmdi-wrench"></i></a></Col>  */}
                        <ControlProcess 
                          service={{
                            name: this.state.name,
                            status: current_censor.status,
                            pid: current_censor.pid,
                          }}
                          config={{
                            agent_ip: this.props.censors.config.agent_ip,
                            hostname: this.props.censors.config.hostname,
                            name: this.state.name,
                            cmd: this.props.censors.config.cmd,
                            cmd_stop: this.props.censors.config.cmd_stop,
                            dir: this.props.censors.config.dir,
                            bin: this.props.censors.config.bin,
                            script: this.props.censors.config.script
                          }}
                          auth={this.props.auth}
                          current_process={current_censor}
                          dispatch={this.props.dispatch}
                          current_agent={this.props.cores.agents[this.props.censors.censor_task.id_agent_censor]}
                        />
                      </li>
                    </ul>
                  </Col>
                </Row>
              </div>
            </div>
					</Col>
          <Col sm={5}>
            <ListAgents 
              service={{
                name: this.state.name,
                id_agent: this.props.censors.censor_task.id_agent_censor,
              }}
              // scheduler_task={this.state.scheduler_task}
              auth={this.props.auth}
              dispatch={this.props.dispatch}
              cores={cores}
            />
            {/* scheduler  */}
            <FormSchedulerRefresh 
              location={this.props.location} 
              service={{
                interval: this.props.censors.censor_task.interval, 
                enabled: this.props.censors.censor_task.enabled, 
                check_task: this.props.censors.censor_task.check_task, 
                timer: this.props.censors.censor_task.timer, 
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
              <div className={checkPercentWarning(current_censor.cpu_usage)}>
                <h5>
                  CPU usage
                </h5>
              </div>            
              <div className="card-body card-padding">
                {current_censor.cpu_usage ? current_censor.cpu_usage : "0.00%"}
              </div>
            </div>
          </Col>
          <Col sm={3}>
            <div className="card">
              <div className={checkPercentWarning(current_censor.memory_usage)}>
                <h5>
                  RAM usage
                </h5>
              </div>            
              <div className="card-body card-padding">
                {current_censor.memory_usage ? current_censor.memory_usage : "0.00%"}
              </div>
            </div>
          </Col>
          <Col sm={3}>
            <div className="card">
              <div className={checkPercentWarning(current_censor.disk_usage)}>
                <h5>
                  Disk usage
                </h5>
              </div>            
              <div className="card-body card-padding">
                {current_censor.disk_usage ? current_censor.disk_usage : "0.00%"}
              </div>
            </div>
          </Col>
          <Col sm={3}>
            <div className="card">
              <div className={checkTrafficWarning(current_censor.traffic_volume)}>
                <h5>
                  Traffic 
                </h5>
              </div>            
              <div className="card-body card-padding">
                {current_censor.traffic_volume ? current_censor.traffic_volume : "0 kb/s"}
              </div>
            </div>
          </Col>
          <Col sm={3}>
            <div className="card">
              <div className="card-header ch-alt bgm-lightgreen">
                <h5>
                  Amount Rule Applied 
                </h5>
              </div>            
              <div className="card-body card-padding">
                {current_censor.rule_applied_amount}
              </div>
            </div>
          </Col>
          <Col sm={3}>
            <div className="card">
              <div className="card-header ch-alt bgm-red txt-white">
                <h5>
                  Amount Rule Applied Fail
                </h5>
              </div>            
              <div className="card-body card-padding">
                {current_censor.fail_rule_amount}
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
    censors: state.censors,
	};
}

export default connect(mapStateToProps)(Censor);