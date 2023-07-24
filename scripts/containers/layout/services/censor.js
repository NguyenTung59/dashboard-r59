import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import HeaderModule from '../../../common/module-header'
import {Row, Col, NavDropdown, MenuItem} from 'react-bootstrap'
import { GetAgents, GetProcessCore, GetSystemInfo } from '../../../actions/core-action';
// import { Input, Textarea, Select, AddOn, Inputmask, InputDate } from '../../../components/input'
import {SecondsToDhms} from '../utilities/utility'
import FormScheduler from '../forms/form-scheduler';
// import moment from 'moment';
// import DatePicker from 'react-datepicker';

// const ROOT_URL = 'http://192.168.14.165:8000';
const PORT = 8000

class Censor extends Component {
  constructor(props) {
		super(props);
    this.state = {
      system: this.props.cores.system,
			censors: this.props.cores.censor,
      currentAgent: this.props.cores.agents[this.props.cores.idAgentCensor],
      scheduler: null,
      // start_date_blue: moment(),
			// start_date_input_a: moment(),
		}

		// this.handleChange = this.handleChange.bind(this);
		// this.handleChange_blue	=	this.handleChange_blue.bind(this)
  }

  async componentDidMount() {
    let isMounted = true 
    try {
      // const resSys = await GetSystemInfo(this.props.dispatch, {url: `http://${this.state.currentAgent.ip}:${PORT}`})
      // if (resSys) {
      //   this.setState({
      //     ...this.state,
      //     system: resSys
      // })}

      const agents = await GetAgents(this.props.dispatch)

      let refreshCensor = setInterval(async () => {
        const res = await GetProcessCore(this.props.dispatch, {name: "censor", url: `http://${this.state.currentAgent.ip}:${PORT}`});
        // console.log(res)
        console.log("running .... ")
        // if (res && isMounted) {
        //   this.setState({
        //     ...this.state,
        //     censor: res,
        //     currentCensor: res[0],
        //   })
        // }
      }, 1000);

      this.setState({
        ...this.state,
        scheduler: refreshCensor,
      })

    } catch(e) {
      console.log(e);
    }
    isMounted = false
  }

  componentWillUnmount() {
    clearInterval(this.state.scheduler)
  }

  onSwitchAgent(hostname, ev){
    this.props.cores.agents.map((a, i) => {
      if (a.name == hostname) {
        this.setState({
          ...this.state,
          currentAgent: a
        })
        this.props.dispatch({ type: 'GET_CURRENT_AGENT_CENSOR', payload: {idCurrentAgent: i} })
      }
    })
  }

  turnOffService() {
    console.log("turn off censor ")
  }
  
  resetService() {
    console.log("reset censor ")
  }

  configService() {
    console.log("config censor")
  }

  // handleChange(date) {
	// 	this.setState({
	// 		start_date_input_a: date
	// 	});
	// }

	// handleChange_blue(date) {
	// 	this.setState({
	// 		start_date_blue: date
	// 	});
	// }

  render() {
    const {cores} = this.props
    const currentCensor = cores.censor
    
    return (
      <Fragment>
				<HeaderModule text="Censor"/>
				<Row>
					<Col sm={7}>
              <div className="card">
              <div className="card-header ch-alt">
                <h2>
                  {currentCensor.name.charAt(0).toUpperCase() + currentCensor.name.slice(1)} Information
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
                      <li className="ng-binding">
                        <i className="zmdi zmdi-assignment"></i> Rule Version </li>
                      <li className="ng-binding">{currentCensor.status > 0 ? <i className="zmdi zmdi-check-circle"></i> : <i className="zmdi zmdi-close-circle"></i>} Status </li>
                      <li className="ng-binding"><i className="zmdi zmdi-timer"></i> Runtime: {SecondsToDhms(currentCensor.runtime)}</li>
                    </ul>
                  </Col>
                  <Col sm={8}>
                    <ul>
                      <li className="ng-binding"> {currentCensor.cpu}</li>
                      <li className="ng-binding"> {currentCensor.ram}</li>
                      <li className="ng-binding"> {currentCensor.total_disk}</li>
                      <li className="ng-binding"> {currentCensor.log_disk}</li>
                      <li className="ng-binding"> {currentCensor.traffic}</li>
                      <li className="ng-binding"> {currentCensor.uuid != "" ? currentCensor.uuid : "-"}</li>
                      <li className="ng-binding"> {currentCensor.hostname != "" ? currentCensor.hostname : "localhost"}</li>
                      <li className="ng-binding"> {currentCensor.used_rule_version != "" ? currentCensor.used_rule_version : "Waitting"}</li>
                      <li className="ng-binding"> {currentCensor.status > 0 ? "Running" : "Stopped"} </li>
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
            </Row>
            <Row>
              {/* <FormScheduler props={this.props}/> */}
            </Row>
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
                {currentCensor.cpu_usage ? currentCensor.cpu_usage : "0.00%"}
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
                {currentCensor.memory_usage ? currentCensor.memory_usage : "0.00%"}
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
                {currentCensor.disk_usage ? currentCensor.disk_usage : "0.00%"}
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
                {currentCensor.traffic_volume ? currentCensor.traffic_volume : "0 kb/s"}
              </div>
            </div>
          </Col>
          <Col sm={3}>
            <div className="card">
              <div className="card-header ch-alt">
                <h5>
                  Amount Rule Applied 
                </h5>
              </div>            
              <div className="card-body card-padding">
                {currentCensor.rule_applied_amount}
              </div>
            </div>
          </Col>
          <Col sm={3}>
            <div className="card">
              <div className="card-header ch-alt">
                <h5>
                  Amount Rule Applied Fail
                </h5>
              </div>            
              <div className="card-body card-padding">
                {currentCensor.fail_rule_amount}
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

export default connect(mapStateToProps)(Censor);