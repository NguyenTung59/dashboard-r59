import React, {Component} from "react";
import Ripple from '../../../../components/ripple';
import { Input, Textarea, Select, Inputmask} from '../../../../components/input'
import {Row, Col, Modal} from 'react-bootstrap'
// import Spinner from 'react-bootstrap/Spinner';
import { RegisterNewAgent } from '../../../../actions/core-action';
import { makeSwal, makeNotifV1, makeNotifV2 } from "../../utilities/utility";

const PORT = 8000
const initAgent = {
  type: "",
  name: "",
  ip: "",
  port: "",
  user: "",
  password: "",
  method: "",
  url: "",
  add_default_group: false,
  default_group_name: "",
  agent_manager: true,
  fetch_metric: false,
  // step: 10,
  // exporter_address: "127.0.0.1",
  agent_address: "",
  agent_port: 19999,
  // cluster: "",
  // proxy_exporter: "",
  // process_name: "agent_exporter",
  // tags: "agent_exporter"
}


const agent_default = {
  type: "agent",
  name: "agent_manager",
  ip: "192.168.14.165",
  port: "19999",
  user: "root",
  password: "",
  method: "TCP",
  url: "http://192.168.14.165:19999/metrics",
  add_default_group: true,
  default_group_name: "default_agent_group",
  agent_manager: true,
  fetch_metric: true,
  // step: 10,
  // exporter_address: "127.0.0.1",
  agent_address: "192.168.14.165",
  agent_port: 19999,
}

export default class AddAgent extends Component {
  constructor(props) {
    super(props),
    this.state = {
      showPassword: false,
      classPassword: "zmdi zmdi-eye-off",
      default: false,
      loading: false,
      agent: initAgent,
      custom: {
				default: false,
				txt: false,
				input: false,
				scroll: false,
				entrance: ""
			},
    }
    // this.onAddAgent = this.onAddAgent.bind(this)
    this.openCustom = this.openCustom.bind(this);
		this.closeCustom = this.closeCustom.bind(this);
  }

  onChangeAgent(ev) {
    var {name, value} = ev.target

    if (name == "ip") {
        this.setState({
          agent: {
            ...this.state.agent,
            agent_address: value,
            url: `http://${value}:${this.state.agent.port}/metrics`,
            [name]: value
          }
        })
    } else if (name == "port") {
      this.setState({
        agent: {
          ...this.state.agent,
          agent_port: parseInt(value),
          url: `http://${this.state.agent.ip}:${value}/metrics`,
          [name]: value
        }
      })
    } else {
      this.setState({
        agent: {
          ...this.state.agent,
          url: `http://${this.state.agent.ip}:${this.state.agent.port}/metrics`,
          [name]: value
        }
      })
    }
  }

  async onAddAgent() {
    // console.log(this.state.agent)
    var agents = this.props.agents
    var checkAgent = false
    var alert = {
      reminder: "",
      type: "",
      from: "top",
      align: "right",
      message: "This is done",
      timeout: 5000,
      title: "Add Agent",
      icon: "zmdi zmdi-notifications-active zmdi-hc-fw",
      url: "",
      stop: false
    }

    for (var i=0; i < agents.length; i++) {
      if (this.state.agent.ip == agents[i].ip) {
        checkAgent = true
      }
    }
    this.setState({
      loading: true
    })
    this.closeCustom("input", this.state.custom.entrance)
    alert.reminder = "Add new agent "
    alert.type = "info"
    alert.message = "Wait, doing add new agent. Loading...."
    makeNotifV2(alert)
    const result = await RegisterNewAgent({body: this.state.agent, url: `http://192.168.14.165:${PORT}`})
    // console.log("result ", result)
    if (result) {
      if (!checkAgent) {
        agents.push(this.state.agent)
      }  
      this.props.dispatch({ type: 'GET_AGENTS', payload: {agents: agents} });
      alert.reminder = `Alert, add new agent success`
      alert.message = `Alert, add new agent success. Complete!!`
      alert.type = "success"
      // makeSwal({type: "success", msg: `Add agent success`})
    } else {
      alert.reminder = `Alert, add new agent faild`
      alert.message = `Alert, add new agent faild. Error!!`
      alert.type = "danger"
      // makeSwal({type: "error", msg: `Add agent faild`})
    }
    this.setState({
      loading: false
    })
    makeNotifV2(alert)
  }

