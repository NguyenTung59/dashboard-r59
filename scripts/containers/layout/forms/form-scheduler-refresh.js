import React, { Component, Fragment } from 'react';
import ModuleHeader from '../../../common/module-header';
import { connect } from 'react-redux';

import { Input, Textarea, Select, AddOn, Inputmask, InputDate } from '../../../components/input'
import Switch from '../../../components/switch'

import { Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { initialState } from '../../../reducers/core';
import { Right } from 'react-bootstrap/lib/Media';

class FormSchedulerRefresh extends Component {
	constructor(props) {
		super(props)

		this.state = {
      service: this.props.location.pathname.split("/")[2].toUpperCase(),
      interval: this.props.service.interval,
      enabled: this.props.service.enabled,
      check_task: this.props.service.check_task,
      timer: this.props.service.timer,
      scheduler_task: [],
			start_date_blue: new Date(),
			start_date_input_a: new Date(),
		};
		this.handleChange_blue	=	this.handleChange_blue.bind(this)
		this.handleChangeInterval	=	this.handleChangeInterval.bind(this)
		this.onEnableScheduler	=	this.onEnableScheduler.bind(this)

	}

  componentDidMount() {
    let countdown_timer = setInterval(() => {
      // console.log("scheduler ... ", this.props.cores.censor_task, this.state.service)
      let now = new Date
      let timer = Math.round(this.state.start_date_blue.getTime() / 1000) - Math.round(now.getTime() / 1000)

      if (timer >= 0) {
        this.props.dispatch({type: `SET_${this.state.service}_TIMER`, payload: {timer: timer}})
        this.setState({
          timer: timer
        })
      } else {
        let after_one_hour = now.getTime() + (1000 * initialState.timer_default)
        let future = new Date(after_one_hour)
        this.setState({
          start_date_blue: future
        })
      }

    }, 1000)

    this.setState({
      scheduler_task: [
        {
          id: countdown_timer,
          name: "countdown_timer"
        }],
    })
  }

  componentWillUnmount() {
    if (this.state.scheduler_task.length > 0){
      this.state.scheduler_task.map((task, i) => {
        clearInterval(task.id)
      })
    }
  } 

  handleChangeInterval(ev) {
    const {name, value} = ev.target 
    this.setState({
      [name]: value
    })
  }

	handleChange_blue(date) {
		this.setState({
			start_date_blue: date
		});
	}

  onEnableScheduler() {
    if (!this.state.enabled) {
      this.setState({
        enabled: !this.state.enabled,
        check_task: false
        })
      this.props.dispatch({type: `SET_${this.state.service}_ENABLED`, payload: {enabled: !this.state.enabled}})
      this.props.dispatch({type: `SET_${this.state.service}_CHECK_TASK`, payload: {check_task: false}})
      this.props.dispatch({type: `SET_${this.state.service}_TIME_INTERVAL`, payload: {interval: this.state.interval}})
    } else {
      this.setState({
        enabled: false,
        timer:  this.props.service.timer
      })
      this.props.dispatch({type: `SET_${this.state.service}_ENABLED`, payload: {enabled: false}})
    }
  }

	render() {

    const filterPassedTime = (time) => {
      const currentDate = new Date();
      const selectedDate = new Date(time);
  
      return currentDate.getTime() < selectedDate.getTime();
    };

		return (
			<Fragment>
    <div className="card">
          <div className="card-header ch-alt">
            <Row>
              <Col sm={6}>
                <h2>
                  Scheduler 
                </h2>
              </Col>
              <Col sm={6}>
                <Switch className="toggle-switch enable-scheduler" switcher="switch-cyan" switchColor="rgba(0,188,212,0.5)" switchActive={"#00bcd4"}>
                  <label className="ts-label scheduler-enable" htmlFor="ts-cyan">Enable</label>
                  <input type="checkbox" id="ts-cyan" hidden="hidden" defaultChecked={this.state.enabled}/>
                  <label className="ts-helper" htmlFor="ts-cyan" onClick={this.onEnableScheduler}></label>
                </Switch>
              </Col>
            </Row>
          </div>
          <div className="card-body card-padding">
            <form className="form-horizontal" role="form">
              <div className="form-group m-b-20" >
                <OverlayTrigger overlay={<Tooltip id={"interval-3t"}>{`Milisecond run task refesh source`}</Tooltip>} placement="top">
                  <label htmlFor="interval" className="col-sm-3 control-label">Interval</label>
                </OverlayTrigger>
                <div className="col-sm-8">
                  <Input className="form-control" placeholder="milisecond" value={this.state.interval} name="interval" onChange={(ev) => this.handleChangeInterval(ev)}/>
                </div>
              </div>

              <div className="form-group" >
                <label htmlFor="start-time" className="col-sm-3 control-label">Start Time</label>
                <div className="col-sm-8">
                <DatePicker
                  // showIcon
                  selected={this.state.start_date_blue}
                  onChange={(date) => this.handleChange_blue(date)}
                  showTimeSelect
                  filterTime={filterPassedTime}
                  // showTimeSelectOnly
                  // intervals={15}
                  timeCaption="Time"
                  dateFormat="MM/dd/yyyy h:mm aa"
                  showTimeInput
                />
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
    cores: state.cores
	};
}

export default connect(mapStateToProps)(FormSchedulerRefresh);