import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import HeaderModule from '../../../common/module-header'

import {Row, Col} from 'react-bootstrap'
import { GetProcessCore, GetSystemInfo } from '../../../actions/core-action';
import {SecondsToDhms} from '../utilities/utility'
const ROOT_URL = 'http://192.168.14.165:8000';
const PORT = 8000

class Cgate extends Component {
  constructor(props) {
		super(props);
    this.state = {
      system: this.props.cores.system,
			cgate: this.props.cores.cgate,
      currentAgent: this.props.cores.agents[this.props.cores.idAgentCgate],
      scheduler: null
		}
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

      const refreshCgate = setInterval(async () => {
        const res = await GetProcessCore(this.props.dispatch, {name: "cgate", url: `http://${this.state.currentAgent.ip}:${PORT}`});
        // if (res && isMounted) {
        //   this.setState({
        //     ...this.state,
        //     cgate: res
        //   })
        // }
      }, 1000);

      this.setState({
        ...this.state,
        scheduler: refreshCgate,
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
        this.props.dispatch({ type: 'GET_CURRENT_AGENT_CGATE', payload: {idCurrentAgent: i} })
      }
    })
  }

  render() {
    const {cores} = this.props
    const currentCgate = cores.cgate

    // console.log(currentCgate.traffic_volume)
    return (
      <Fragment>
				<HeaderModule text="Cgate"/>
				<Row>
					<Col sm={7}>
              <div className="card">
              <div className="card-header ch-alt">
                <h2>
                  {currentCgate.name.charAt(0).toUpperCase() + currentCgate.name.slice(1)} Information
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
                      <li className="ng-binding">{currentCgate.status > 0 ? <i className="zmdi zmdi-check-circle"></i> : <i className="zmdi zmdi-close-circle"></i>} Status </li>
                      <li className="ng-binding"><i className="zmdi zmdi-timer"></i> Runtime: {SecondsToDhms(cores.cgate.runtime)}</li>
                    </ul>
                  </Col>
                  <Col sm={8}>
                    <ul>
                      <li className="ng-binding"> {currentCgate.cpu}</li>
                      <li className="ng-binding"> {currentCgate.ram}</li>
                      <li className="ng-binding"> {currentCgate.total_disk}</li>
                      <li className="ng-binding"> {currentCgate.log_disk}</li>
                      <li className="ng-binding"> {currentCgate.traffic}</li>
                      <li className="ng-binding"> {currentCgate.uuid != "" ? currentCgate.uuid : "-"}</li>
                      <li className="ng-binding"> {currentCgate.hostname != "" ? currentCgate.hostname : "localhost"}</li>
                      <li className="ng-binding"> {currentCgate.status > 0 ? "Running" : "Stopped"} </li>
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
                  List Cgate
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
                {currentCgate.cpu_usage ? currentCgate.cpu_usage : "0.00%"}
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
                {currentCgate.memory_usage ? currentCgate.memory_usage : "0.00%"}
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
                {currentCgate.disk_usage ? currentCgate.disk_usage : "0.00%"}
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
                {currentCgate.traffic_volume ? currentCgate.traffic_volume : "0 kb/s"}
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

export default connect(mapStateToProps)(Cgate);