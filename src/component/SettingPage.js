const { ipcRenderer } = window.require('electron')
import React, { Component } from 'react';
import { connect } from 'react-redux'
import _ from 'lodash'

class SettingPage extends Component {
	componentDidMount() {
		ipcRenderer.send('getDownloadDirectory')
		// ipcRenderer.send('getMaxConnection')
	}
	handleSelecteDirectoryClick() {
		ipcRenderer.send('openSelectFolderDialog', true)
	}
	// handleMaxConnectionChange(e){
	// 	ipcRenderer.send('updateMaxConnection', e.target.value)
	// }
	render() {
		// let maxConnectArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
		return (
			<div>
				<h4 className="text-center">SettingPage</h4>
				<br />
				Download to :
				<div className="custom-file" id="customFile" lang="es">
					<input
						className="custom-file-input"
						id="inputFile"
						aria-describedby="fileHelp"
						onClick={this.handleSelecteDirectoryClick.bind(this)}
					/>
					<label className="custom-file-label" htmlFor="inputFile">
						{!_.isEmpty(this.props.directory) ? this.props.directory : 'Select file...'}
					</label>
				</div>
				<br />
				{/* <div className="form-group">
					<label htmlFor="maxConnection">Max Connection</label>
					<select
						className="form-control"
						id="maxConnection"
						value={this.props.maxCon}
						onChange={ this.handleMaxConnectionChange.bind(this) }
					>
						{
							maxConnectArray.map((num, key) => {
								return <option key={key} >{num}</option>
							})
						}
					</select>
				</div> */}
			</div>
		);
	}
}

export default connect((state) => {
	return {
		directory: state.settingPage.directory,
		maxCon: state.settingPage.maxConnection
	}
})(SettingPage);
