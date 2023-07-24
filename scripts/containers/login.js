import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux';
import Ripple from '../components/ripple';
import { Input } from '../components/input';

// Redux Action
import { loginUser, getUser } from '../actions/auth-action';

class Login extends Component {	
	constructor(props) {
		super(props);
		this.state = {
			email: "tungnmac@gmail.com",
			password: "123456tungnm"
		}
	}

	// async componentWillMount() {
	// 	let {auth} = this.props
	// 	if (auth.token && auth.user) {
	// 		try {
	// 			let response = await getUser(this.props.dispatch, {"token": auth.token});
	// 			if (!response) return;
	// 			this.props.history.push('/');
	// 		} catch (error) {
	// 			console.log(error);
	// 		}
	// 	}
	// }

	async componentWillUnmount() {
		let {auth} = this.props
		if (auth.token && auth.user) {
			try {
				let response = await getUser(this.props.dispatch, {"token": auth.token});
				if (!response) return;
				this.props.history.push('/');
			} catch (error) {
				console.log(error);
			}
		}
	}

	onChange(ev){
		this.setState({
			[ev.target.name]: ev.target.value
		})
	}

	async onLogin() {
		var data = this.state

		try {
			let response = await loginUser(this.props.dispatch, data);
			if (!response) return;
			this.props.history.push('/');
		} catch (error) {
			console.log(error);
		}
	}

	render() {
		return(
			<div className="container-fluid">
				<div className="login-container">
					<div className="login-flex">
						<div className="login-holder">
							<div className="login-box">
								<div className="card">
									<div className="card-header">
										<h2> Sign in with your account to continue</h2>
									</div>
									<div className="card-body card-padding ch-alt">
										<div className="form-group rg-float">
											<Input type="email" active="rg-toggled" className="form-control" float="Email" name="email" value={this.state.email} onChange={this.onChange.bind(this)}/>
										</div>
										<div className="form-group rg-float">
											<Input type="password" active="rg-toggled" className="form-control" float="Password" name="password" value={this.state.password} onChange={this.onChange.bind(this)} />
										</div>										
										<Ripple type="button" className="btn btn-block login-btn" onClick={this.onLogin.bind(this)}>LOGIN</Ripple>
									</div>
									<div className="card-footer p-0">
										<div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 p-10" style={{ color: "#FFF" }} >
											<NavLink to={`/signup`}>Not registered?</NavLink>
										</div>
										<div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 p-10" style={{ color: "#FFF" }}>
											<NavLink to={`/forgot-password`}>Forgot password?</NavLink>
										</div>
										<div style={{ clear: "both"}} ></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}


const mapStateToProps = (state) => {
	return {
		auth: state.auth
	};
}

export default connect(mapStateToProps)(Login);