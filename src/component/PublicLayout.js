import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link  } from 'react-router-dom'
// eslint-disable-next-line 
import style from '../App.css'

class PublicLayout extends Component {
	constructor(props){
		super (props)
		this.state = {
			currentPage: 'home'
		}
	}
	componentDidMount(){
		require('./listener')(this.props.dispatch)
	}
	render() {
		let { list } = this.props;
		let renderRouteItem = () => {
			let routeArray = ['home', 'download', 'setting']
			return routeArray.map((item, key)=>{
				return (
					<Link 
						className={`nav-link nav-item ${this.state.currentPage === item && 'active'}`}
						key={key}
						// href="#"
						to={item === 'home' ? '/' : item}
						onClick={()=>{
							this.setState({
								currentPage: item
							})
						}}
					>
						{
							key === 1 && list.length > 0 &&
							<span className="badge badge-pill badge-danger" style={{marginRight: 10}}>
								{list.length}
							</span>
						}
						{item.toUpperCase()}
					</Link>
				)
			})
		}

		return (
			<div style={{display: 'flex', flexDirection: 'column'}}>
				<div className="alert alert-primary text-center" role="alert">
					Youtube To MP3
				</div>
				<div className="container my-2" style={{minHeight: 515}}>
					{this.props.children}
				</div>
				<div className="footer">
					<nav  className="nav nav-pills nav-fill px-1">
						{renderRouteItem()}
					</nav >
				</div>
			</div>
		);
	}
}

export default connect((state)=>{
	return {
		list: state.downloadPage.list
	}
})(PublicLayout);
