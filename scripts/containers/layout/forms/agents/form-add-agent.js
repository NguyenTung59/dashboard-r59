import React, {Component} from "react";
import Ripple from '../../../../components/ripple';
import { Input, Textarea, Select } from '../../../../components/input'
import {Row, Col, Modal} from 'react-bootstrap'
import { GetProcessCore, GetProcessExporters, GetSystemInfo } from '../../../../actions/core-action';

const PORT = 8000

export default class AddAgent extends Component {
  constructor(props) {
    super(props),
    this.state = {
      agent: {
        type: "agent",
        name: "agent_manager",
        ip: "192.168.14.151",
        port: "19999",
        user: "root",
        password: "",
        method: "TCP",
        url: "http://192.168.14.151:19999/metrics",
        add_default_group: false,
        default_group_name: "default_agent_group",
        agent_manager: true,
        fetch_metric: true,
        step: 10,
        exporter_address: "127.0.0.1",
        agent_address: "192.168.14.151",
        agent_port: 19999,
        cluster: "",
        proxy_exporter: "",
        process_name: "agent_exporter",
        tags: "agent_exporter"
      },
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
    this.setState({
			agent: {
        ...this.state.agent,
				[name]: value
			}
		})
  }

  onAddAgent() {
    console.log(this.state.agent)
  }

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
			}
		})
	}

  render() {
    // const {cores} = this.props

    return (
      <div>
        <Ripple type="button" className="btn btn-primary" onClick={() => { this.openCustom("input", "ios") }}>New Agent</Ripple>&nbsp;
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
                    <p className="c-black f-500 m-b-20">Type</p>
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
                      <p className="c-black f-500 m-b-20">Method</p>
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
												<input type="checkbox" name="agent_manager" onChange={this.onCheckbox.bind(this)}/>
												<i className="input-helper"></i>
												Agent Manager
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
                      <Input className="form-control input-sm" float="Password" type="password" name="password" defaultValue={this.state.agent.password} active={this.state.agent.password? "rg-toggled" : ""} onChange={this.onChangeAgent.bind(this)}/>
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
												<input type="checkbox" name="add_default_group" onChange={this.onCheckbox.bind(this)}/>
												<i className="input-helper"></i>
												Add Default
											</label>
										</div>
									</Col>
                </Row>

                <Row>
                  <Col sm={6}>
										<div className="checkbox">
											<label>
												<input type="checkbox" name="fetch_metric" onChange={this.onCheckbox.bind(this)}/>
												<i className="input-helper"></i>
												Fetch Metrics
											</label>
										</div>
									</Col>
                </Row>
              </div>
            </div>
          </div>
          <div className="modal-footer has-input">
            <Ripple type="button" className="btn btn-primary btn-block" onClick={this.onAddAgent.bind(this)}>Create</Ripple>
          </div>
        </Modal>
      </div>
    )
  }
}
