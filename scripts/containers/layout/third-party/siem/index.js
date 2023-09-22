import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import {Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { GetAgents} from '../../../../actions/core-action';
import HeaderModule from '../../../../common/module-header'
import ReactTable from 'react-table'
import 'react-table/react-table.css';
import Ripple from '../../../../components/ripple';
import { Input, Select } from '../../../../components/input';
const helper = require('../../../../helper/helper').helper;

const config = require("../../../../helper/config").config;
// const ROOT_URL = 'http://192.168.14.165:8000';
const PORT = 8000

const btn_stye = {
	margin: "0 5px 0 0"
}

class SIEM extends Component {
  constructor(props) {
		super(props);
    this.state = {
      data: [
        {
          id: 1,
          name: "SIEM 1",
          ip: "192.168.14.165",
          port: "514",
          protocol: "tcp",
          delay: 5,
          source: "All",
          status: 0,
          edit: false,
          connect: false,
          created_at: "2023-08-27T09:35:49.261Z",
          updated_at: "2023-08-29T09:35:49.261Z",
        },
        {
          id: 2,
          name: "SIEM 2",
          ip: "192.168.14.169",
          port: "514",
          protocol: "tcp",
          delay: 5,
          source: "All",
          status: 0,
          edit: false,
          connect: false,
          created_at: "2023-08-27T09:35:49.261Z",
          updated_at: "2023-08-29T09:35:49.261Z",
        }
      ]
		}

    this.renderActions = this.renderActions.bind(this);
    this.renderEditable = this.renderEditable.bind(this);
    this.renderAllowConnect = this.renderAllowConnect.bind(this);
    this.editRow = this.editRow.bind(this);
		this.editable = this.editable.bind(this);
		this.convertDate = this.convertDate.bind(this);
    this.convertStatus = this.convertStatus.bind(this)
  }

  async componentDidMount() {
    try {

      await GetAgents(this.props.dispatch)
    } catch(e) {
      console.log(e);
    }
  }

  editRow(data, cellInfo){
		data[cellInfo.index]["edit"] = true;
		this.setState({ data });
	}

  updatRow(data, cellInfo, event) {
		/**
		 * get the parent div that isolated the inputs
		 */

		var parentTr = helper.parents('rt-tr', event.target, 'class');
		let name	= parentTr.querySelector("input[name='name']"),
		 	ip = parentTr.querySelector("input[name='ip']"),
			port = parentTr.querySelector("input[name='port']"),
			source = parentTr.querySelector("select[name='source']");
			// contact = parentTr.querySelector("input[name='contact']");

		/**
		 * pass the value to the selected cell to be updated
		 * 
		*/
		data[cellInfo.index]["edit"] = false;
		data[cellInfo.index]["name"] = name.value;
		data[cellInfo.index]["ip"] = ip.value;
		data[cellInfo.index]["port"] = port.value;
		data[cellInfo.index]["source"] = source.value;
		// data[cellInfo.index]["contact"] = contact.value;
		/**
		 * Update the state, you can also use the redux if the content is sharable to not dynamically updated.
		*/
		this.setState({ data });
	}

  renderActions(cellInfo, state, rowInfo, column) {
    return (
      <div>
        <Ripple type="button" className="btn btn-sm bgm-teal" style={btn_stye} onClick={(e) => {console.log("send")}}>
          <i className="zmdi zmdi-refresh-sync-alert" />
        </Ripple>
        {
          cellInfo.original.edit ? 
          <Ripple type="button" className="btn btn-sm btn-success" style={btn_stye} onClick={(e) => {
            this.updatRow([...this.state.data], cellInfo, e)
          }} ><i className="zmdi zmdi-check" /></Ripple>
        : <Ripple type="button" className="btn btn-sm btn-warning" style={btn_stye} onClick={(e) => {
            this.editRow([...this.state.data], cellInfo)
          }} ><i className="zmdi zmdi-edit" /></Ripple>
        }
        <Ripple type="button" className="btn btn-sm btn-info" style={btn_stye} onClick={(e) => {
          console.log("History")}
        }>
          <i className="zmdi zmdi-library"/> 
          {/* zmdi-open-in-new */}
        </Ripple>
        <Ripple type="button" className="btn btn-sm bgm-deeporange" style={btn_stye} onClick={(e) => {console.log("Remove")}} >
          <i className="zmdi zmdi-close"/>
				</Ripple>
      </div>
    );
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

  renderAllowConnect(cellInfo, state, rowInfo, column) {
		if (cellInfo.original.connect) {
			return (
        <div>
          <a>
            {/* <div className="icon-circle"> */}
              <i className="zmdi zmdi-network-off icon-connect" onClick={(e) => {
                this.updateConnect([...this.state.data], cellInfo, false)
              }}/>
            {/* </div> */}
          </a>
          <OverlayTrigger overlay={<Tooltip id={cellInfo.index}>Click for disconnect</Tooltip>} placement="right">
            <i className="zmdi zmdi-help-outline icon-tooltip-detail"/>
          </OverlayTrigger>
        </div>
			);
		} else {
			return (
        <div>
          <a>
            {/* <div className="icon-circle"> */}
              <i className="zmdi zmdi-remote-control icon-connect" onClick={(e) => {
                this.updateConnect([...this.state.data], cellInfo, true)
              }}/>
            {/* </div> */}
          </a>
          <OverlayTrigger overlay={<Tooltip id={cellInfo.index}>Click for connect</Tooltip>} placement="right">
            <i className="zmdi zmdi-help-outline icon-tooltip-detail" />
          </OverlayTrigger>
        </div>
			);
		}
	}

  updateConnect(data, cellInfo, status) {
    data[cellInfo.index]["connect"] = status;
    this.setState({ data });
  }

  editable(cellInfo) {
		var data = this.state.data;
		// console.log(cellInfo.index, data[cellInfo.index])
		// if (data)
		if (data && data[cellInfo.index]) {
			let name = cellInfo.column.id,
			value = data[cellInfo.index][name];
			if (cellInfo.original.edit) {
				if (name == "source") {
					return (
						<div className="form-group rg-float">
							<Select className="form-control" defaultValue={value} name={name}>
								<option value="All">All</option>
								<option value="RDE">RDE</option>
								<option value="ADE">ADE</option>
							</Select>
						</div>
					)
				}

				return (
					<div className="form-group rg-float">
						<Input type="text" active="rg-toggled" className="form-control" name={name} defaultValue={value} />
					</div>
				)
			} else {
        
        return (
          <OverlayTrigger overlay={<Tooltip id={cellInfo.index}>{value}</Tooltip>} placement="right">
            <span>{value}</span>
          </OverlayTrigger>
        )
			}	
		} else {
			return <div></div>
		}
	}

  // parser date time 
  convertDate(cellInfo) {
		var data = this.state.data;
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

  convertStatus(cellInfo) {
    var data = this.state.data;
		if (data && data[cellInfo.index]) {
			let name = cellInfo.column.id,
			status = data[cellInfo.index][name];
			let value = ""
      switch (status) {
        case 1:
          value = "Connected"
        case 2:
          value = "Running..."
        default:
          value = "Disconnected"
      }

			return (
				<OverlayTrigger overlay={<Tooltip id={cellInfo.index}>{value}</Tooltip>} placement="right">
					<span>{value}</span>
				</OverlayTrigger>
			)
		} else {
			return <div></div>
		}

		
	}

  render() {
    return (
      <Fragment>
				<HeaderModule text="Security Information Event Management"/>
        <Row>
					<Col sm={12}>
						<div className="card">
							<div className="card-body card-padding">
                
								<ReactTable className="-striped -highlight" defaultPageSize={10} data={this.state.data} columns={[
									{
										id: 'connect',
										Header: "",
										accessor: '',
										Cell: this.renderAllowConnect
									},
									{
										id: 'name',
										Header: props => <span className="text-left">Name</span>,
										accessor: "name",
										Cell: this.editable
									},
									{
										id: 'ip',
										Header: "IP",
										accessor: "ip",
										Cell: this.editable
									},
									{
										id: 'port',
										Header: 'PORT',
										accessor: 'port',
										Cell: this.editable
									},
									{
										id: 'protocol',
										Header: 'Protocol',
										accessor: 'protocol',
										// Cell: this.convertSeverity
									},
                  {
										id: 'delay',
										Header: 'Delay',
										accessor: 'delay',
										Cell: this.editable
									},
									{
										id: 'source',
										Header: 'Source',
										accessor: 'source',
										Cell: this.editable
									},
									{
										id: 'status',
										Header: 'Status',
										// accessor: original => this.convertStatus(original.status),
										Cell: this.convertStatus
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
										Cell: this.renderActions
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
	};
}

export default connect(mapStateToProps)(SIEM);