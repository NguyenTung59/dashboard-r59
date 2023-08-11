import React, {Component} from "react";
import {Row, Col} from 'react-bootstrap'
// import { connect } from 'react-redux';
import { GetProcessCore, GetProcessExporters, GetSystemInfo } from '../../../../actions/core-action';
import AddAgent from './form-add-agent'

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
  //   } catch(e) {
  //     console.log(e)
  //   }
  // }

  onSwitchAgent(hostname){
    this.props.cores.agents.map(async (a, i) => {
      if (a.name == hostname) {
        this.setState({
          current_agent: a
        })
        this.props.dispatch({ type: `GET_CURRENT_AGENT_${this.state.name.toUpperCase()}`, payload: {id_current_agent: i} })
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
                <AddAgent/>
              </div>
            </Col>
          </Row>
         
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
    )
  }
}
