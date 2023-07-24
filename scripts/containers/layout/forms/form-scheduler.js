import React, { Component, Fragment } from 'react';
import ModuleHeader from '../../../common/module-header';

import { Input, Textarea, Select, AddOn, Inputmask, InputDate } from '../../../components/input'
import Switch from '../../../components/switch'

import { Row, Col } from 'react-bootstrap';
import moment from 'moment';
import DatePicker from 'react-datepicker';

export default class FormScheduler extends Component {
	constructor(props) {
		super(props)

		this.state = {
			start_date_blue: moment(),

			start_date_input_a: moment(),
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleChange_blue	=	this.handleChange_blue.bind(this)

	}
	handleChange(date) {
		this.setState({
			start_date_input_a: date
		});
	}

	handleChange_blue(date) {
		this.setState({
			start_date_blue: date
		});
	}

	render() {
		return (
			<Fragment>
				<Row>
					<Col sm={12}>
						<div className="card">
							<div className="card-header">
								<h2>Scheduler
								</h2>
							</div>
							<div className="card-body card-padding">
								{/* <small>Displaying the Datepicker by default</small> */}
								<Row>
									<Col sm={12} md={4}>
										<div className="dp-blue">
											<DatePicker todayButton={"Today"} inline showMonthDropdown showYearDropdown dropdownMode="select"  selected={this.state.start_date_blue} name="start_date_blue" onChange={this.handleChange_blue} />
										</div>
									</Col>
								</Row>
								{/* <br/>
								<small>Displaying on focus</small> */}

								<Row>
									<Col sm={12} md={4}>
										<div className="picker-input">
											<DatePicker popperClassName="dp-blue" todayButton={"Today"} showMonthDropdown showYearDropdown customInput={<InputDate />} name="start_date_input_a" selected={this.state.start_date_input_a} onChange={this.handleChange} />
										</div>
									</Col>
								</Row>
							</div>
						</div>
					</Col>
				</Row>
			</Fragment>
		)
	}
}
