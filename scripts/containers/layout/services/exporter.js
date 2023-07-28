import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import HeaderModule from '../../../common/module-header'
import {Row, Col} from 'react-bootstrap'
import { GetAgents, GetSystemInfo, GetProcessExporters} from '../../../actions/core-action';
import {SecondsToDhms} from '../utilities/utility'
import FormSchedulerRefresh from '../forms/form-scheduler-refresh';

// const ROOT_URL = 'http://192.168.14.165:8000';
const PORT = 8000

class Manager extends Component {
  constructor(props) {
		super(props);

    this.state = {
      name: this.props.history.location.pathname.split("/")[2],
      service: this.props.history.location.pathname.split("/")[2].toUpperCase(),
      system: this.props.cores.system,
      current_agent: this.props.cores.agents[this.props.cores.exporter_task.id_agent],
      current_exporter: this.props.cores.current_exporter,
      exporters: this.props.cores.exporters,
      scheduler_task: []
		}
  }

  async componentDidMount() {
    try {
      const resSys = await GetSystemInfo(this.props.dispatch, {url: `http://${this.state.current_agent.ip}:${PORT}`})
      if (resSys) {
        this.setState({
          system: resSys
      })}

      const agents = await GetAgents(this.props.dispatch)
      const list_exporters = await GetProcessExporters(this.props.dispatch, {url: `http://${this.state.current_agent.ip}:${PORT}`})

      let refresh_exporter = setInterval(async () => {
        // console.log("manager ... :", this.props.cores.exporter_task.enabled, this.props.cores.exporter_task.check_task, this.props.cores.exporter_task.timer, this.props.cores.exporter_task.interval)
        if (this.props.cores.exporter_task.enabled) {
          if (!this.props.cores.exporter_task.check_task) {
            if (this.props.cores.exporter_task.timer == 0 ) {
              // console.log("run task success")
              const list_exporters = await GetProcessExporters(this.props.dispatch, {url: `http://${this.state.current_agent.ip}:${PORT}`})

              this.props.dispatch({type: `SET_${this.state.service}_CHECK_TASK`, payload: {check_task: true}})
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
      }, this.props.cores.exporter_task.interval);

      this.setState({
        scheduler_task: [
          ...this.state.scheduler_task,
          {
            id: refresh_exporter,
            name: "refresh_exporter"
          }
        ],
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
  } 

  onSwitchAgent(hostname, ev){
    this.props.cores.agents.map(async (a, i) => {
      if (a.name == hostname) {
        this.setState({
          current_agent: a
        })
        this.props.dispatch({ type: 'GET_CURRENT_AGENT_EXPORTER', payload: {id_current_agent: i} })
        try {
          const resSys = await GetSystemInfo(this.props.dispatch, {url: `http://${a.ip}:${PORT}`})
          if (resSys) {
            this.setState({
              system: resSys
          })}

          const list_exporters = await GetProcessExporters(this.props.dispatch, {url: `http://${a.ip}:${PORT}`})
          if (list_exporters.length > 0) {
            this.setState({
              exporters: list_exporters,
              current_exporter: list_exporters[0]
            })
            this.props.dispatch({ type: 'GET_CURRENT_EXPORTER', payload: list_exporters[0] });
          }
        } catch(e) {
          console.log(e);
        }
      }
    })
  }

  onSwitchExporter(pid, ev){
    this.props.cores.exporters.map(async (e, i) => {
      if (e.pid == pid) {
        this.setState({
          current_exporter: e
        })
        this.props.dispatch({ type: 'GET_CURRENT_EXPORTER', payload: e });
      }
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
    const current_exporter = this.state.current_exporter

    return (
      <Fragment>
				<HeaderModule text="Censor"/>
				<Row>
					<Col sm={7}>
            <div className="card">
              <div className="card-header ch-alt">
                <h2>
                  {current_exporter && current_exporter.name ? current_exporter.name.charAt(0).toUpperCase() + current_exporter.name.slice(1) : "System"} Information
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
                        <i className="zmdi zmdi-devices"></i> UUID </li>
                      <li className="ng-binding">
                        <i className="zmdi zmdi-desktop-mac"></i> Host Name </li>
                      <li className="ng-binding">
                        <i className="zmdi zmdi-desktop-mac"></i> CMD </li>  
                      <li className="ng-binding">
                        <i className="zmdi zmdi-desktop-mac"></i> Port </li>
                      <li className="ng-binding">
                        <i className="zmdi zmdi-desktop-mac"></i> Path </li>  
                      <li className="ng-binding">{current_exporter && current_exporter.status == "running" ? <i className="zmdi zmdi-check-circle"></i> : <i className="zmdi zmdi-close-circle"></i>} Status </li>
                      <li className="ng-binding"><i className="zmdi zmdi-time"></i> Start time: </li>
                      <li className="ng-binding"><i className="zmdi zmdi-timer"></i> Runtime: {SecondsToDhms(0)}</li>
                    </ul>
                  </Col>
                  <Col sm={8}>
                    <ul>
                      <li className="ng-binding"> {system.cpu}</li>
                      <li className="ng-binding"> {system.ram}</li>
                      <li className="ng-binding"> {system.total_disk}</li>
                      <li className="ng-binding"> {system.uuid != "" ? system.uuid : "-"}</li>
                      <li className="ng-binding"> {system.hostname != "" ? system.hostname : "localhost"}</li>
                      <li className="ng-binding"> {current_exporter && current_exporter.cmd ? current_exporter.cmd : "-"}</li>
                      <li className="ng-binding"> {current_exporter && current_exporter.port ? current_exporter.port : "-"}</li>
                      <li className="ng-binding"> {current_exporter && current_exporter.path ? current_exporter.path : "-"}</li>
                      <li className="ng-binding"> {current_exporter && current_exporter.status ? current_exporter.status : "-"} </li>
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
            <Row>
              <div className="card">
                <div className="card-header ch-alt">
                  <h2>
                    List Agent
                  </h2>
                </div>
                <div className="card-body card-padding">
                  <Row className="pmo-contact">
                    {cores.agents.sort((a, b) => a.hostname - b.hostname).map((a, i) => (
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
            </Row>
            <Row>
              <div className="card">
                <div className="card-header ch-alt">
                  <h2>
                    List Exporters
                  </h2>
                </div>
                <div className="card-body card-padding">
                  {cores.exporters.sort((a, b) => a.name - b.name).map((e, i) => (
                      <div key={i} onClick={this.onSwitchExporter.bind(this, e.pid)}>
                          <ul className="list-unstyled module-action">
                            <li>
                              <a>{e.name}</a>
                            </li>
                          </ul>
                      </div>)
                    )}
							</div>
              </div>
            </Row>
            {/* scheduler  */}

            <FormSchedulerRefresh 
              location={this.props.location} 
              service={{
                interval: this.props.cores.exporter_task.interval, 
                enabled: this.props.cores.exporter_task.enabled, 
                check_task: this.props.cores.exporter_task.check_task, 
                timer: this.props.cores.exporter_task.timer, 
              }}
            />
          </Col>
				</Row>
        {/* Performance */}
        <div className="module-head">
          <h2>Performance</h2>
        </div>
        <Row>
          <Col sm={3}>
            <div className="card">
              <div className="card-header ch-alt">
                <h5>
                  CPU usage
                </h5>
              </div>            
              <div className="card-body card-padding">
                {current_exporter && current_exporter.cpu_usage ? currentProcess.cpu_usage : "0.00%"}
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
                {current_exporter && current_exporter.memory_usage ? currentProcess.memory_usage : "0.00%"}
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
                {current_exporter && current_exporter.disk_usage ? currentProcess.disk_usage : "0.00%"}
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
                {current_exporter && current_exporter.traffic_volume ? currentProcess.traffic_volume : "0 kb/s"}
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
    cores: state.cores
	};
}

export default connect(mapStateToProps)(Manager);