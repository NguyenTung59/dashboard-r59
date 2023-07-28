import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux';

const config = require("../../../helper/config").config

import Input from '../../../components/input'
import Sparkline from '../../../components/sparkline'
import ModuleHeader from '../../../common/module-header'
import Ripple from '../../../components/ripple'
import { GetMetrics } from '../../../actions/core-action';

import { Row, Col, Alert, NavDropdown, MenuItem, } from 'react-bootstrap'

const notify = require("../../../helper/notify").notify;

import samsungImg from '../../../assets/img/widgets/alpha.jpg'
class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			firstName: "",
			lastName: "",
			show: false,
			bestSelling: [
				{
					"id": 1,
					"img": "note4.jpg",
					"name": "Samsung Galaxy Note 4",
					"range": "$850.00 - $1199.99"
				}, {
					"id": 2,
					"img": "mate7.jpg",
					"name": "Huawei Ascend Mate",
					"range": "$649.59 - $749.99"
				}, {
					"id": 3,
					"img": "535.jpg",
					"name": "Nokia Lumia 535",
					"range": "$189.99 - $250.00"
				}
			],
			resentItems: [
				{
					"id": 2569,
					"name": "Samsung Galaxy Mega",
					"price": 521
				}, {
					"id": 9658,
					"name": "Huawei Ascend P6",
					"price": 440
				}, {
					"id": 1101,
					"name": "HTC One M8",
					"price": 680
				}, {
					"id": 2569,
					"name": "Samsung Galaxy Alpha",
					"price": 870
				}, {
					"id": 6598,
					"name": "LG G3",
					"price": 690
				}
			],
			metrics: this.props.metrics.data
		}
		this.sparkline = this.props.sparkline;
		this.changeValue = this.changeValue.bind(this);
		this.dynamicChart = this.dynamicChart.bind(this)
	}
	componentDidMount(){
		notify.growl({
			message: "Welcome back Rowel de Guzman",
		}, {
			z_index: 1080,
			type: "success",
			allow_dismiss: true,
			mouse_over: "pause",
			label: 'Cancel',
			className: 'btn-xs btn-inverse',
			placement: {
				from: "top",
				align: "right"
			},
			delay: 2500,
			spacing: 10,
			animate: {
				enter: 'animated bounceInLeft',
				exit: 'animated bounceOutLeft'
			},
			offset: {
				x: 20,
				y: 85
			}
		});

		this.dynamicChart();
	}

	changeValue(event) {
		const name = event.target.name
		this.setState({
			[name]: event.target.value
		})
	}

	dynamicChart() {
		var data = [],
			totalPoints = 100,
			j = 0;

		function getDataMetrics(props) {
			if (data.length > 0)
				data = data.slice(1);
			while (data.length < totalPoints) {
				var prev = data.length > 0 ? data[data.length - 1] : 50,
					y = prev + Math.random() * 10 - 5;

				if (y < 0) {
					y = 0;
				} else if (y > 90) {
					y = 90;
				}
				data.push(y);

				try {
					// let data_metrics = await GetMetrics(props.dispatch, {url: `http://192.168.14.151:8000`});
					// console.log("metrics data ", data_metrics)

					// data.push(data_metrics.in_pkts_speed)
				} catch (error) {
					console.log(error)
				}
			}
			var res = [];
			for (var i = 0; i < data.length; ++i) {
				res.push([j++, data[i]])
			}

			return res;
		}
		// console.log(this.props.metrics.data)

		// console.log(getDataMetrics())
		var updateInterval = 30;
		var plot_bw = $.plot("#dynamic-chart", [getDataMetrics(this.props)], {
			series: {
				label: "Server Process Data",
				lines: {
					show: true,
					lineWidth: 0.2,
					fill: 0.6
				},

				color: '#00BCD4',
				shadowSize: 0
			},
			yaxis: {
				min: 0,
				max: 100,
				tickColor: '#eee',
				font: {
					lineHeight: 13,
					style: "normal",
					color: "#9f9f9f",
				},
				shadowSize: 0,
			},
			xaxis: {
				show: true,
				tickColor: '#eee',
				font: {
					lineHeight: 13,
					style: "normal",
					color: "#9f9f9f",
				},
				shadowSize: 0,
			},
			grid: {
				borderWidth: 1,
				borderColor: '#eee',
				labelMargin: 10,
				hoverable: true,
				clickable: true,
				mouseActiveRadius: 6,
			},
			legend: {
				container: '.flc-dynamic',
				backgroundOpacity: 0.5,
				noColumns: 0,
				backgroundColor: "white",
				lineWidth: 0
			}
		});

		function update(props) {
			plot_bw.setData([getDataMetrics(props)]);
			plot_bw.setupGrid();
			plot_bw.draw();
			setTimeout(update, updateInterval);
		}
		update(this.props);
	}


	render() {
		/* Sparkline is from reducer */
		const { sparkline } = this.props
		return (
			<Fragment>
				<ModuleHeader text="Overview"/>
				<div className="row">
					<div className="col-sm-12">


						{/* Dynamic Chart */}
						<Row>
							<Col sm={12}>
							<div className="card">
								<div className="card-header">
									<h2>Dynamic Chart</h2>
								</div>
								<div className="card-body card-padding">
									<div id="dynamic-chart" className="flot-chart"></div>
									<div className="flc-dynamic"></div>
								</div>
							</div>
						</Col>
					</Row>

						<div className="mini-charts">
							<div className="row">
								<div className="col-sm-6 col-md-3">
									<div className="mini-charts-item bgm-cyan">
										<div className="clearfix">
											<Sparkline className="chart stats-bar" type="bar" value={sparkline.bar1}/>
											<div className="count">
												<small>Website Traffics</small>
												<h2>987,459</h2>
											</div>
										</div>
									</div>
								</div>
								<div className="col-sm-6 col-md-3">
									<div className="mini-charts-item bgm-lightgreen">
										<div className="clearfix">
											<Sparkline className="chart stats-bar-2" type="bar" value={sparkline.bar2}/>
											<div className="count">
												<small>Website Impressions</small>
												<h2>356,785K</h2>
											</div>
										</div>
									</div>
								</div>

								<div className="col-sm-6 col-md-3">
									<div className="mini-charts-item bgm-orange">
										<div className="clearfix">
											<Sparkline className="chart stats-line" type="line" value={sparkline.bar3} width="85px" height="45"/>
											<div className="count">
												<small>Total Sales</small>
												<h2>$ 458,778</h2>
											</div>
										</div>
									</div>
								</div>

								<div className="col-sm-6 col-md-3">
									<div className="mini-charts-item bgm-bluegray">
										<div className="clearfix">
											<Sparkline className="chart stats-line-2" type="line" value={sparkline.bar4} width="85px" height="45"/>
											<div className="count">
												<small>Support Tickets</small>
												<h2>23,856</h2>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="dash-widgets">
							<Row>
								{/* analyze wigets for the past 30 days*/}
								<Col sm={12} md={6}>
									<div id="site-visits" className="dash-widget-item bgm-teal">
										<div className="dash-widget-header">
											<div className="p-20">
												<Sparkline className="chart stats-line-2" type="line" value={sparkline.bar3} width="100%" height="95px" />
											</div>
											<div className="dash-widget-title">For the past 30 days</div>
											<ul className="actions actions-alt">
												<NavDropdown eventKey={1} title={<i className="zmdi zmdi-more-vert"></i>} className="pull-right" noCaret id="dropdown-action">
													<MenuItem className="dropdown-arrow"></MenuItem>
													<MenuItem>You can add anything here</MenuItem>
												</NavDropdown>
											</ul>
										</div>
										<div className="p-20">
											<small>Page Views</small>
											<h3 className="m-0 f-400">47,896,536</h3>
											<br />
											<small>Site Visitors</small>
											<h3 className="m-0 f-400">24,456,799</h3>
											<br />
											<small>Total Clicks</small>
											<h3 className="m-0 f-400">13,965</h3>
										</div>
									</div>
								</Col>
								{/* Best Sellings */}
								{/* <Col sm={6} md={3}>
									<div id="best-selling" className="dash-widget-item">
										<div className="dash-widget-header">
											<div className="dash-widget-title">Best Sellings</div>
											<img src={samsungImg} alt=""/>
											<div className="main-item">
												<small>Samsung Galaxy Alpha</small>
												<h2>$799.99</h2>
											</div>
										</div>
										<div className="listview p-t-5">
											{this.state.bestSelling.map((item, i) =>
												<a className="lv-item" key={i}>
													<div className="media">
														<div className="pull-left">
															<img className="lv-img-sm" src={`${config.asset_url}/assets/img/widgets/${item.img}`}/>
														</div>
														<div className="media-body">
															<div className="lv-title">{item.name}</div>
															<small className="lv-small">{item.range}</small>
														</div>
													</div>
												</a>
											)}
											<div className="clearfix"></div>
											<a className="lv-footer">View All</a>
										</div>
									</div>
								</Col> */}
								{/* Recent Items */}
								<Col sm={12} md={6} lg={6}>
									<div className="card">
										<div className="card-header bgm-teal">
											<h2>Recent Items
												<small>Phasellus condimentum ipsum id auctor imperdie</small>
											</h2>
											<ul className="actions">
												<NavDropdown eventKey={1} title={<i className="zmdi zmdi-more-vert"></i>} className="pull-right" noCaret id="dropdown-action">
													<MenuItem className="dropdown-arrow"></MenuItem>
													<MenuItem>Refresh</MenuItem>
													<MenuItem>Settings</MenuItem>
													<MenuItem>Other Settings</MenuItem>
												</NavDropdown>
											</ul>
										</div>
										<div className="card-body m-t-0">
											<table className="table table-inner table-vmiddle">
												<thead>
													<tr>
														<th>ID</th>
														<th>Name</th>
														<th style={{ width: "60px"}}>Price</th>
													</tr>
												</thead>
												<tbody>
													{this.state.resentItems.map((item, i) =>(
														<tr key={i}>
															<td className="f-500 c-cyan">{item.id}</td>
															<td>{item.name}</td>
															<td className="f-500 c-cyan">{item.price}</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</div>
								</Col>
							</Row>
						</div>
						<div className="form-group">
							<Input className="form-control input-sm" placeholder="Input Small" name="firstName" onChange={this.changeValue} />
						</div>
						<div className="form-group">
							<Input className="form-control input-sm" placeholder="Input Small" name="lastName" onChange={this.changeValue} />
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}
function mapStateToProps(state) {
	return {
		sparkline: state.sparkline,
		metrics: state.metrics
	};
}
// function matchDispatchToProps(dispatch) {
// 	return bindActionCreators({ selectUser: selectUser }, dispatch);
// }

export default connect(mapStateToProps)(Home);