import React , {Component} from "react"
import { GetProcessCore, StartProcessCore, StopProcessCore } from '../actions/core-action';
import {Row, Col, Modal} from 'react-bootstrap'
import { Input } from './input'
import Ripple from './ripple';
import swal from 'sweetalert';

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
        name: this.props.config.name,
        cmd: this.props.config.cmd,
        dir: this.props.config.dir,
        bin: this.props.config.bin,
        script: this.props.config.script
      }
    }

    this.openCustom = this.openCustom.bind(this);
		this.closeCustom = this.closeCustom.bind(this);
  }

  async turnOffService(pid) {
    console.log(this.props.current_process)
    try {
      let current_agent = this.props.current_agent
      this.setState({
        loading: true
      })
  
      const result = await StopProcessCore(this.props.dispatch, {
        body : {
          pid: pid
        },
        url: `http://${current_agent.ip}:${PORT}` 
      })
      if (result) {
        this.makeSwal({type: "success", msg: `Power off process ${this.state.name} with pid=${this.state.pid}`})
      } else {
        this.makeSwal({type: "error", msg: `Power off process ${this.state.name} with pid=${this.state.pid}`})
      }
      await GetProcessCore(this.props.dispatch, {name: this.props.service.name, url: `http://${current_agent.ip}:${PORT}`});
    } catch (error) {
      this.makeSwal({type: "error", msg: error})
    }
  }

  async turnOnService() {
    console.log(this.props.current_process)
    try {
      let current_agent = this.props.current_agent
      this.setState({
        loading: true
      })
  
      const result = await StartProcessCore(this.props.dispatch, {
        body : {
          name: this.state.config.name,
          cmd: this.state.config.command,
          dir: this.state.config.dir,
          script: this.state.config.script,
          bin: this.state.config.bin
        },
        url: `http://${current_agent.ip}:${PORT}` 
      })
      if (result) {
        this.makeSwal({type: "success", msg: `Power on process ${this.state.name}`})
      } else {
        this.makeSwal({type: "error", msg: `Power on process ${this.state.name}`})
      }
      await GetProcessCore(this.props.dispatch, {name: this.props.service.name, url: `http://${current_agent.ip}:${PORT}`});
      this.setState({loading: false})
    } catch (error) {
      this.makeSwal({type: "error", msg: error})
    }

  }
  
  resetService() {
    console.log("reset censor ")
  }

  configService() {
    console.log("config censor")
  }
  
	makeSwal(action){
		if (action.type == 'basic') {
			swal("Here's a message!");
		} else if (action.type == 'txt') {
			swal("Here's a message!", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lorem erat, tincidunt vitae ipsum et, pellentesque maximus enim. Mauris eleifend ex semper, lobortis purus sed, pharetra felis")
		} else if (action.type == 'success') {
			swal("Good job!", action.msg, "success")
		} else if (action.type == 'error') {
			swal("Failed!", action.msg, "error")
		} else if (action.type == 'warning') {
			swal({
				title: "Are you sure?",
				text: "Once deleted, you will not be able to recover this imaginary file!",
				icon: "warning",
				buttons: true,
				dangerMode: true,
			}).then((willDelete) => {
				if (willDelete){
					swal("Deleted!", "Your imaginary file has been deleted.", "success")
				}
			});
		} else if (action.type == 'param') {
			swal({
				title: "Are you sure?",
				text: "Once deleted, you will not be able to recover this imaginary file!",
				icon: "warning",
				buttons: true,
				dangerMode: true,
			}).then((willDelete) => {
				if (willDelete) {
					swal("Poof! Your imaginary file has been deleted!", {
						icon: "success",
					});
				} else {
					swal("Cancelled", "Your imaginary file is safe :)", "error");
				}
			});
		} else if (action.type == 'img') {
			swal({
				title: "Sweet!",
				text: "Here's a custom image.",
				icon: config.asset_url +"/assets/img/thumbs-up.png"
			});
		} else if (action.type == 'timer') {
			swal({
				title: "Auto close alert!",
				text: "I will close in 2 seconds.",
				timer: 2000,
				button: false
			});
		}
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
            // this.turnOffService(pid)
            this.makeSwal({type: "error", msg: `You are not have permission power off process ${this.state.name}`})
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
          "title": "Are you sure, you want to power off?",
          "left": "No",
          "right": "Yes",
          "fn": () => {
            // this.turnOffService(pid)
            this.makeSwal({type: "error", msg: `You are not have permission start process ${this.state.name}`})
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

  onSaveConfig() {
    console.log(this.state.config)
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
              ? <a onClick={() => { this.simpleAlert("confirm off", this.props.service.pid) }} style={{color: 'cyan'}}><i className="zmdi zmdi-power"></i></a> 
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
                  <Input className="form-control input-sm" float="Name" name="name" defaultValue={this.state.config.name} active={this.state.config.name? "rg-toggled" : ""} onChange={this.onChangeConfig.bind(this)}/>
                </div>
                <div className="form-group rg-float">
                  <Input className="form-control input-sm" float="Command" name="cmd" defaultValue={this.state.config.cmd}  active={this.state.config.cmd? "rg-toggled" : ""} onChange={this.onChangeConfig.bind(this)}/>
                </div>
                <div className="form-group rg-float">
                  <Input className="form-control input-sm" float="Directory"  name="dir" defaultValue={this.state.config.dir} active={this.state.config.dir? "rg-toggled" : ""} onChange={this.onChangeConfig.bind(this)}/>
                </div>
                <div className="form-group rg-float">
                  <Input className="form-control input-sm" float="Name Binary File"  name="bin" defaultValue={this.state.config.bin} active={this.state.config.bin? "rg-toggled" : ""}  onChange={this.onChangeConfig.bind(this)}/>
                </div>
                <div className="form-group rg-float">
                  <Input className="form-control input-sm" float="Name Script File"  name="script" defaultValue={this.state.config.script} active={this.state.config.script? "rg-toggled" : ""} onChange={this.onChangeConfig.bind(this)}/>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer has-input">
            <Ripple type="button" className="btn btn-primary btn-block" onClick={this.onSaveConfig.bind(this)}>Save</Ripple>
          </div>
        </Modal>
      </div>
    )
  }
} 