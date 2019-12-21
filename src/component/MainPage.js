const { ipcRenderer } = window.require('electron')
import React, { Component } from 'react';
import { connect } from 'react-redux'
import _ from 'lodash'
import * as actions from '../redux/actions'

// eslint-disable-next-line 
import style from './MainPage.css'

class MainPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			url: '',
			// url: 'https://www.youtube.com/watch?v=oeEpRzU-mws&list=RDoeEpRzU-mws&start_radio=1',
			downloadList: [],
			sendingDownloadList: false
		}
	}
	onSubmitClick() {
		!_.isEmpty(this.state.url) &&
			this.props.dispatch(actions.toggleMainPageLoading(true))
		ipcRenderer.send('onYTLinkSubmit', this.state.url);
	}
	downloadSelcted() {
		let { dispatch } = this.props;
		if (_.isEmpty(this.state.downloadList)){ return }
		ipcRenderer.send('onDownloadListSubmit', this.state.downloadList);
		dispatch(actions.updateDownloadList(this.state.downloadList, ()=>{ this.clearAll() }))
	}
	selectedAll() {
		let downloadList = []
		this.props.list.forEach((item) => {
			let obj = this.youtubeObjToDownloadObj(item)
			downloadList.push(obj)
		})
		this.setState({ downloadList })
	}
	handleCheckboxClick(item) {
		let obj = this.youtubeObjToDownloadObj(item)
		let tempDownloadList = [...this.state.downloadList]
		// let index = tempDownloadList.indexOf(obj)
		let index = _.findIndex(tempDownloadList, (o) => { return o.id === obj.id })

		if (index !== -1) {
			tempDownloadList.splice(index, 1)
		} else {
			tempDownloadList.push(obj)
		}
		this.setState({
			downloadList: tempDownloadList
		})
	}
	clearAll() {
		this.setState({
			downloadList: []
		})
	}
	youtubeObjToDownloadObj(item) {
		return {
			id: item.resourceId.videoId,
			thumbnailUrl: item.thumbnails.default.url,
			title: item.title,
			description: item.description,
			complete: 0
		}
	}
	render() {
		let { list, isLoading } = this.props
		let renderListItem = () => {
			return list.map((item, key) => {
				let id = item.resourceId.videoId
				let isSelected = _.some(this.state.downloadList, (i) => { return i.id === id })
				return (
					<div
						className={`row ytItem ${isSelected ? 'selected' : ''}`} key={key}
						onClick={() => { this.handleCheckboxClick(item) }}
						style={{ cursor: 'pointer' }}
					>
						<div className="col-1 d-flex align-items-center">
							<input
								type="checkbox"
								onChange={()=>{}}
								checked={isSelected}
								style={{ height: 20, width: 20 }}
								value={this.state.url}
							/>
						</div>
						<div className="col-2 d-flex align-items-center">
							<img src={item.thumbnails.default.url} alt="" style={{ width: '100%' }} />
						</div>
						<div className="col-9 d-flex align-items-left" style={{ flexDirection: 'column' }}>
							<b>{item.title}</b>
							<p>
								{
									item.description.length > 200 ?
										item.description.slice(0, 100) + '...'
										:
										item.description
								}
							</p>
						</div>
					</div>
				)
			})
		}
		return (
			<div>
				<div className="input-group mb-3">
					<div className="input-group-prepend">
						<span className="input-group-text" id="inputGroup-sizing-default">Youtube Link</span>
					</div>
					<input
						type="text"
						className="form-control"
						aria-label="Sizing example input"
						aria-describedby="inputGroup-sizing-default"
						ref={'ytLink'}
						onChange={(e) => { this.setState({ url: e.target.value }) }}
					/>
					<div className="input-group-append">
						<button
							className="btn btn-success"
							type="button"
							id="button-addon2"
							onClick={this.onSubmitClick.bind(this)}
						>Submit</button>
					</div>
				</div>
				{
					!_.isEmpty(list) &&
					<div className="row">
						<div className="col-6">
							{
								_.isEmpty(this.state.downloadList) ?
									<button
										className="btn btn-block btn-primary"
										onClick={this.selectedAll.bind(this)}
									> Select All</button>
									:
									<button
										className="btn btn-block btn-danger"
										onClick={this.clearAll.bind(this)}
									> Clear All</button>
							}
						</div>
						<div className="col-6">
							<button
								className="btn btn-block btn-primary"
								onClick={this.downloadSelcted.bind(this)}
							> Download Selected </button>
						</div>
					</div>
				}
				{
					isLoading &&
					<div style={{ textAlign: 'center', marginTop: 50 }}>
						<div class="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
							<span class="sr-only">Loading...</span>
						</div>
					</div>
				}
				{
					list &&
					<div style={{ marginBottom: 45, marginTop: 10 }}>
						{renderListItem()}
					</div>
				}
			</div>
		);
	}
}

export default connect((state) => {
	return {
		list: state.mainPage.list,
		isLoading: state.mainPage.isLoading
	}
})(MainPage)
