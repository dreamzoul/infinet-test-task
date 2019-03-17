import React, { Component } from 'react';
import './App.css';
import MapComponent from './components/Map-component';
import RoutePointList from './components/Route-point-list';
import './styles/App-custom.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      markerList: [],
      polyline: null,
      options: {
        center: { lat: 56.837973180266616, lng: 60.597465976732224 },
        zoom: 12
      },
      inputEnable: false,
    }
    //Привязка контекста к методам класса
    this.markerCreate.bind(this);
    this.paintPolyline.bind(this);
    this.createSearchBox.bind(this);
    this.placeSelected.bind(this);
    this.updateMarkerList.bind(this);
    //this.deleteAllMarkers.bind(this);
  }

  //Добавление метки на карту
  markerCreate(coords) {
    let tempArr = this.state.markerList;
    let marker = new window.google.maps.Marker({
      map: this.state.map,
      position: coords,
      draggable: true,
      label: (tempArr.length + 1).toString(),
      title: 'Установлена вручную',
    });
    marker.addListener('drag', () => { this.paintPolyline() });
    tempArr.push(marker);
    this.setState({ markerList: tempArr }, this.paintPolyline);
  }

  //Обновить маркеры на карте при удалении или смене порядка
  updateMarkerList(val) {
    console.log(typeof val);
    if (typeof val === 'number') {
      this.state.markerList[val].setMap(null);
      let temp = this.state.markerList;
      temp.splice(val, 1)
      this.setState(
        { markerList: temp },
        this.paintPolyline()
      );
    } else if (typeof val === 'object') {
      this.setState(
        { markerList: val }, this.paintPolyline()
      );
    }
  }

  //Нарисовать линию соединяющую метки на карте
  paintPolyline() {
    let markerCoords = this.state.markerList.map(point => {
      return { lat: point.getPosition().lat(), lng: point.getPosition().lng() }
    })
    if (this.state.polyline)
      this.state.polyline.setMap(null);
    let flightPath = new window.google.maps.Polyline({
      path: markerCoords,
      geodesic: true,
      strokeColor: '#6288fa',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    flightPath.setMap(this.state.map);
    this.setState({ polyline: flightPath });
  }

  //Добавление поиска по местам на карту
  createSearchBox() {
    let input = document.getElementById('pac-input');
    let searchBox = new window.google.maps.places.SearchBox(input);
    this.setState({ inputEnable: true })
    this.state.map.addListener('bounds_changed', () => {
      searchBox.setBounds(this.state.map.getBounds());
    });
    searchBox.addListener('places_changed', () => {
      this.placeSelected(searchBox.getPlaces())
    })
  }

  //Событие выбора места из SeachBox 
  placeSelected(places) {
    if (!places.length)
      return;
    let request = {
      query: places[0].name,    //"проспект Ленина, Екатеринбург, Россия"
      fields: ['name', 'geometry'],
    };
    let service = this.state.service;
    service.findPlaceFromQuery(request, function (results, status) {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++) {
          let coords = {
            lat: results[i].geometry.location.lat(),
            lng: results[i].geometry.location.lng()
          };
          this.markerCreate(coords);
        }
      }
    });
  }

  render() {
    return (
      <div className='App'>
        <MapComponent
          id='myMap'
          options={this.state.options}
          mapOnClick={coords => this.markerCreate(coords)}
          onMapLoad={map => {
            this.setState({
              map: map,
              service: new window.google.maps.places.PlacesService(map),
            }, () => {
              this.createSearchBox()
            })
          }}
        />
        <RoutePointList
          markerList={this.state.markerList}
          clickOnPoint={(res) => {
            this.state.map.panTo(res);
          }}
          reorder={(res) => {
            this.updateMarkerList(res);
          }} />
        <input id='pac-input' type='text' placeholder='Поиск по местам'
          className={this.state.inputEnable ? 'controls' : 'controls disable'} />
      </div>
    );
  }
}