  onDefaultAgent(ev) {
    if (ev.target.checked) {
      this.setState({
        ...this.state,
        agent: {
          type: this.state.agent.type ? this.state.agent.type : agent_default.type,
          name: this.state.agent.name ? this.state.agent.name : agent_default.name,
          ip: this.state.agent.ip ? this.state.agent.ip : agent_default.ip,
          port: this.state.agent.port ? this.state.agent.port : agent_default.port,
          user: this.state.agent.user ? this.state.agent.user : agent_default.user,
          password: this.state.agent.password ? this.state.agent.password : agent_default.password,
          method: this.state.agent.method ? this.state.agent.method : agent_default.method,
          add_default_group: this.state.agent.add_default_group ? this.state.agent.add_default_group : agent_default.add_default_group,
          default_group_name: this.state.agent.default_group_name ? this.state.agent.default_group_name : agent_default.default_group_name,
          fetch_metric: this.state.agent.fetch_metric ? this.state.agent.fetch_metric : agent_default.fetch_metric,
        },
      })
    }

    if (!ev.target.checked) {
        this.setState({
          ...this.state,
          agent: {
            type: this.state.agent.type == agent_default.type ? initAgent.type : this.state.agent.type,
            name: this.state.agent.name == agent_default.name ? initAgent.name : this.state.agent.name,
            ip: this.state.agent.ip == agent_default.ip ? initAgent.ip : this.state.agent.ip,
            port: this.state.agent.port == agent_default.port ? initAgent.port : this.state.agent.port,
            user: this.state.agent.user == agent_default.user ? initAgent.user : this.state.agent.user,
            password: this.state.agent.password == agent_default.password ? initAgent.password : this.state.agent.password,
            method: this.state.agent.method == agent_default.method ? initAgent.method : this.state.agent.method,
            add_default_group: this.state.agent.add_default_group == agent_default.add_default_group ? initAgent.add_default_group : this.state.agent.add_default_group,
            default_group_name: this.state.agent.default_group_name == agent_default.default_group_name ? initAgent.default_group_name : this.state.agent.default_group_name,
            fetch_metric: this.state.agent.fetch_metric == agent_default.fetch_metric ? initAgent.fetch_metric : this.state.agent.fetch_metric,
          },
        })
    }
  }

  // onCleanAgent(ev) {
  //   if (ev.target.checked && this.state.agent == initAgent) {
  //     this.setState({
  //       ...this.state,
  //       agent: agent_default,
  //       default: ev.target.checked
  //     })
  //   }
  // }

