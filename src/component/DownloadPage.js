import React, { Component } from 'react';
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'

class DownloadPage extends Component {
	render() {
		let { downloadingList, completeList } = this.props

		let renderListItem = () => {
			if (isEmpty(downloadingList)) {
				return <p className="text-center">Nothing is downloading</p>
			} else {
				return downloadingList.map((item, key) => {
					return (
						<div className={`row ytItem`} key={key} >
							<div className="col-2 d-flex align-items-center">
								<img src={item.thumbnailUrl} alt="" style={{ width: '100%' }} />
							</div>
							<div className="col-10 d-flex align-items-left" style={{ flexDirection: 'column' }}>
								<b>{item.title}</b>
								<br />
								<div className="progress">
									<div
										className={`progress-bar progress-bar-striped progress-bar-animated ${item.complete === 100 && 'bg-success'}`}
										role="progressbar"
										aria-valuenow={item.complete}
										aria-valuemin="0"
										aria-valuemax="100"
										style={{ width: item.complete + '%' }}
									/>
								</div>
								{
									item.complete === 100 ?
										'Download Completed, Converting....'
										:
										`Complete : ${item.complete + '%'}`
								}
							</div>
						</div>
					)
				})
			}
		}

		let renderCompleteListItem = () => {
			if (isEmpty(completeList)) { return }
			return completeList.map((item, key) => {
				return (
					<div className={`row ytItem`} key={key} >
						<div className="col-2 d-flex align-items-center">
							<img src={item.thumbnailUrl} alt="" style={{ width: '100%' }} />
						</div>
						<div className="col-10 d-flex align-items-left" style={{ flexDirection: 'column' }}>
							<b>{item.title}</b>
						</div>
					</div>
				)
			})
		}

		return (
			<div>
				<h5>Download List</h5>
				{renderListItem()}
				<h5>Complete List</h5>
				{renderCompleteListItem()}
			</div>
		);
	}
}

export default connect((state) => {
	return {
		downloadingList: state.downloadPage.downloadingList,
		completeList: state.downloadPage.completeList
	}
})(DownloadPage);
