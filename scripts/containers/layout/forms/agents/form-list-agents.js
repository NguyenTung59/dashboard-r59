import React, {Component} from "react";
import {Row, Col} from 'react-bootstrap'
// import { connect } from 'react-redux';
import { GetProcessCore, GetProcessExporters, GetSystemInfo, GetAgents, DeRegisterAgent, GetConfigServices } from '../../../../actions/core-action';
import AddAgent from './form-add-agent'
import {makeSwal} from '../../utilities/utility'

// const config = require("../helper/config").config;
const notify = require("../../../../helper/notify").notify;

const PORT = 8000

export default class ListAgents extends Component {
  constructor(props) {
    super(props),
    this.state = {
      name: this.props.service.name,
      process_name: this.props.service.process_name,
      current_agent: this.props.cores.agents[this.props.service.id_agent],
    }
    // this.onSwitchAgent = this.onSwitchAgent.bind(this)
  }

  // async componentDidMount() {
  //   try {
  //     const agents = await GetAgents(this.props.dispatch)
  //     console.log(agents)
  //   } catch(e) {
  //     console.log(e)
  //   }
  // }

  onSwitchAgent(hostname, ip){
    // if (ip != this.state.current_agent.ip) {
      // if (this.props.scheduler_task.length > 0){
      //   this.props.scheduler_task.map((task, i) => {
      //     clearInterval(task.id)
      //   })
      // }
      // console.log(this.state.name.toUpperCase())
      // this.props.dispatch({type: `SET_${this.state.name.toUpperCase()}_ENABLED`, payload: {enabled: false}})
    // }

    this.props.cores.agents.map(async (a, i) => {
      if (a.name == hostname) {
        this.setState({
          current_agent: a
        })
        this.props.dispatch({ type: `GET_CURRENT_AGENT_${this.state.name.toUpperCase()}`, payload: {id_current_agent: i} })
        await GetConfigServices(this.props.dispatch, {ip: a.ip, name: this.state.name, url: `http://192.168.14.165:${PORT}`})
        if (this.state.name == "exporter") {
          const list_exporters = await GetProcessExporters(this.props.dispatch, {url: `http://${a.ip}:${PORT}`})
          await GetSystemInfo(this.props.dispatch, {url: `http://${a.ip}:${PORT}`})
          if (list_exporters.length > 0) {
            this.props.dispatch({ type: 'GET_CURRENT_EXPORTER', payload: list_exporters[0] });
          }
        } else if (this.state.name == "process"){
          await GetProcessCore(this.props.dispatch, {name: this.state.process_name, url: `http://${a.ip}:${PORT}`});
        } else {
          await GetProcessCore(this.props.dispatch, {name: this.state.name, url: `http://${a.ip}:${PORT}`});
        }
      }
    })
  }

  async onRemoveAgent(guid, ip) {
    // var arr = []
    // for (var i=0; i < this.props.cores.agents.length; i++) {
    //   if (ip != this.props.cores.agents[i].ip) {
    //     arr.push(this.props.cores.agents[i])
    //   }
    // }

    const result = await DeRegisterAgent({body: {guid: guid}, url: `http://192.168.14.165:${PORT}`})
    // console.log("result ", result)
    if (result) {
      // this.props.dispatch({ type: 'GET_AGENTS', payload: {agents: arr} });
      await GetAgents(this.props.dispatch)
      makeSwal({type: "success", msg: `remove agent success`})
    } else {
      makeSwal({type: "error", msg: `remove agent error`})
    }

  }

  simpleAlert(type, guid, ip) {
		if (type == 'alert'){
			notify.alert("This is basic alert")
		} else if (type == 'confirm remove') {
      if (ip == "192.168.14.151" || ip == "192.168.14.165") {
        notify.confirm({
          "title": "Are you sure, you want to remove agent?",
          "left": "No",
          "right": "Yes",
          "fn": () => {
            if (this.props.auth.role == "admin") {
              this.onRemoveAgent(guid, ip)
            } else {
              makeSwal({type: "error", msg: `You are not have permission remove agent`})
            }
          }
        });
      } else {
        notify.confirm({
          "title": "Are you sure, you want to remove agent?",
          "left": "No",
          "right": "Yes",
          "fn": () => {
            this.onRemoveAgent(guid, ip)
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

  render() {
    const {cores} = this.props

    return (
      <div className="card">
        <div className="card-header ch-alt">
          <Row>
            <Col sm={6}>
              <h2>
                List Agent
              </h2>
            </Col>
            <Col sm={6}>
              <div className="pull-right">
                <AddAgent agents={this.props.cores.agents} dispatch={this.props.dispatch} current_agent={this.state.current_agent}/>
              </div>
            </Col>
          </Row>
         
        </div>
        <div className="card-body card-padding">
          <div className="scroll-list-custom" style={{maxHeight: "120px", overflow: "auto"}}>
            <Row className="notifications">
              {cores.agents.map((a, i) => (
                <Col key={i}>
                    <ul className="list-unstyled module-action">
                      <li>
                        <div>
                          <Col sm={9}>                        
                            <a onClick={this.onSwitchAgent.bind(this, a.name, a.ip)}><i className="zmdi zmdi-desktop-mac"></i>  {a.name}</a>
                          </Col>
                          <a onClick={() => this.simpleAlert("confirm remove", a.endpoint_guid, a.ip)}><i className="zmdi zmdi-delete c-red"></i>  </a>    
                          <a><i className="zmdi zmdi-wrench"></i></a>                      
                        </div>
                      </li>
                    </ul>
                </Col>)
              )}
            </Row>
            </div>
        </div>
      </div>
    )
  }
}
