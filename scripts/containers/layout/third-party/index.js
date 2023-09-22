import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom'
import {Row, Col, Collapse, Well} from 'react-bootstrap'
import { GetAgents} from '../../../actions/core-action';
import HeaderModule from '../../../common/module-header'
import Ripple from '../../../components/ripple';
const config = require("../../../helper/config").config;
// const ROOT_URL = 'http://192.168.14.165:8000';
const PORT = 8000

class ThirdParty extends Component {
  constructor(props) {
		super(props);
    this.state = {
      toggleObE: true,
      toggleIOb: true,
      dataObE: [
        {
          name: "SIEM",
          type_app: "ObE",
          image: "siem-protect.png",
        },
        {
          name: "Notebooks",
          type_app: "ObE",
          image: "notebooks.png",
        },
        {
          name: "Dashboard classic",
          type_app: "ObE",
          image: "dashboard-classic.png",
        },
        {
          name: "Data explorer",
          type_app: "ObE",
          image: "data-explorer.png",
        },
        {
          name: "Logs and events",
          type_app: "ObE",
          image: "logs-and-events.png",
        },
        {
          name: "Smartscape topology",
          type_app: "ObE",
          image: "smart-scape-topology.png",
        },
      ],
      dataIOb: [
        {
          name: "Kubernetes",
          type_app: "IOb",
          image: "kubernetes.png",
        },
        {
          name: "Cloud Foundry",
          type_app: "IOb",
          image: "cloud-foundry.png",
        },
        {
          name: "AWS",
          type_app: "IOb",
          image: "aws-f1.png",
        },
        {
          name: "Azure",
          type_app: "IOb",
          image: "azure.png",
        },
        {
          name: "GCP",
          type_app: "IOb",
          image: "gcp.png",
        },
        {
          name: "VMware",
          type_app: "IOb",
          image: "vmware.png",
        },
        {
          name: "Hosts",
          type_app: "IOb",
          image: "hosts-cloud.png",
        },
        {
          name: "Host networking",
          type_app: "IOb",
          image: "host-networking.png",
        },
      ]
		}

    this.parserPath = this.parserPath.bind(this)
  }

  async componentDidMount() {
    try {

      await GetAgents(this.props.dispatch)
    } catch(e) {
      console.log(e);
    }
  }

  parserPath(str) {
    const path = str.replaceAll(" ", "-")
    return path.toLowerCase()
  }

  render() {
    return (
      <Fragment>
				<HeaderModule text="Third Parties"/>

        { /* Observe and explore */}
        <Row>
					<Col sm={12}>
						<div className="card go-social">
							<div className="card-header">
                <Row>
                  <Col sm={6}>
                    <h2>Observe and explore
                      <small>
                        <a className="c-gray" target="_blank" href="#">More</a>
                      </small>
                    </h2>
                  </Col>
                  <Col sm={6}>
                    <Ripple type="button" className="btn btn-primary pull-right" onClick={() => this.setState({ toggleObE: !this.state.toggleObE })}>
                      Toggle Collapse
                    </Ripple>
                  </Col>
                </Row>
                <div className="hr-toggle"/>
							</div>
								<Collapse in={this.state.toggleObE}>
                  <div className="card-body card-padding clearfix">
										{/* <Well>
											Nunc nec porta felis. Curabitur non fringilla ipsum, quis mollis metus. Etiam mauris elit, iaculis quis dapibus et, luctus id erat. Sed ac rutrum est, a bibendum nibh. Phasellus rhoncus imperdiet neque in tincidunt. Fusce nibh tellus, laoreet a orci in, auctor semper leo. Sed turpis odio, lobortis in orci et, finibus placerat nulla. Maecenas vehicula ante sit amet lacus placerat, non congue nibh tristique.
            				</Well> */}
                    {this.state.dataObE.map((item, i) => (
                      <div className="col-xs-2 system-app" key={i} >
                        <NavLink className="sub" to={`/systems/third-party/${this.parserPath(item.name)}`}>
                          <div className='icon-app'>
                            <img className="img-responsive img-icon-app" src={`${config.asset_url}/assets/img/systems/explore/${item.image}`}/>
                          </div>
                          <div className='name-app'>
                            <div>{item.name}</div>
                          </div>
                        </NavLink>
                      </div>
                    ))}
									</div>
								</Collapse>
						</div>
					</Col>
        </Row>

        {/* Infrastructure Observability */}
        <Row>
					<Col sm={12}>
						<div className="card go-social">
							<div className="card-header">
                <Row>
                  <Col sm={6}>
                    <h2>Infrastructure Observability
                      <small>
                        <a className="c-gray" target="_blank" href="#">More</a>
                      </small>
                    </h2>
                  </Col>
                  <Col sm={6}>
                    <Ripple type="button" className="btn btn-primary pull-right" onClick={() => this.setState({ toggleIOb: !this.state.toggleIOb })}>
                      Toggle Collapse
                    </Ripple>
                  </Col>
                </Row>
                <div className="hr-toggle"/>
							</div>
								<Collapse in={this.state.toggleIOb}>
                  <div className="card-body card-padding clearfix">
										{/* <Well>
											Nunc nec porta felis. Curabitur non fringilla ipsum, quis mollis metus. Etiam mauris elit, iaculis quis dapibus et, luctus id erat. Sed ac rutrum est, a bibendum nibh. Phasellus rhoncus imperdiet neque in tincidunt. Fusce nibh tellus, laoreet a orci in, auctor semper leo. Sed turpis odio, lobortis in orci et, finibus placerat nulla. Maecenas vehicula ante sit amet lacus placerat, non congue nibh tristique.
            				</Well> */}

                    {this.state.dataIOb.map((item, i) => (
                      <div className="col-xs-2 system-app" key={i}>
                        <div className='icon-app'>
                          <img className="img-responsive img-icon-app" src={`${config.asset_url}/assets/img/systems/infrastructure/${item.image}`}/>
                        </div>
                        <div className='name-app'>
                          <div>{item.name}</div>
                        </div>
                      </div>
                    ))}
									</div>
								</Collapse>
						</div>
					</Col>
        </Row>
        {/* Automations */}
        <div className="card">
          <div className="card-header ch-alt">
            <h2>
              Automations
            </h2>
          </div>
          <div className="card-body card-padding">
          </div>
        </div>
        {/* Application Observability */}
        <div className="card">
          <div className="card-header ch-alt">
            <h2>
              Application Observability
            </h2>
          </div>
          <div className="card-body card-padding">
          </div>
        </div>
        {/* Application Security */}
        <div className="card">
          <div className="card-header ch-alt">
            <h2>
              Application Security
            </h2>
          </div>
          <div className="card-body card-padding">
          </div>
        </div>
        {/* Business Analytics */}
        <div className="card">
          <div className="card-header ch-alt">
            <h2>
              Business Analytics
            </h2>
          </div>
          <div className="card-body card-padding">
          </div>
        </div>
        {/* Manage */}
        <div className="card">
          <div className="card-header ch-alt">
            <h2>
              Manage
            </h2>
          </div>
          <div className="card-body card-padding">
          </div>
        </div>
			</Fragment>
    )
  }
}

const mapStateToProps = (state) => {
	return {
		auth: state.auth,
	};
}

export default connect(mapStateToProps)(ThirdParty);