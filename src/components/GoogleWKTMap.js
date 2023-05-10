import React, {useState} from 'react';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';

export function MapContainer({google, wkt}){

    const [state, setState] = useState({
        address: '',
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
        mapCenter: {
            lat: wkt ? wkt[1]: '20.5937',
            lng: wkt ? wkt[0] : '78.9629',
        }
    });

    return (
        <div id='googleMaps' style={{position: 'unset !important'}}>
            <Map
                zoom={18}
                google={{
                    ...google,
                    language :'es'
                }}
                bootstrapURLKeys={{
                    language: 'es',
                    region: 'es',
                }}
                initialCenter={{
                    lat: state.mapCenter.lat,
                    lng: state.mapCenter.lng
                }}
                containerStyle={{
                    width: '100%',
                    maxWidth:'100vw',
                    height: '40vh',
                    position: 'relative',
                    margin: '15px 0'
                }}
            >
                <Marker
                    position={{
                        lat: state.mapCenter.lat,
                        lng: state.mapCenter.lng
                    }} />
            </Map>
        </div>
    );
}

export default GoogleApiWrapper((props) => ({
    apiKey: ('AIzaSyBBYqXYQ_WN8pz5RSyZwN97basD2xdxfHA'),
}))(MapContainer);
