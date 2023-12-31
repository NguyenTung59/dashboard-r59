import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import {logout} from '../actions/auth-action'
import profile from '../assets/images/profile.jpeg';
import Switch from '../components/switch';
import HeaderSearch from '../components/header-search-bar';
const sidebarHelper = require('../helper/sidebar');
const storage		=	require('../helper/storage');
import { NavDropdown, MenuItem, Alert } from 'react-bootstrap';
import {getNotifies, updateNotify} from '../actions/alert-action'

const body = document.body

class Header extends Component {
	constructor(props){
		super(props)
		this.sidebarHelper 	= 	sidebarHelper.sidebarHelper;
		this.localstorage	=	storage.storage
		this.changeLayout 	= 	this.changeLayout.bind(this)
		this.onCheckNotify 	= 	this.onCheckNotify.bind(this)
		this.state = { 
			layout: false,
			colorSelector: false,
			messages: [
				{
					title: "Rowel de Guzman",
					message: "Sample Message for Rowel de Guzman",
					status: "new",
				}, {
					title: "Albert Magat",
					message: "Sample Message for Albert Magat",
					status: "new",
				}, {
					title: "Daryl Abalos",
					message: "Sample Message for Daryl Abalos",
					status: "readed",
				}, {
					title: "Jonathan Poquiz",
					message: "Sample Message for Jonathan Poquiz",
					status: "viewed",
				}
			],
			alert: this.props.alerts.systems,
			notifies: this.props.alerts.notifies,
			result: [
				{ content: "Content 1" },
				{ content: "Content 2" },
				{ content: "Content 3" },
				{ content: "Content 4" },
				{ content: "Content 5" },
				{ content: "Content 6" },
				{ content: "Content 7" },
				{ content: "Content 8" },
				{ content: "Content 9" },
				{ content: "Content 10" },
				{ content: "Content 11" },
				{ content: "Content 12" },
				{ content: "Content 13" },
				{ content: "Content 14" },
				{ content: "Content 15" },
				{ content: "Content 16" },
				{ content: "Content 17" },
				{ content: "Content 18" },
				{ content: "Content 19" },
				{ content: "Content 20" },
				{ content: "Content 21" },
				{ content: "Content 22" },
				{ content: "Content 23" },
				{ content: "Content 24" },
				{ content: "Content 25" }
			]
		}
		this._forceOpen = false

		this.countNewMes = this.countNewMes.bind(this)
		this.getStatusNotify = this.getStatusNotify.bind(this)
	}
	async componentDidMount() {
		this.toggleLayoutRef.setAttribute("checked", "checked")
		let storageColor	= 	this.localstorage.get("color");
		let currentSkin		=	storageColor == null ? "primary" : storageColor;
		body.setAttribute("rg-skin", currentSkin)

		try {
			await getNotifies(this.props.dispatch)
		} catch (error) {
			console.log(erre)
		}
	}
	changeLayout(ev) {
		this.state.layout ? body.classList.add("full-layout") : body.classList.remove("full-layout")
		this.setState({
			layout: this.state.layout = !this.state.layout
		})		
	}
	skinSwitch(color, event) {
		this.localstorage.add("color", color);
		body.setAttribute("rg-skin", color)
		let active = document.querySelector(".skin-switch");
		if (active.querySelector(".active") !== null) {
			active.querySelector(".active").classList.remove("active")
		}
		event.target.classList.add("active");
	}
	dropdownToggle(newValue) {
		if (this._forceOpen) {
			this.setState({ colorSelector: true });
			this._forceOpen = false;
		} else {
			this.setState({ colorSelector: newValue });
		}
	}
	menuItemClickedThatShouldntCloseDropdown() {
		this._forceOpen = true;
	}
	showHideSearchMobile(type) {
		let searchContainer = document.getElementById("search-mobile-container");
		console.log(type)
		if (searchContainer !== null) {
			if (type == "show") {
				searchContainer.classList.add("active")
			} else {
				searchContainer.classList.remove("active")
			}
		}		
	}
	scrollToBottom(event){
		let top = event.target.scrollTop,
			topMax = event.target.scrollTopMax;
		
		if (top == topMax){
			console.log("You've reach the bottom")
		}
	}

