import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom'

import HeaderModule from '../../../common/module-header';
import { Row, Col, ButtonToolbar, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';

import ReactTable from 'react-table'
import 'react-table/react-table.css';

import Ripple from '../../../components/ripple';
import { Input, Select } from '../../../components/input';
import { getAlerts } from '../../../actions/alert-action';
const helper = require('../../../helper/helper').helper;

class Alert extends Component {
	constructor(props) {
		super(props)
		this.state = {
			tooltipOpen: false,
			original: this.props.alerts.data,
			data: this.props.alerts.data,
			param: {
				notify_id: "",
				severity: -1,
				source: "",
				type: "",
				src_ip: "",
				dest_ip: "",
				priority: 0
			},
		}
		this.renderEditable = this.renderEditable.bind(this);
		this.editRow = this.editRow.bind(this);
		this.editable = this.editable.bind(this);
		this.toolDetail = this.toolDetail.bind(this);
		this.convertPriority = this.convertPriority.bind(this);
		this.convertSeverity = this.convertSeverity.bind(this);
		this.onSearch = this.onSearch.bind(this);
		this.convertDate = this.convertDate.bind(this);
		// this.onToolTip = this.onToolTip.bind(this);
	}

	async componentDidMount() {
		let notify_id = new URLSearchParams(this.props.location.search).get("notify_id")
		try {
			let alerts = await getAlerts(this.props.dispatch, {body: {...this.state.param, notify_id: notify_id, alert: {severity: this.state.param.severity}}})
			this.setState({
				original: alerts,
				data: alerts,
				param: {
					notify_id: notify_id
				}
			})

		} catch (err) {
			console.log("Error Alert: ", err)
		}
	}

	/**
	 * 
	 * @param {original data value} data 
	 * @param {cellInfo that we need to determine what row is to edit} cellInfo 
	 */
	editRow(data, cellInfo){
		data[cellInfo.index]["edit"] = true;
		this.setState({ data });
	}
	/**
	 * 
	 * @param {original data value} data
	 * @param {cellInfo that we need to determine what row is to update} cellInfo
	 * @param {this is the button that has been click and a reference to get input value} event 
	 */
	updatRow(data, cellInfo, event) {
		/**
		 * get the parent div that isolated the inputs
		 */
		var parentTr = helper.parents('rt-tr', event.target, 'class');
		let src_ip	= parentTr.querySelector("input[name='src_ip']"),
		 	dest_ip	= parentTr.querySelector("input[name='dest_ip']"),
			signature = parentTr.querySelector("input[name='signature']"),
			source = parentTr.querySelector("input[name='source']"),
			priority = parentTr.querySelector("select[name='priority']"),
			event_type = parentTr.querySelector("input[name='event_type']");
			// contact = parentTr.querySelector("input[name='contact']");
		// let 
		/**
		 * pass the value to the selected cell to be updated
		 * 
		*/
		data[cellInfo.index]["edit"] = false;
		data[cellInfo.index]["src_ip"] = src_ip.value;
		data[cellInfo.index]["dest_ip"] = dest_ip.value;
		data[cellInfo.index]["alert"]["signature"] = signature.value;
		data[cellInfo.index]["source"] = source.value;
		data[cellInfo.index]["priority"] = parseInt(priority.value);
		data[cellInfo.index]["event_type"] = event_type.value;
		// data[cellInfo.index]["contact"] = contact.value;
		/**
		 * Update the state, you can also use the redux if the content is sharable to not dynamically updated.
		*/
		this.setState({ data });
	}
	renderEditable(cellInfo, state, rowInfo, column) {
		if (cellInfo.original.edit) {
			return (
				<Ripple type="button" className="btn btn-sm btn-success" onClick={(e) => {
					this.updatRow([...this.state.data], cellInfo, e)
				}} ><i className="zmdi zmdi-check" /></Ripple>
				
			);
		} else {
			return (
				<Ripple type="button" className="btn btn-sm btn-primary" onClick={(e) => {
					this.editRow([...this.state.data], cellInfo)
				}} ><i className="zmdi zmdi-edit" /></Ripple>
			);
		}
	}

	toolDetail(cellInfo) {
		// console.log(cellInfo, this.state.data)
		var data = this.state.data;

		if (data && data.length > 0 && data[cellInfo.index]) {
			let name = cellInfo.column.id
			let sid, alert, object
			alert = data[cellInfo.index]
			object = cellInfo.column.object
			if (object) {
				sid = alert[object][name]
			}
	
			return (
				<ButtonToolbar>
					<OverlayTrigger trigger={['hover', 'focus']} placement="right" overlay={
						<Popover id="popover-positioned-top" title="Alert" bsSize="large">
							<Row><Col sm={4}><strong><small>Sid: </small></strong></Col> <Col sm={8}><small>{sid}</small></Col></Row>
							<Row><Col sm={4}><strong><small>Type: </small></strong></Col> <Col sm={8}><small> {alert.event_type}</small></Col></Row>
							<Row><Col sm={4}><strong><small>Source: </small></strong></Col> <Col sm={8}><small> {alert.source}</small></Col></Row>
							<Row><Col sm={4}><strong><small>Src Ip: </small></strong></Col> <Col sm={8}><small> {alert.src_ip}</small></Col></Row>
							<Row><Col sm={4}><strong><small>Src Port: </small></strong></Col> <Col sm={8}><small> {alert.src_port}</small></Col></Row>
							<Row><Col sm={4}><strong><small>Dest Ip: </small></strong></Col> <Col sm={8}><small> {alert.dest_ip}</small></Col></Row>
							<Row><Col sm={4}><strong><small>Dest Port: </small></strong></Col> <Col sm={8}><small> {alert.dest_port}</small></Col></Row>
							<Row><Col sm={4}><strong><small>Method: </small></strong></Col> <Col sm={8}><small> {alert.proto}</small></Col></Row>
							<Row><Col sm={4}><strong><small>Pcap: </small></strong></Col> <Col sm={8}><small> {alert.pcap_cnt}</small></Col></Row>
							<Row><Col sm={4}><strong><small>Severity: </small></strong></Col> <Col sm={8}><small>{this.convertSeverity(alert.alert.severity)}</small></Col></Row>
							<Row><Col sm={4}><strong><small>Status: </small></strong></Col> <Col sm={8}><small> {this.convertPriority(sid, alert.priority)}</small></Col></Row>
							<Row><Col sm={4}><strong><small>Signature: </small></strong></Col> <Col sm={8}> <small>{alert.alert.signature}</small></Col></Row>
							<Row><Col sm={4}><strong><small>Created: </small></strong></Col> <Col sm={8}> <small>{alert.created_at}</small></Col></Row>
						</Popover>
					}>
						<NavLink className="sub" to={`/alerts/detail/?notify_id=${alert.notify_id}&sid=${sid}`}><Ripple type="button" className="btn btn-primary">{sid}</Ripple></NavLink>
					</OverlayTrigger>
				</ButtonToolbar>
			)	
		} else {
			return <div></div>
		}
	}

	editable(cellInfo) {
		var data = this.state.data;
		// console.log(cellInfo.index, data[cellInfo.index])
		// if (data)
		if (data && data[cellInfo.index]) {
			let name = cellInfo.column.id,
			value = data[cellInfo.index][name];
			if (cellInfo.original.edit) {
				if (name == "priority") {
					return (
						<div className="form-group rg-float">
							<Select className="form-control" defaultValue={value} name={name}>
								<option value={0}>Processing</option>
								<option value={1}>Processed</option>
							</Select>
						</div>
					)
				}
	
				if (cellInfo.column.object) {
					value = data[cellInfo.index][cellInfo.column.object][name]
				} 
				
				return (
					<div className="form-group rg-float">
						<Input type="text" active="rg-toggled" className="form-control" name={name} defaultValue={value} />
					</div>
				)
			} else {
				if (name == "priority") {
					return this.convertPriority(cellInfo.index, value)
				} else if (cellInfo.column.object) {
					// return this.onToolTip(cellInfo.index, data[cellInfo.index][cellInfo.column.object][name])
					return (
						<OverlayTrigger overlay={<Tooltip id={cellInfo.index}>{data[cellInfo.index][cellInfo.column.object][name]}</Tooltip>} placement={name == "signature" ? "top" :"right"}>
							<span>{data[cellInfo.index][cellInfo.column.object][name]}</span>
						</OverlayTrigger>
					)
				} else {
					// return this.onToolTip(cellInfo.index, value)
					return (
						<OverlayTrigger overlay={<Tooltip id={cellInfo.index}>{value}</Tooltip>} placement="right">
							<span>{value}</span>
						</OverlayTrigger>
					)
				}
			}	
		} else {
			return <div></div>
		}
	}


	convertDate(cellInfo) {
		// console.log(date)
		var data = this.state.data;
		// console.log(cellInfo.index, data[cellInfo.index])
		// if (data)
		if (data && data[cellInfo.index]) {
			let name = cellInfo.column.id,
			value = data[cellInfo.index][name];
			let date = new Date(value).toLocaleString('vn-VN')
			return (
				<OverlayTrigger overlay={<Tooltip id={cellInfo.index}>{date}</Tooltip>} placement="right">
					<span>{date}</span>
				</OverlayTrigger>
			)
		} else {
			return <div></div>
		}
	}

	// onToolTip(id, tooltip) {
	// 	console.log("run......")
	// 	return (
	// 		<OverlayTrigger overlay={<Tooltip id={id}>{tooltip}</Tooltip>} placement="right">
	// 			<span>{tooltip}</span>
	// 		</OverlayTrigger>
	// 	)
	// }

	convertPriority(id, priority) {
		switch (priority) {
			case 1:
				return (
					<Col className='bgm-lightgreen text-center c-white z-depth-2'>
						{/* {this.onToolTip(id, "Processed")} */}
						<OverlayTrigger overlay={<Tooltip id={id}>Processed</Tooltip>} placement="right">
							<span>Processed</span>
						</OverlayTrigger>
					</Col>)
			default:
				return (
					<Col className='bgm-deeporange text-center c-white z-depth-2'>
						{/* {this.onToolTip(id, "Processing")} */}
						<OverlayTrigger overlay={<Tooltip id={id}>Processing</Tooltip>} placement="right">
							<span>Processing</span>
						</OverlayTrigger>
					</Col>
				)
		}
	}

	convertSeverity(severity) {
		switch (severity) {
			case 0:
				return <div className='bgm-lightgreen text-center c-white z-depth-2'>Low</div>
			case 1:
				return <div className='bgm-amber text-center c-white z-depth-2'>Medium</div>
			case 2:
				return <div className='bgm-orange text-center c-white z-depth-2'>High</div>
			default:
				return <div className='bgm-deeporange text-center c-white z-depth-2'>Critical</div>
		}
	}

	onFilter(ev) {
		var {name, value} = ev.target
		if (name == "severity" || name == "priority") {
			value = parseInt(value)
		}

		this.setState({
			param: {
				...this.state.param,
				[name]: value
			}
		})
		
	}

	async onSearch() {
		// var arr = []
		// if (this.state.original) {
		// 	arr = this.state.original.filter((item) => {
		// 		if (name == "severity") {
		// 			return item.alert[name] == value
		// 		} else {
		// 			return item[name] == value
		// 		}
		// 	})
		// }

		// this.setState({
		// 	// ...this.state,
		// 	param: {
		// 		...this.state.param,
		// 		[name]: value
		// 	},
		// 	data: arr
		// })

		// console.log(this.state.param)
		let alerts = await getAlerts(this.props.dispatch, {body: {...this.state.param, alert: {severity: this.state.param.severity}}})
		// console.log(alerts)
			this.setState({
				original: alerts,
				data: alerts
			})
	}

	render() {
		return (
			<Fragment>
				<HeaderModule text="Agent Alerts">
					<small>
						{/* https://react-table.js.org/#/story/readme */}
						<a href="#" target="_blank">Read More...</a> 
					</small>
				</HeaderModule>
				<Row>
					<Col sm={12}>
						<div className="card">
							<div className="card-header">
								<h2>Alerts</h2>
							</div>
							<div className="card-body card-padding">
								<form className="row" role="form">
									<Col sm={2}>
										<div className="form-group">
											<Input className="form-control" placeholder="Notify" defaultValue={this.state.param.notify_id} onChange={this.onFilter.bind(this)}/>
										</div>
									</Col>
									<Col sm={2}>
										<div className="form-group">
											<Select className="form-control" name="severity" onChange={this.onFilter.bind(this)}>
												<option value={-1}>-- Select Severity--</option>
												<option value={0}>Low</option>
												<option value={1}>Medium</option>
												<option value={2}>High</option>
												<option value={3}>Critical</option>
											</Select>
										</div>
									</Col>
									<Col sm={2}>
										<div className="form-group">
										<Select className="form-control" name="source" onChange={this.onFilter.bind(this)}>
											<option value="">-- Select Source--</option>
											<option value="RDE">RDE</option>
											<option value="ADE">ADE</option>
											</Select>
										</div>
									</Col>
									<Col sm={2}>
										<div className="form-group">
										<Select className="form-control" name="priority" onChange={this.onFilter.bind(this)}>
											<option value="">-- Select Status--</option>
											<option value={0}>Processing</option>
											<option value={1}>Processed</option>
											</Select>
										</div>
									</Col>
									<Col sm={1}>
										<div className="form-group">
											<Input className="form-control" placeholder="Type" name="event_type" onChange={this.onFilter.bind(this)}/>
										</div>
									</Col>
									<Col sm={1}>
										<div className="form-group">
											<Input className="form-control" placeholder="Src IP" name="src_ip" onChange={this.onFilter.bind(this)}/>
										</div>
									</Col>
									<Col sm={1}>
										<div className="form-group"> 
											<Input className="form-control" placeholder="Dest IP" name="dest_ip" onChange={this.onFilter.bind(this)}/>
										</div>
									</Col>
									<Col sm={1}>
										<Ripple type="button" className="btn btn-primary btn-sm m-t-10" onClick={this.onSearch} >Search</Ripple>
									</Col>
								</form>
								<ReactTable className="-striped -highlight" defaultPageSize={10} data={this.state.data} columns={[
									// {
									// 	id: 'id',
									// 	Header: props => <span className="text-left">Id</span>,
									// 	accessor: "id",
									// 	Cell: this.editable
									// },
									{
										id: 'signature_id',
										Header: props => <span className="text-left">SID</span>,
										accessor: "alert.signature_id",
										object: "alert",
										Cell: this.toolDetail
									},
									{
										id: 'signature',
										Header: "Signature",
										accessor: "alert.signature",
										object: "alert",
										Cell: this.editable
									},
									{
										id: 'src_ip',
										Header: 'Src IP',
										accessor: 'src_ip',
										Cell: this.editable
									},
									{
										id: 'dest_ip',
										Header: 'Dest IP',
										accessor: 'dest_ip',
										Cell: this.editable
									},
									{
										id: 'severity',
										Header: 'Severity',
										accessor: original => this.convertSeverity(original.alert.severity),
										// Cell: this.convertSeverity
									},
									{
										id: 'source',
										Header: 'Source',
										accessor: 'source',
										Cell: this.editable
									},
									{
										id: 'event_type',
										Header: 'Type',
										accessor: 'event_type',
										Cell: this.editable
									},
									{
										id: 'priority',
										Header: 'Status',
										accessor: "priority",
										Cell: this.editable
									},
									{
										id: 'created_at',
										Header: 'Created At',
										accessor: "created_at",
										Cell: this.convertDate
									},
									{
										id: 'Actions',
										Header: 'Actions',
										accessor: '',
										Cell: this.renderEditable
									}
								]}/>
							</div>
						</div>
					</Col>
				</Row>
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

export default connect(mapStateToProps)(Alert);