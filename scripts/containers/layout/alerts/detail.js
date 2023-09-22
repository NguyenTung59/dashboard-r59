import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import HeaderModule from '../../../common/module-header';
import { Row, Col} from 'react-bootstrap';
import { getAlerts, updateAlert } from '../../../actions/alert-action';
import Ripple from '../../../components/ripple';
import { Input } from '../../../components/input';

class AlertDetail extends Component {
	constructor(props) {
		super(props)
		this.state = {
      data: this.props.alerts.data,
      alert_sid: "",
      alert: this.props.alerts.alert
    }

		this.convertSeverity = this.convertSeverity.bind(this);
		this.convertPriority = this.convertPriority.bind(this);
	}

	async componentDidMount() {
    let sid = new URLSearchParams(this.props.location.search).get("sid")
    let notify_id = new URLSearchParams(this.props.location.search).get("notify_id")
    this.setState({
      alert_sid: sid
    })
		try {
			let alerts = await getAlerts(this.props.dispatch, {body: { notify_id: notify_id, alert: {signature_id: parseInt(sid)}}})
      if (alerts.length > 0) {
        this.setState({
          data: alerts,
          alert: alerts[0]
        })
      }

		} catch (err) {
			console.log("Error Alert: ", err)
		}
	}

  convertSeverity(severity) {
		switch (severity) {
			case 0:
				return <Col className='bgm-lightgreen text-center c-white' sm={6}>Low</Col>
			case 1:
				return <Col className='bgm-amber text-center c-black' sm={6}>Medium</Col>
			case 2:
				return <Col className='bgm-orange text-center c-white' sm={6}>High</Col>
			default:
				return <Col className='bgm-deeporange text-center c-white' sm={6}>Critical</Col>
		}
	}

  convertPriority(priority) {
		switch (priority) {
			case 1:
				return <Col className='bgm-lightgreen text-center c-white'>Processed</Col>
			default:
				return <Col className='bgm-deeporange text-center c-white'>Processing</Col>
    }
	}

  async onChangeProcess(priority) {
    let prior = parseInt(priority)
    let alert = {
      ...this.state.alert
    }
      if (prior == 1) {
        alert.priority = 0
        this.setState({
          alert: alert
        })
        await updateAlert(this.props.dispatch, {body: alert})
      } else {
        alert.priority = 1
        this.setState({
          alert: alert
        })
        await updateAlert(this.props.dispatch, {body: alert})
      }
  }

