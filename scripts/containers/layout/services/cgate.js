import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import HeaderModule from '../../../common/module-header'

import {Row, Col} from 'react-bootstrap'
import { GetProcessCore, GetSystemInfo, GetAgents } from '../../../actions/core-action';
import {SecondsToDhms} from '../utilities/utility'
import FormSchedulerRefresh from '../forms/form-scheduler-refresh';

const ROOT_URL = 'http://192.168.14.165:8000';
const PORT = 8000

class Cgate extends Component {
  constructor(props) {
		super(props);
    this.state = {
      name: this.props.history.location.pathname.split("/")[2],
      service: this.props.history.location.pathname.split("/")[2].toUpperCase(),
      system: this.props.cores.system,
      current_agent: this.props.cores.agents[this.props.cgates.cgate_task.id_agent_cgate],
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

      const agents = await GetAgents(this.props.dispatch)
      const result = await GetProcessCore(this.props.dispatch, {name: this.state.name, url: `http://${this.state.current_agent.ip}:${PORT}`});

      let refresh_init = setInterval(async () => {
        if (this.props.cgates.cgate_task.enabled) {
          if (!this.props.cgates.cgate_task.check_task) {
            if (this.props.cgates.cgate_task.timer == 0 ) {
              let refresh_cgate = setInterval(async () => {
              // console.log("task running .... ")
              const res = await GetProcessCore(this.props.dispatch, {name: this.state.name, url: `http://${this.state.current_agent.ip}:${PORT}`});
              // console.log("res ", res)
              this.props.dispatch({type: `SET_${this.state.service}_CHECK_TASK`, payload: {check_task: true}})
              }, this.props.cgates.cgate_task.interval)

              this.setState({
                scheduler_task: [
                  ...this.state.scheduler_task,
                  {
                    id: refresh_cgate,
                    name: "refresh_cgate"
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

  onSwitchAgent(hostname, ev){
    this.props.cores.agents.map(async (a, i) => {
      if (a.name == hostname) {
        this.setState({
          ...this.state,
          current_agent: a
        })
        this.props.dispatch({ type: 'GET_CURRENT_AGENT_CGATE', payload: {id_current_agent: i} })
        const res = await GetProcessCore(this.props.dispatch, {name: this.state.name, url: `http://${a.ip}:${PORT}`});
      }
    })
  }

  turnOffService() {
    console.log("turn off cgate ")
  }
  
  resetService() {
    console.log("reset cgate ")
  }

  configService() {
    console.log("config cgate")
  }

  render() {
    const {cores, cgates} = this.props
    const current_cgate = cgates.cgate

    // console.log(current_cgate.traffic_volume)
    return (
      <Fragment>
				<HeaderModule text="Cgate"/>
				<Row>
					<Col sm={7}>
              <div className="card">
              <div className="card-header ch-alt">
                <h2>
                  {current_cgate.name.charAt(0).toUpperCase() + current_cgate.name.slice(1)} Information
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
                      <li className="ng-binding">{current_cgate.status > 0 ? <i className="zmdi zmdi-check-circle"></i> : <i className="zmdi zmdi-close-circle"></i>} Status </li>
                      <li className="ng-binding"><i className="zmdi zmdi-timer"></i> Runtime: {SecondsToDhms(current_cgate.runtime)}</li>
                    </ul>
                  </Col>
                  <Col sm={8}>
                    <ul>
                      <li className="ng-binding"> {current_cgate.cpu}</li>
                      <li className="ng-binding"> {current_cgate.ram}</li>
                      <li className="ng-binding"> {current_cgate.total_disk}</li>
                      <li className="ng-binding"> {current_cgate.log_disk}</li>
                      <li className="ng-binding"> {current_cgate.traffic}</li>
                      <li className="ng-binding"> {current_cgate.uuid != "" ? current_cgate.uuid : "-"}</li>
                      <li className="ng-binding"> {current_cgate.hostname != "" ? current_cgate.hostname : "localhost"}</li>
                      <li className="ng-binding"> {current_cgate.status > 0 ? "Running" : "Stopped"} </li>
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
            <div className="card">
              <div className="card-header ch-alt">
                <h2>
                  List Agent
                </h2>
              </div>
              <div className="card-body card-padding">
                <Row className="pmo-contact">
                    {cores.agents.map((a, i) => (
                      <Col sm={12/cores.agents.length} key={i} onClick={this.onSwitchAgent.bind(this, a.name)}>
                          <ul className="list-unstyled module-action">
                            <li>
                              <a><i className="zmdi zmdi-desktop-mac"></i> {a.name}</a>
                            </li>
                          </ul>
                      </Col>)
                    )}
                  </Row>
                </div>
            </div>
            {/* scheduler  */}
            <FormSchedulerRefresh 
              location={this.props.location} 
              service={{
                interval: this.props.cgates.cgate_task.interval, 
                enabled: this.props.cgates.cgate_task.enabled, 
                check_task: this.props.cgates.cgate_task.check_task, 
                timer: this.props.cgates.cgate_task.timer, 
              }}/>
          </Col>
				</Row>
        <Row>
          <h3>Performance</h3>
          <Col sm={3}>
            <div className="card">
              <div className="card-header ch-alt">
                <h5>
                  CPU usage
                </h5>
              </div>            
              <div className="card-body card-padding">
                {current_cgate.cpu_usage ? current_cgate.cpu_usage : "0.00%"}
              </div>
            </div>
          </Col>
          <Col sm={3}>
            <div className="card">
              <div className="card-header ch-alt">
                <h5>
                  RAM usage
                </h5>
              </div>            
              <div className="card-body card-padding">
                {current_cgate.memory_usage ? current_cgate.memory_usage : "0.00%"}
              </div>
            </div>
          </Col>
          <Col sm={3}>
            <div className="card">
              <div className="card-header ch-alt">
                <h5>
                  Disk usage
                </h5>
              </div>            
              <div className="card-body card-padding">
                {current_cgate.disk_usage ? current_cgate.disk_usage : "0.00%"}
              </div>
            </div>
          </Col>
          <Col sm={3}>
            <div className="card">
              <div className="card-header ch-alt">
                <h5>
                  Traffic 
                </h5>
              </div>            
              <div className="card-body card-padding">
                {current_cgate.traffic_volume ? current_cgate.traffic_volume : "0 kb/s"}
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
    cgates: state.cgates,
	};
}

export default connect(mapStateToProps)(Cgate);