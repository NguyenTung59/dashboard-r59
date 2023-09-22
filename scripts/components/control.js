import React , {Component} from "react"
import { GetProcessCore, StartProcessCore, StopProcessCore, SetConfigService, GetConfigServices} from '../actions/core-action';
import {Row, Col, Modal} from 'react-bootstrap'
import { Input } from './input'
import Ripple from './ripple';
import swal from 'sweetalert';
import {makeSwal} from '../containers/layout/utilities/utility'

const config = require("../helper/config").config;
const notify = require("../helper/notify").notify;

const PORT = 8000
export default class ControlProcess extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: this.props.service.name,
      status: this.props.service.status,
      pid: this.props.service.pid,
      loading: false,
      custom: {
				default: false,
				txt: false,
				input: false,
				scroll: false,
				entrance: ""
			},
      config: {
        agent_ip: this.props.config.ip,
        hostname: this.props.config.hostname,
        name: this.props.config.name,
        cmd: this.props.config.cmd,
        cmd_stop: this.props.config.cmd_stop,
        dir: this.props.config.dir,
        bin: this.props.config.bin,
        script: this.props.config.script
      }
    }

    this.openCustom = this.openCustom.bind(this);
		this.closeCustom = this.closeCustom.bind(this);
  }

  // async componentDidMount() {
  //   try {
  //     const config = await GetConfigServices(this.props.dispatch, {ip: this.props.current_agent.ip, name: this.state.name, url: `http://192.168.14.165:${PORT}`})
  //     // console.log(config)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  async turnOffService(pid) {
    console.log(this.props.config)
    try {
      let current_agent = this.props.current_agent
      this.setState({
        loading: true
      })
  
      const result = await StopProcessCore(this.props.dispatch, {
        body : {
          pid: pid,
          dir: this.props.config.dir,
          cmd_stop: this.props.config.cmd_stop,
        },
        url: `http://${current_agent.ip}:${PORT}`
      })
      let msg = `Power off process ${this.state.name} with pid=${this.props.service.pid}`
      if (result) {
        makeSwal({type: "success", msg: msg})
      } else {
        makeSwal({type: "error", msg: msg})
      }
      await GetProcessCore(this.props.dispatch, {name: this.props.service.name, url: `http://${current_agent.ip}:${PORT}`});
    } catch (error) {
      makeSwal({type: "error", msg: error})
    }
  }

  async turnOnService() {
    // console.log(this.props.current_process)
    try {
      let current_agent = this.props.current_agent
      this.setState({
        loading: true
      })
  
      const result = await StartProcessCore(this.props.dispatch, {
        body : {
          name: this.props.config.name,
          cmd: this.props.config.command,
          dir: this.props.config.dir,
          script: this.props.config.script,
          bin: this.props.config.bin
        },
        url: `http://${current_agent.ip}:${PORT}` 
      })
      let msg = `Power on process ${this.state.name}`
      if (result) {
        makeSwal({type: "success", msg: msg})
      } else {
        makeSwal({type: "error", msg: msg})
      }
      await GetProcessCore(this.props.dispatch, {name: this.props.service.name, url: `http://${current_agent.ip}:${PORT}`});
      this.setState({loading: false})
    } catch (error) {
      makeSwal({type: "error", msg: error})
    }
  }
  
  resetService() {
    console.log("reset censor ")
  }

  setConfigService() {
    console.log("config censor")
  }
  
  simpleAlert(type, pid) {
		if (type == 'alert'){
			notify.alert("This is basic alert")
		} else if (type == 'confirm off') {
      let current_agent = this.props.current_agent
      if (current_agent.ip == "192.168.14.151") {
        notify.confirm({
          "title": "Are you sure, you want to power off?",
          "left": "No",
          "right": "Yes",
          "fn": () => {
            if (this.props.auth.role == "admin") {
              this.turnOffService(pid)
            } else {
              makeSwal({type: "error", msg: `You are not have permission power off process ${this.state.name}`})
            }
          }
        });
      } else {
        notify.confirm({
          "title": "Are you sure, you want to power off?",
          "left": "No",
          "right": "Yes",
          "fn": () => {
            this.turnOffService(pid)
          }
        });
      }
		} else if (type == 'confirm on') {
      let current_agent = this.props.current_agent
      if (current_agent.ip == "192.168.14.151") {
        notify.confirm({
          "title": "Are you sure, you want to power on?",
          "left": "No",
          "right": "Yes",
          "fn": () => {
            if (this.props.auth.role == "admin") {
              this.turnOnService()
            } else {
              makeSwal({type: "error", msg: `You are not have permission start process ${this.state.name}`})
            }
          }
        });
      } else {
        notify.confirm({
          "title": "Are you sure, you want to power on?",
          "left": "No",
          "right": "Yes",
          "fn": () => {
            this.turnOnService()
          }
        });
      }
    } else if (type == 'confirm set config') {
      let current_agent = this.props.current_agent
      notify.confirm({
        "title": "Are you sure, you want to save config?",
        "left": "No",
        "right": "Yes",
        "fn": () => {
          this.setState({
            config: {
              ...this.state.config,
              agent_ip: current_agent.ip,
              hostname: current_agent.name
            }
          })
          this.onSaveConfig()
          makeSwal({type: "success", msg: `You are set config service ${this.state.name} success!`})
        }
      });
    } else if (type == 'toast') {
			notify.toast("This is a toast", {
				time: 50000,
				fn: () => {
					
				}
			})
		}
	}

  openCustom(type, entrance) {
		this.setState({
			custom: {
				[type]: true,
				entrance: entrance
			}
		})
	}
	closeCustom(type, entrance) {
		this.setState({
			custom: {
				[type]: false,
				entrance: entrance
			}
		})
	}

  // config
  onChangeConfig(ev) {
    var {name, value} = ev.target
    this.setState({
			config: {
        ...this.state.config,
				[name]: value
			}
		})
  }

  async onSaveConfig() {
    await SetConfigService(this.props.dispatch, {body: this.state.config, name: this.state.name, url: `http://192.168.14.165:${PORT}`})
    this.props.dispatch({type: `SET_CONFIG_${this.state.name.toUpperCase()}`, payload: {config: this.state.config}})
    this.closeCustom("input", this.state.custom.entrance)
  }

  render() {



    return (
      <div>
        <Row className="notifications">        
          <Col sm={4}> 
            {
              this.props.service.status > 0 
              ? <a onClick={() => { this.simpleAlert("confirm off", this.props.service.pid)}}><i className="zmdi zmdi-power"></i></a> 
              : <a onClick={() => { this.simpleAlert("confirm on")}} style={{color: 'red'}}><i className="zmdi zmdi-power"></i></a>
            }
          </Col>
          <Col sm={4}> <a onClick={this.resetService}><i className="zmdi zmdi-refresh"></i></a></Col>
          <Col sm={4}> 
            <a onClick={() => { this.openCustom("input", "ios") }}><i className="zmdi zmdi-wrench"></i></a>
            {/* <Ripple type="button" className="btn btn-primary" onClick={() => { this.openCustom("input", "ios") }}>Modal input</Ripple>&nbsp; */}
          </Col> 
        </Row>
        { /* Custom Modal with input */}
        <Modal show={this.state.custom.input} className="custom custom-right" dialogClassName={this.state.custom.entrance}>
          <div className="modal-header p-0">
            <div className="modal-header-bar">
              <Ripple type="button" className="navbar-toggle" onClick={() => { this.closeCustom("input", this.state.custom.entrance) }}>
                <i className="zmdi zmdi-arrow-right zmdi-hc-fw"></i>
              </Ripple>
              <div className="header-title-bar">Set Config Service {this.state.name}</div>
            </div>
          </div>
          <div className="card p-t-10">
            <div className="card-body has-input">
              <div className="col-xs-12 p-t-15">
                <div className="form-group rg-float">
                  <Input className="form-control input-sm" float="Name" name="name" defaultValue={this.props.config.name} active={this.props.config.name? "rg-toggled" : ""} onChange={this.onChangeConfig.bind(this)}/>
                </div>
                <div className="form-group rg-float">
                  <Input className="form-control input-sm" float="Command" name="cmd" defaultValue={this.props.config.cmd}  active={this.props.config.cmd? "rg-toggled" : ""} onChange={this.onChangeConfig.bind(this)}/>
                </div>
                <div className="form-group rg-float">
                  <Input className="form-control input-sm" float="Command Stop" name="cmd_stop" defaultValue={this.props.config.cmd_stop}  active={this.props.config.cmd_stop? "rg-toggled" : ""} onChange={this.onChangeConfig.bind(this)}/>
                </div>
                <div className="form-group rg-float">
                  <Input className="form-control input-sm" float="Directory"  name="dir" defaultValue={this.props.config.dir} active={this.props.config.dir? "rg-toggled" : ""} onChange={this.onChangeConfig.bind(this)}/>
                </div>
                <div className="form-group rg-float">
                  <Input className="form-control input-sm" float="Name Binary File"  name="bin" defaultValue={this.props.config.bin} active={this.props.config.bin? "rg-toggled" : ""}  onChange={this.onChangeConfig.bind(this)}/>
                </div>
                <div className="form-group rg-float">
                  <Input className="form-control input-sm" float="Name Script File"  name="script" defaultValue={this.props.config.script} active={this.props.config.script? "rg-toggled" : ""} onChange={this.onChangeConfig.bind(this)}/>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer has-input">
            <Ripple type="button" className="btn btn-primary btn-block" onClick={() => this.simpleAlert("confirm set config")}>Save</Ripple>
          </div>
        </Modal>
      </div>
    )
  }
} 