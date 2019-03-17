import React from "react";
import RoutePoint from './Route-point'
import "../styles/Route-point-list.css";

export default class RoutePointList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      markerList: null,
      draggedItem: null,
      draggedIdx: null,
    }
  }

  onDragStart = (e, index) => {
    this.setState({ draggedItem: this.props.markerList[index] })
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  onDragOver = index => {
    // если элемент перетаскивается на себя, игнорировать
    if (this.state.draggedItem === this.props.markerList[index]) {
      return;
    }
    // отфильтровать текущий перетаскиваемый элемент
    let markerList = this.props.markerList.filter(item => item !== this.state.draggedItem);
    // добавить перетаскиваемый элемент после перетаскиваемого элемента
    markerList.splice(index, 0, this.state.draggedItem);
    this.props.reorder(markerList);
  };

  onDragEnd = () => {
    this.setState({ draggedIdx: null })
  };

  render() {
    return (
      <div className="route-point-list">
        <main>
          <h3>Список маркеров</h3>
          <ul>
            {this.props.markerList.length > 0 ?
              this.props.markerList.map((item, idx) => {
                return <RoutePoint
                  item={item}
                  select={(position) => { this.props.clickOnPoint(position) }}
                  onDragStart={(e) => this.onDragStart(e, idx)}
                  onDragEnd={this.onDragEnd}
                  onDragOver={() => this.onDragOver(idx)}
                  deleteElement={() => {
                    this.props.reorder(idx);
                  }}
                />
              })
              : <div className='attation'>Здесь будут отображаться отмеченные точки на карте</div>
            }
          </ul>
        </main>
      </div>
    );
  }
}
