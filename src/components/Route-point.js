import React from 'react';
import { ReactComponent as Hamburger } from "../styles/icons/hamburger.svg";
import { ReactComponent as Hide } from "../styles/icons/left-arrow.svg";
import { ReactComponent as Show } from "../styles/icons/arrow-down-sign-to-navigate.svg";
import { ReactComponent as SwapCenter } from "../styles/icons/placeholder.svg";
import { ReactComponent as Delete } from "../styles/icons/recycle-bin.svg";

export default class RoutePointList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shortRecord: true
    }
  }
  render() {
    let item = this.props.item;
    return (
      <li key={item.label} onDragOver={() => this.props.onDragOver()}>
        <div className='main-container'
          draggable
          onDragStart={e => this.props.onDragStart(e)}
          onDragEnd={this.props.onDragEnd}>
          <div className="drag" >
            <Hamburger />
          </div>
          <span className="content"
            onClick={() => { this.setState({ shortRecord: !this.state.shortRecord }) }}>
            Метка №{item.label} {item.title.toLowerCase()} по координатам...
            <span className='little-icon'
              onClick={() => {
                this.props.select({ lat: item.position.lat(), lng: item.position.lng() })
              }}><SwapCenter /> </span>
            <span className='little-icon detail-status'
              onClick={() => { this.props.deleteElement() }}><Delete /></span>
            {this.state.shortRecord
              ? <span className='little-icon detail-status'><Hide /></span>
              : <span className='little-icon detail-status'><Show /></span>}
          </span>
        </div>
        {!this.state.shortRecord
          ? <div className='detail-info'>
            <span>lat: {item.position.lat()}</span>
            <span>lng: {item.position.lng()}</span>
          </div> : null}
      </li>
    )
  }
}