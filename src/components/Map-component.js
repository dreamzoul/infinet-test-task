import React, { Component } from 'react';

export default class Map extends Component {
	constructor(props) {
		super(props);
		this.onScriptLoad = this.onScriptLoad.bind(this)
	}

	onScriptLoad() {
		const map = new window.google.maps.Map(
			document.getElementById(this.props.id),
			this.props.options);
		this.props.onMapLoad(map)
		map.addListener('click', event => {
			this.props.mapOnClick({ 'lat': event.latLng.lat(), 'lng': event.latLng.lng() });
			this.props.onMapLoad(map)
		})
	}

	componentDidMount() {
		if (!window.google) {
			var s = document.createElement('script');
			s.type = 'text/javascript';
			s.src = `https://maps.google.com/maps/api/js?key=AIzaSyBryIUMzglcZe3CDMbWSvK9_ydobCcDrMY&libraries=places`;
			var x = document.getElementsByTagName('script')[0];
			x.parentNode.insertBefore(s, x);
			s.addEventListener('load', e => {
				this.onScriptLoad()
			})
		} else {
			this.onScriptLoad()
		}
	}

	render() {
		return (
			<div style={{ width: '70vw', height: '100vh' }} id={this.props.id} ></div>
		);
	}
}
