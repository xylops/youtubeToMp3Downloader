import React, { Component } from 'react';
import { connect } from 'react-redux'
import _ from 'lodash'

class DownloadPage extends Component {
	render() {
		let { list } = this.props

		let renderListItem = () => {
			if(_.isEmpty(list)){
				return <h5 className="text-center">Nothing is downloading</h5>
			} else {
				return list.map((item, key)=>{
					return (
						<div className={`row ytItem`} key={key} >
							<div className="col-2 d-flex align-items-center">
								<img src={item.thumbnailUrl} alt="" style={{ width: '100%' }} />
							</div>
							<div className="col-10 d-flex align-items-left" style={{ flexDirection: 'column' }}>
								<b>{item.title}</b>
								<br/>
								<div className="progress">
									<div 
										className={`progress-bar progress-bar-striped progress-bar-animated ${item.complete === 100 && 'bg-success' }`} 
										role="progressbar" 
										aria-valuenow={item.complete}
										aria-valuemin="0" 
										aria-valuemax="100" 
										style={{width: item.complete + '%'}}
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

		return (
			<div>
				{renderListItem()}
			</div>
		);
	}
}

export default connect((state) => {
	return {
		list: state.downloadPage.list,
	}
})(DownloadPage);