  render() {
    const alert = this.state.alert
    return (
			<Fragment>
				<HeaderModule text="Alert Detail">
					{/* <small> */}
						{/* https://react-table.js.org/#/story/readme */}
						{/* <a href="#" target="_blank">Read More...</a>  */}
					{/* </small> */}
				</HeaderModule>
				<Row>
					<Col sm={6}>
						<div className="card">
							<div className="card-header ch-alt">
								<h2>Alert Info </h2>
							</div>
              <div className="card-body card-padding">
                  <Row className="pmo-contact">
                    <Col sm={7} className='alert-detail alert-info-detail'>
                      <Col sm={4} className='alert-detail-label'>
                        <ul>
                          <li className="ng-binding">Sid</li>
                          <li className="ng-binding">Time</li>
                          <li className="ng-binding">Type</li>
                          <li className="ng-binding">Action</li>
                          <li className="ng-binding">Category</li>
                          <li className="ng-binding">Source</li>
                          <li className="ng-binding">Severity</li>
                        </ul>
                      </Col>
                      <Col sm={8} className='alert-detail-value'>
                        <ul>
                          <li className="ng-binding"> {alert.alert ? alert.alert.signature_id : this.state.alert_sid}</li>
                          <li className="ng-binding"> {alert ? alert.timestamp : ""}</li>
                          <li className="ng-binding"> {alert ? alert.event_type : ""}</li>
                          <li className="ng-binding"> {alert.alert ? alert.alert.action : ""}</li>
                          <li className="ng-binding"> {alert.alert ? alert.alert.category : ""}</li>
                          <li className="ng-binding"> {alert ? alert.source : ""}</li>
                          <li className="ng-binding"> {alert.alert ? this.convertSeverity(alert.alert.severity) : ""}</li>
                        </ul>
                      </Col>
                    </Col>
                    <Col sm={5}  className='alert-detail'>
                      <Col sm={5} className='alert-detail-label'>
                        <ul>
                          <li className="ng-binding">Src IP</li>
                          <li className="ng-binding">Src Port</li>
                          <li className="ng-binding">Dest IP</li>
                          <li className="ng-binding">Dest Port</li>
                          <li className="ng-binding">Protocol</li>
                          <li className="ng-binding">App Proto</li>
                          <li className="ng-binding">Status</li>
                        </ul>
                      </Col>
                      <Col sm={7} className='alert-detail-value'>
                        <ul>
                          <li className="ng-binding"> {alert ? alert.src_ip : ""}</li>
                          <li className="ng-binding"> {alert ? alert.src_port : ""}</li>
                          <li className="ng-binding"> {alert ? alert.dest_ip : ""}</li>
                          <li className="ng-binding"> {alert ? alert.dest_port : ""}</li>
                          <li className="ng-binding"> {alert ? alert.proto : ""}</li>
                          <li className="ng-binding"> {alert ? alert.app_proto : ""}</li>
                          <li className="ng-binding"> {alert ? this.convertPriority(alert.priority) : ""}</li>
                        </ul>
                      </Col>
                    </Col>
                  </Row>
              </div>
						</div>
					</Col>

          <Col sm={6}>
						<div className="card">
							<div className="card-header  ch-alt">
								<h2>IP Detail </h2>
							</div>
              <div className="card-body card-padding">
                <Row className='ip-detail-center'>
                  <Col sm={3}>
                    <div className='ip-detail-label'>Destination IP</div>
                  </Col>
                  <Col sm={9}>
                    <Col sm={4} className='text-center'><Ripple type="button" className="btn btn-primary" >Virustotal</Ripple></Col>
                    <Col sm={4} className='text-center'><Ripple type="button" className="btn btn-primary" >Info.io</Ripple></Col>
                    <Col sm={4} className='text-center'><Ripple type="button" className="btn btn-primary" >Info.io</Ripple></Col>
                  </Col>
                </Row>
                <Row className='ip-detail-center pmo-contact'>
                  <Col sm={3}>
                    <div className='ip-detail-label'>Source IP</div>
                  </Col>
                  <Col sm={9} className='alert-detail z-depth-src-ip'>
                    <Col sm={5} className='alert-detail-label'> 
                        <ul>
                          <li className="ng-binding ">Device's Name: </li>
                          <li className="ng-binding">Device's Type: </li>
                          <li className="ng-binding">Note: </li>
                        </ul>
                      </Col>
                      <Col sm={7} className='alert-detail-value'>
                        <ul>
                          <li className="ng-binding"></li>
                          <li className="ng-binding"></li>
                          <li className="ng-binding"></li>
                        </ul>
                      </Col>
                  </Col>
                </Row>
              </div>
						</div>
					</Col> 
				</Row>
        {/* signatures */}
        <div className="card">
          <div className="card-header ch-alt">
            <h2>Signatures </h2>
          </div>
          <div className="card-body card-padding">
            <Row>
              <Col sm={12}>
                <div>{alert.alert ? alert.alert.signature : ""}</div>
              </Col>
              <Col sm={12}>
                <div className='pull-right'>
                  {
                    alert.priority == 0 
                    ? <Ripple type="button" className="btn bgm-lightgreen m-r-10" onClick={this.onChangeProcess.bind(this, alert.priority)}>Processed</Ripple>
                    : <Ripple type="button" className="btn bgm-deeporange m-r-10" onClick={this.onChangeProcess.bind(this, alert.priority)}>Processing</Ripple>
                  }
                  <Ripple type="button" className="btn btn-warning m-r-10 m-l-10" >Edit</Ripple>
                  <Ripple type="button" className="btn btn-primary m-r-10 m-l-10" >Create</Ripple>
                  <Ripple type="button" className="btn btn-gray m-l-10" >Cancel</Ripple>
                  </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* logwork history*/}
        <div className="card">
          <div className="card-header ch-alt">
            <h2>Logwork </h2>
          </div>
          <div className="card-body card-padding">
            <form className="form-horizontal" role="form">
              <div className="form-group">
                <label htmlFor="inputEmail3" className="col-sm-2 control-label">Comment</label>
                <div className="col-sm-10">
                  <Input className="form-control" placeholder="comment" />
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                  <Ripple type="button" className="btn btn-primary btn-sm">Submit</Ripple>
                </div>
              </div>
            </form>
          </div>
        </div>
			</Fragment>
		)
  }

}

const mapStateToProps = (state) => {
	return {
		auth: state.auth,
    cores: state.cores,
    alerts: state.alerts,
	};
}

export default connect(mapStateToProps)(AlertDetail);