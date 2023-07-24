import React, { Component, Fragment } from 'react'
// import { DateTimePickerComponent } from 'ej2-react-calendars';
import { connect } from 'react-redux';
import HeaderModule from '../../../common/module-header'
import {Row, Col, Modal} from 'react-bootstrap'
import { GetAgents, GetProcessCore, GetSystemInfo, GetProcessExporters} from '../../../actions/core-action';
// import ReactTable from 'react-table'
import Switch from '../../../components/switch'
import Ripple from '../../../components/ripple';
import { Input, Textarea, Select, AddOn, Inputmask, InputDate } from '../../../components/input'
import {SecondsToDhms} from '../utilities/utility'
// import FormScheduler from '../forms/form-scheduler';
import moment from 'moment';
import DatePicker from 'react-datepicker';

// const ROOT_URL = 'http://192.168.14.165:8000';
const PORT = 8000

class Manager extends Component {
  constructor(props) {
		super(props);

    this.state = {
      name: "",
      system: this.props.cores.system,
			process: this.props.cores.process,
      currentAgent: this.props.cores.agents[this.props.cores.idAgent],
      currentExporter: this.props.cores.currentExporter,
      exporters: this.props.cores.exporters,
      timeInterval: this.props.cores.interval,
      enabled: false,
      scheduler: null,
      default_with_size: {
				show: false,
				size: "lg",
				title: "Scheduler"
			},
      start_date_blue: new Date(),
			start_date_input_a: new Date(),
		}

    this.openDefault = this.openDefault.bind(this);
		this.closeDefault = this.closeDefault.bind(this);

		this.handleChange = this.handleChange.bind(this);
		this.handleChange_blue	=	this.handleChange_blue.bind(this)
		this.onChangeScheduler	=	this.onChangeScheduler.bind(this)
  }

  async componentDidMount() {
    try {
      const resSys = await GetSystemInfo(this.props.dispatch, {url: `http://${this.state.currentAgent.ip}:${PORT}`})
      if (resSys) {
        this.setState({
          ...this.state,
          system: resSys
      })}

      const agents = await GetAgents(this.props.dispatch)
      // console.log(this.props.cores.interval, this.state.enabled)
      let refreshProcess = setInterval(async () => {
        console.log(this.state.timeInterval, this.state.enabled)
        if (this.state.enabled) {const listExporters = await GetProcessExporters(this.props.dispatch, {url: `http://${this.state.currentAgent.ip}:${PORT}`})}
      }, this.props.cores.interval);

      this.setState({
        ...this.state,
        scheduler: refreshProcess,
      })

    } catch(e) {
      console.log(e);
    }
  }

  // componentDidUpdate() {
  //   if (this.state.enabled) {
  //     console.log(this.props.cores.interval)
  //     // this.props.dispatch({type: "SET_TIME_INTERVAL",})
  //   }
  // }

  componentWillUnmount() {
    clearInterval(this.state.scheduler)
  } 