	onLogout() {
		logout(this.props.dispatch);
		this.props.history.push('/login');
	}

	countNewMes() {
		var count = 0
		for (let i = 0; i < this.state.messages.length; i++) {
			if (this.state.messages[i].status == "new") {
				count += 1
			}
		}
		return count
	}

	countNewNotifies() {
		var count = 0
		for (let i = 0; i < this.props.alerts.notifies.length; i++) {
			if (this.props.alerts.notifies[i].status == 0) {
				count += 1
			}
		}
		return count
	}

	getStatusNotify(status) {
		switch (status) {
			case 2:
				return "fixed"
			case 1:
				return "checked"
			default:
				return "new";
		}
	}

	async onCheckNotify(notify) {
		var notifies = this.props.alerts.notifies
		var notify_id 
		for (var i=0; i < notifies.length; i++) {
			if (notifies[i].id == notify.id) {
				notifies[i].status = 1
				notify_id = notify.id
				await updateNotify(this.props.dispatch, {body: notifies[i]})
			}
		}
		this.props.dispatch({ type: 'SET_NOTIFY', payload: {notifies: notifies} })
		this.props.history.push(`/alerts/data-alerts?notify_id=${notify_id}`)
	}

	render() {
		var count = this.countNewMes()
		var countNewNotify = this.countNewNotifies()
		return (
			<header className="header">
				<nav className="navbar navbar-default navbar-fixed-top">
					<div className="container-fluid">
						<ul className="nav navbar-nav" style={{ width: '100%' }}>
							<li className="pull-left">
								<button className="navbar-toggle collapsed hamburger--spring" type="button" onClick={this.sidebarHelper.expandNavHead}>
									<div className="hamburger-box">
										<div className="hamburger-inner"></div>
									</div>
								</button>
							</li>
							<li className="hidden-xs">
								<a className="navbar-brand">Admin Dashboard Monitor</a>
							</li>

							<NavDropdown eventKey={1} title={<img src={profile} />} noCaret className="pull-right has-image nav-image" id="dropdown-profile">
								<MenuItem className="dropdown-arrow"></MenuItem>
								<MenuItem><i className="zmdi zmdi-account"></i>Profile</MenuItem>
								<MenuItem><i className="zmdi zmdi-swap"></i>Switch Account</MenuItem>
								<MenuItem onClick={this.onLogout.bind(this)}><i className="zmdi zmdi-time-restore"></i>Logout</MenuItem>
								<MenuItem divider/>
								<MenuItem><i className="zmdi zmdi-fullscreen"></i> Toggle Fullscreen</MenuItem>
								<MenuItem><i className="zmdi zmdi-settings"></i> Other Settings</MenuItem>
							</NavDropdown>
							<NavDropdown eventKey={2} title={<i className="zmdi zmdi-palette"></i>} noCaret className="pull-right has-zmdi" id="dropdown-color" open={this.state.colorSelector} onToggle={val => this.dropdownToggle(val)}>
								<MenuItem className="dropdown-arrow"></MenuItem>
								<MenuItem eventKey={2.1} className="skin-switch" onClick={() => this.menuItemClickedThatShouldntCloseDropdown()}>
									<span className="ss-skin bgm-primary" onClick={(e) => { this.skinSwitch('primary', e) }}></span>
									<span className="ss-skin bgm-lightblue" onClick={(e) => { this.skinSwitch('lightblue', e) }}></span>
									<span className="ss-skin bgm-bluegray" onClick={(e) => { this.skinSwitch('bluegray', e) }}></span>
									<span className="ss-skin bgm-cyan" onClick={(e) => { this.skinSwitch('cyan', e) }}></span>
									<span className="ss-skin bgm-teal" onClick={(e) => { this.skinSwitch('teal', e) }}></span><br />
									<span className="ss-skin bgm-green" onClick={(e) => { this.skinSwitch('green', e) }}></span>
									<span className="ss-skin bgm-orange" onClick={(e) => { this.skinSwitch('orange', e) }}></span>
									<span className="ss-skin bgm-blue" onClick={(e) => { this.skinSwitch('blue', e) }}></span>
									<span className="ss-skin bgm-purple" onClick={(e) => { this.skinSwitch('purple', e) }}></span>
									<span className="ss-skin bgm-indigo" onClick={(e) => { this.skinSwitch('indigo', e) }}></span>
								</MenuItem>
							</NavDropdown>
							{/* alert  */}
							<NavDropdown eventKey={3} title={<Fragment>{countNewNotify >0 ? <div className="notif-counter"><div className="counter">{countNewNotify}</div></div> : ""}<i className="zmdi zmdi-notifications"></i></Fragment>} noCaret className="pull-right has-zmdi messages-list alerts-list" id="dropdown-email">
								<MenuItem className="dropdown-arrow"></MenuItem>
								{this.props.alerts.notifies.sort((a, b) => {return new Date(b.created_at) - new Date(a.created_at)}).map((item, i)=>(
									<MenuItem eventKey={"3."+i} className="item-list alert-menu-link" key={i} onClick={() => this.onCheckNotify(item)}>
										<Alert bsStyle={item.type} className="alert-notif">
											{item.status == 0 ? <div className="notif-new"><div className="status">{this.getStatusNotify(item.status)}</div></div> : ""}
											<div className="media" key={i}>
												<div className="pull-left">
													<div className="full-round">
														<div className="full-round-txt">
															{item.title.substr(0, 2).toUpperCase()}
														</div>
													</div>
												</div>
												<div className="media-body">
													<div>
														{item.message}	
													</div>
													<small className="sender">
														<span>{item.title}</span>
														<span> {item.created_at}</span>
													</small>
												</div>
											</div>
										</Alert>
									</MenuItem>
								))}
								<MenuItem divider/>
								<MenuItem className="message-footer">More Message</MenuItem>
							</NavDropdown>
							<NavDropdown eventKey={3} title={<Fragment>{count > 0 ? <div className="notif-counter"><div className="counter">{count}</div></div> : ""}<i className="zmdi zmdi-email"></i></Fragment>} noCaret className="pull-right has-zmdi messages-list" id="dropdown-email">
								<MenuItem className="dropdown-arrow"></MenuItem>
								{this.state.messages.map((item, i)=>(
									<MenuItem eventKey={"3."+i} className="item-list" key={i} >
										<div className="media" key={i}>
											<div className="pull-left">
												<div className="full-round">
													<div className="full-round-txt">
														{item.title.substr(0, 1).toUpperCase()}
                          </div>
												</div>
											</div>
											<div className="media-body">
												<div className="title">{item.message}</div>
												<small className="sender">
													<span>{item.title}</span>
													<span> 2hrs ago</span>
												</small>
											</div>
										</div>
									</MenuItem>
								))}
								<MenuItem divider/>
								<MenuItem className="message-footer">More Message</MenuItem>
							</NavDropdown>
							
							<li className="dropdown has-zmdi pull-right visible-xs" onClick={() => { this.showHideSearchMobile("show")} } >
								<a className="icon-zmdi">
									<i className="zmdi zmdi-search"></i>
								</a>
							</li>
							<li className="search-parent pull-right hidden-xs">
								<HeaderSearch size="desktop" content={this.state.result} scrollBottom={this.scrollToBottom} />
							</li>
							<li className="pull-right hidden-xs">
								<a className="no-hover">
									<Switch className="toggle-switch" switcher="switch-transparent" switchColor="rgba(0,0,0,0.26)" switchActive="#FFF">
										<input type="checkbox" id="toggle-layout" hidden="hidden" onClick={this.changeLayout.bind(this)} ref={(ref) => this.toggleLayoutRef = ref}/>
										<label className="ts-helper" htmlFor="toggle-layout"></label>
									</Switch>
								</a>
							</li>
						</ul>
					</div>
					<div className="container-fluid visible-xs" id="search-mobile-container">
						<div className="seach-mobile-body">
							<HeaderSearch size="mobile" content={this.state.result} scrollBottom={this.scrollToBottom} close={<button className="btn mobile-search-close" onClick={() => { this.showHideSearchMobile("hide") }} > <i className="zmdi zmdi-arrow-left"></i></button >}/>
						</div>
					</div>
				</nav>
			</header>
		);
	}
}

function mapStateToProps(state) {
	return {
		users: state.users,
		auth: state.auth,
		alerts: state.alerts
	};
}
export default connect(mapStateToProps)(Header);