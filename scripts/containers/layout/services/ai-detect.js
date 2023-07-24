import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import HeaderModule from '../../../common/module-header'

import {Row, Col} from 'react-bootstrap'
import { GetProcessCore, GetSystemInfo } from '../../../actions/core-action';
import {SecondsToDhms} from '../utilities/utility'
const ROOT_URL = 'http://192.168.14.165:8000';
const PORT = 8000

class AIDectect extends Component {
  constructor(props) {
		super(props);
    this.state = {
      system: this.props.cores.system,
			da: this.props.cores.da,
      currentAgent: this.props.cores.agents[this.props.cores.idAgentDA],
      scheduler: null,
		}
  }

  async componentDidMount() {
    let isMounted = true;
    try {
      // const resSys = await GetSystemInfo(this.props.dispatch, {url: `http://${this.state.currentAgent.ip}:${PORT}`})
      // if (resSys) {
      //   this.setState({
      //     ...this.state,
      //     system: resSys
      // })}

      let refreshDA = setInterval(async () => {
        const res = await GetProcessCore(this.props.dispatch, {name: "deep-analyst", url: `http://${this.state.currentAgent.ip}:${PORT}`});
        // if (res && isMounted) {
        //   this.setState({
        //     ...this.state,
        //     da: res
        //   })
        // }
      }, 1000);

      this.setState({
        ...this.state,
        scheduler: refreshDA,
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
        this.props.dispatch({ type: 'GET_CURRENT_AGENT_DA', payload: {idCurrentAgent: i} })
      }
    })
  }
  
  render() {
    const {cores} = this.props
    const currentDA = cores.da

    return (
      <Fragment>
				<HeaderModule text="AI Detect"/>
				<Row>
					<Col sm={7}>
              <div className="card">
              <div className="card-header ch-alt">
                <h2>
                  {currentDA.name.charAt(0).toUpperCase() + currentDA.name.slice(1)} Information
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
                      <li className="ng-binding">{currentDA.status > 0 ? <i className="zmdi zmdi-check-circle"></i> : <i className="zmdi zmdi-close-circle"></i>} Status </li>
                      <li className="ng-binding"><i className="zmdi zmdi-timer"></i> Runtime: {SecondsToDhms(cores.da.runtime)}</li>
                    </ul>
                  </Col>
                  <Col sm={8}>
                    <ul>
                      <li className="ng-binding"> {currentDA.cpu}</li>
                      <li className="ng-binding"> {currentDA.ram}</li>
                      <li className="ng-binding"> {currentDA.total_disk}</li>
                      <li className="ng-binding"> {currentDA.log_disk}</li>
                      <li className="ng-binding"> {currentDA.traffic}</li>
                      <li className="ng-binding"> {currentDA.uuid != "" ? currentDA.uuid : "-"}</li>
                      <li className="ng-binding"> {currentDA.hostname != "" ? currentDA.hostname : "localhost"}</li>
                      <li className="ng-binding"> {currentDA.status > 0 ? "Running" : "Stopped"} </li>
                      <li className="ng-binding">                     
                        <Col sm={4}> <i className="zmdi zmdi-power"></i></Col>
                        <Col sm={4}> <i className="zmdi zmdi-refresh"></i></Col>
                        <Col sm={4}> <i className="zmdi zmdi-wrench"></i></Col> 
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
                  List DA
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
                {currentDA.cpu_usage ? currentDA.cpu_usage : "0.00%"}
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
                {currentDA.memory_usage ? currentDA.memory_usage : "0.00%"}
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
                {currentDA.disk_usage ? currentDA.disk_usage : "0.00%"}
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
                {currentDA.traffic_volume ? currentDA.traffic_volume : "0 kb/s"}
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

export default connect(mapStateToProps)(AIDectect);