  onSwitchAgent(hostname, ev){
    this.props.cores.agents.map(async (a, i) => {
      if (a.name == hostname) {
        this.setState({
          ...this.state,
          currentAgent: a
        })
        this.props.dispatch({ type: 'GET_CURRENT_AGENT', payload: {idCurrentAgent: i} })
        try {
          const resSys = await GetSystemInfo(this.props.dispatch, {url: `http://${a.ip}:${PORT}`})
          if (resSys) {
            this.setState({
              ...this.state,
              system: resSys
          })}

          const listExporters = await GetProcessExporters(this.props.dispatch, {url: `http://${a.ip}:${PORT}`})
          // console.log("listExporters", listExporters)
          if (listExporters) {
            this.setState({
              ...this.state,
              exporters: listExporters,
              currentExporter: listExporters[0]
            })
            this.props.dispatch({ type: 'GET_CURRENT_EXPORTER', payload: listExporters[0] });
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
          ...this.state,
          currentExporter: e
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

  openDefault(name, size) {
		this.setState({
			[name]: {
				show: true,
				size: size
			}
		});
	}
	closeDefault(name, size) {
		this.setState({
			[name]: {
				show: false,
				size: size
			}
		});
	}

  handleChange(date) {
		this.setState({
			start_date_input_a: date
		});
	}

	handleChange_blue(date) {
    console.log(date)
		this.setState({
			start_date_blue: date
		});
	}

  onChangeScheduler() {
    if (!this.state.enabled) {
      this.setState({
        ...this.state,
        enabled: !this.state.enabled
      })
      console.log(this.state.start_date_blue)
      this.props.dispatch({type: "SET_TIME_INTERVAL", payload: {interval: 10000}})  
    } else {
      this.setState({
        ...this.state,
        enabled: false
      })
    }
  }

  // minDate = new Date(new Date().getFullYear(), new Date().getMonth(), 7, 0, 0, 0);
  // maxDate = new Date(new Date().getFullYear(), new Date().getMonth(), 27, new Date().getHours(), new Date().getMinutes(), new Date().getSeconds());
  // dateValue = new Date(new Date().setDate(14));

  render() {
    const {cores} = this.props
    const {system} = this.state
    const currentExporter = this.state.currentExporter

    const filterPassedTime = (time) => {
      const currentDate = new Date();
      const selectedDate = new Date(time);
  
      return currentDate.getTime() < selectedDate.getTime();
    };

    return (
      <Fragment>
				<HeaderModule text="Censor"/>
				<Row>
					<Col sm={7}>
            <div className="card">
              <div className="card-header ch-alt">
                <h2>
                  {currentExporter && currentExporter.name ? currentExporter.name.charAt(0).toUpperCase() + currentExporter.name.slice(1) : "System"} Information
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
                      <li className="ng-binding">{currentExporter && currentExporter.status == "running" ? <i className="zmdi zmdi-check-circle"></i> : <i className="zmdi zmdi-close-circle"></i>} Status </li>
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
                      <li className="ng-binding"> {currentExporter && currentExporter.cmd ? currentExporter.cmd : "-"}</li>
                      <li className="ng-binding"> {currentExporter && currentExporter.port ? currentExporter.port : "-"}</li>
                      <li className="ng-binding"> {currentExporter && currentExporter.path ? currentExporter.path : "-"}</li>
                      <li className="ng-binding"> {currentExporter && currentExporter.status ? currentExporter.status : "-"} </li>
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
                  {/* <ReactTable className="-striped" defaultPageSize={10} filterable={true} data={cores.exporters} columns={[
                    {
                      pid: 'pid',
                      Header: props => <span className="text-left">PId</span>,
                      accessor: 'id'
                    }, {
                      id: 'name',
                      Header: 'Name',
                      accessor: 'name',
                    }, {
                      id: 'port',
                      Header: 'Port',
                      accessor: 'port'
                    }, {
                      id: 'cmd',
                      Header: 'CMD',
                      accessor: 'cmd'
                    }, {
                      id: 'path',
                      Header: 'Path',
                      accessor: 'path'
                    }, {
                      id: 'status',
                      Header: 'Status',
                      accessor: 'status'
                    }
                  ]} /> */}
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
            <Row>
              <div className="card">
                <div className="card-header ch-alt">
                  <h2>
                    Scheduler 
                  </h2>
                </div>
                <div className="card-body card-padding">
                  <div className="m-b-20">
                    <Col sm={12} className="m-b-20">
                      <Switch className="toggle-switch" switcher="switch-cyan" switchColor="rgba(0,188,212,0.5)" switchActive="#00bcd4">
                        <label className="ts-label" htmlFor="ts-cyan">Enable</label>
                        <input type="checkbox" id="ts-cyan" hidden="hidden" />
                        <label className="ts-helper" htmlFor="ts-cyan" onClick={this.onChangeScheduler}></label>
                      </Switch>
                    </Col>
                  </div>
                  <div>
                    <DatePicker
                      selected={this.state.start_date_blue}
                      onChange={(date) => this.handleChange_blue(date)}
                      showTimeSelect
                      filterTime={filterPassedTime}
                      dateFormat="h:mm:ss"
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      // dateFormat="h:mm aa"
                    />
                  </div>
                </div>
              </div>
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
                {currentExporter && currentExporter.cpu_usage ? currentProcess.cpu_usage : "0.00%"}
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
                {currentExporter && currentExporter.memory_usage ? currentProcess.memory_usage : "0.00%"}
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
                {currentExporter && currentExporter.disk_usage ? currentProcess.disk_usage : "0.00%"}
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
                {currentExporter && currentExporter.traffic_volume ? currentProcess.traffic_volume : "0 kb/s"}
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