  onCheckbox(ev) {
    var {name, checked} = ev.target
    this.setState({
      agent: {
        ...this.state.agent,
        [name]: checked
      }
    })
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
			},
      agent: initAgent
		})
	}

  onShowPassword() {
    if (!this.state.showPassword) {
      this.setState({
        classPassword: "zmdi zmdi-eye",
        showPassword: !this.state.showPassword
      })
    } else {
      this.setState({
        classPassword: "zmdi zmdi-eye-off",
        showPassword: !this.state.showPassword
      })
    }
  }

  render() {
    // const {cores} = this.props
    // var newAgent = this.state.agent

    // if (this.state.default) {
    //   newAgent = agent_default
    // } else {
    //   newAgent = this.state.agent
    // }
    // console.log(this.state.agent)


    return (
      <div>
        {/* <Ripple type="button" className="btn btn-info" onClick={(event) => { makeNotifV1(event) }} data-message={"Adding new agent ... "} data-type="info" data-from="top" data-align="right">Info</Ripple> */}
        { this.state.loading ? <Ripple type="button" className="btn btn-primary" >Loading...</Ripple> : <Ripple type="button" className="btn btn-primary" onClick={() => { this.openCustom("input", "ios") }} >New Agent</Ripple>}
        { /* Custom Modal with input */}
        <Modal show={this.state.custom.input} className="custom custom-right" dialogClassName={this.state.custom.entrance}>
          <div className="modal-header p-0">
            <div className="modal-header-bar">
              <Ripple type="button" className="navbar-toggle" onClick={() => { this.closeCustom("input", this.state.custom.entrance) }}>
                <i className="zmdi zmdi-arrow-right zmdi-hc-fw"></i>
              </Ripple>
              <div className="header-title-bar">New Agent</div>
            </div>
          </div>
          <div className="card p-t-10">
            <div className="card-body has-input">
              <div className="col-xs-12 p-t-15">
                <Row>
                  <Col sm={6}>
                    <div className="checkbox">
                      <label>
                        <input type="checkbox" onChange={this.onDefaultAgent.bind(this)} disabled={this.state.default}/>
                        <i className="input-helper"></i>
                        Agent Default
                      </label>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6}>
                    <p className="c-gray">Type</p>
                    <div className="form-group rg-float">
                      <Select className="form-control" value={this.state.agent.type} name="type" onChange={this.onChangeAgent.bind(this)}>
                        <option value="">-- Select an Option--</option>
                        <option value="agent">Agent</option>
                        <option value="exporter">Exporter</option>
                        <option value="process">Process</option>
                        <option value="service">Services</option>
                        <option value="other">Other</option>
                      </Select>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <p className="c-gray">Method</p>
                    <div className="form-group">
                      <Select className="form-control" value={this.state.agent.method} name="method" onChange={this.onChangeAgent.bind(this)}>
                        <option value="">-- Select an Option--</option>
                        <option value="TCP">TCP</option>
                        <option value="UDP">UDP</option>
                      </Select>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6}>
										<div className="form-group  rg-float">
                      <Input className="form-control input-sm" float="IP" name="ip" defaultValue={this.state.agent.ip} active={this.state.agent.ip? "rg-toggled" : ""} onChange={this.onChangeAgent.bind(this)}/>
                      {/* <Inputmask className="form-control" mask="999.999.999.999" float="IP" name="ip" defaultValue={this.state.agent.ip} active={this.state.agent.ip? "rg-toggled" : ""} onChange={this.onChangeAgent.bind(this)}/> */}
										</div>
									</Col>
									<Col sm={6}>
										<div className="form-group  rg-float">
                      <Input className="form-control input-sm" float="Port" name="port" defaultValue={this.state.agent.port} active={this.state.agent.port? "rg-toggled" : ""} onChange={this.onChangeAgent.bind(this)}/> 
										</div>
									</Col>
                </Row>
                <Row>
                  <Col sm={6}>
                    <div className="form-group rg-float">
                      <Input className="form-control input-sm" float="Name" name="name" defaultValue={this.state.agent.name} active={this.state.agent.name? "rg-toggled" : ""} onChange={this.onChangeAgent.bind(this)}/>
                    </div>
                  </Col>
                  <Col sm={6}>
										<div className="checkbox">
                      <label>
												<input type="checkbox" name="fetch_metric" checked={this.state.agent.fetch_metric} onChange={this.onCheckbox.bind(this)}/>
												<i className="input-helper"></i>
												Fetch Metrics
											</label>
										</div>
									</Col>
                </Row>
                
                <Row>
                  <Col sm={6}>
                    <div className="form-group rg-float">
                      <Input className="form-control input-sm" float="User" name="user" defaultValue={this.state.agent.user}  active={this.state.agent.user? "rg-toggled" : ""} onChange={this.onChangeAgent.bind(this)}/>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form-group rg-float">
                      <Input className="form-control input-sm" float="Password" type={this.state.showPassword ? 'text' : 'password'} name="password" defaultValue={this.state.agent.password} active={this.state.agent.password? "rg-toggled" : ""} onChange={this.onChangeAgent.bind(this)}/>
                      <a style={{position: "absolute"}} onClick={this.onShowPassword.bind(this)}><i className={this.state.classPassword}></i></a>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6}>
                    <div className="form-group rg-float">
                      <Input className="form-control input-sm" float="Group Name"  name="default_group_name" defaultValue={this.state.agent.default_group_name} active={this.state.agent.default_group_name? "rg-toggled" : ""}  onChange={this.onChangeAgent.bind(this)}/>
                    </div>
                  </Col>
                  <Col sm={6}>
										<div className="checkbox">
											<label>
												<input type="checkbox" name="add_default_group" checked={this.state.agent.add_default_group} onChange={this.onCheckbox.bind(this)}/>
												<i className="input-helper"></i>
												Add Default Group
											</label>
										</div>
									</Col>
                </Row>

                {/* <Row>
                  <Col sm={6}>
										<div className="checkbox">
											<label>
												<input type="checkbox" name="fetch_metric" onChange={this.onCheckbox.bind(this)}/>
												<i className="input-helper"></i>
												Fetch Metrics
											</label>
										</div>
									</Col>
                </Row> */}
              </div>
            </div>
          </div>
          <div className="modal-footer has-input">
            <Ripple type="button" className="btn btn-primary btn-block" onClick={this.onAddAgent.bind(this)} data-add-new={true} data-type="success" data-from="top" data-align="right">Add New</Ripple>
          </div>
        </Modal>
      </div>
    )
  }
}
