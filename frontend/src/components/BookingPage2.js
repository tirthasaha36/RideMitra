import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import SideMenu from './SideMenu';

mapboxgl.accessToken = 'pk.eyJ1IjoidGlydGhhMzYiLCJhIjoiY21iM2J2NGwyMDVqeDJscXU2Z2hrZ3J4biJ9.WoXVXz_PN39xA4eqVfl0GQ'; // Replace with your actual Mapbox access token

const rideOptions = [
  { id: 1, name: 'Book Any', description: 'Mini, Prime Sedan, Prime Plus', eta: '4 min', baseFare: 400, perKmRate: 20, redeem: 11 },
  { id: 6, name: 'Bike', description: 'Fast and economical bike rides', eta: '2 min', baseFare: 100, perKmRate: 10 },
  { id: 2, name: 'Auto', description: 'Quickest auto ride in town', eta: '1 min', baseFare: 150, perKmRate: 15 },
  { id: 5, name: 'Mini', description: 'Comfy, economical cars', eta: '5 min', baseFare: 200, perKmRate: 18 },
  { id: 3, name: 'Prime Plus', description: 'Ride in utmost comfort', eta: '4 min', baseFare: 250, perKmRate: 22 },
  { id: 4, name: 'Prime Sedan', description: 'Top sedans', eta: '5 min', baseFare: 230, perKmRate: 20 },
  { id: 7, name: 'Prime SUV', description: 'Extra large SUVs for groups', eta: '6 min', baseFare: 300, perKmRate: 25 },
];

const paymentOptions = [
  { id: 1, label: 'Cash', icon: '💵' },
  { id: 2, label: 'Coupon', icon: '🏷️' },
  { id: 3, label: 'Myself', icon: '👤' },
];

// Haversine formula to calculate distance in km between two lat/lng points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const BookingPage2 = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const pickupGeocoderRef = useRef(null);
  const dropGeocoderRef = useRef(null);
  const [pickup, setPickup] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);
  const [rideFares, setRideFares] = useState({});
  const [selectedRideId, setSelectedRideId] = useState(1);
  const [distance, setDistance] = useState(null);
  const [showSideMenu, setShowSideMenu] = useState(false);

  // Initialize map and geocoders
  useEffect(() => {
    if (mapRef.current) return; // initialize map only once

    // Check container size for debugging
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      console.log('Map container size:', rect.width, rect.height);
    }

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [78.9629, 20.5937], // India center
      zoom: 4,
    });

    mapRef.current.on('styledata', () => {
      console.log('Map style loaded');
    });

    mapRef.current.on('error', (e) => {
      console.error('Mapbox error:', e.error ? e.error.message : e);
    });

    // Add navigation control (zoom buttons)
    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Initialize pickup geocoder
    pickupGeocoderRef.current = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      placeholder: 'Enter pickup location',
      mapboxgl: mapboxgl,
      marker: false,
    });
    document.getElementById('pickup-geocoder').appendChild(pickupGeocoderRef.current.onAdd(mapRef.current));
    pickupGeocoderRef.current.on('result', (e) => {
      const coords = e.result.center;
      setPickup({ lat: coords[1], lng: coords[0], address: e.result.place_name });
    });

    // Initialize drop geocoder
    dropGeocoderRef.current = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      placeholder: 'Enter drop location',
      mapboxgl: mapboxgl,
      marker: false,
    });
    document.getElementById('drop-geocoder').appendChild(dropGeocoderRef.current.onAdd(mapRef.current));
    dropGeocoderRef.current.on('result', (e) => {
      const coords = e.result.center;
      setDropLocation({ lat: coords[1], lng: coords[0], address: e.result.place_name });
    });

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  // Update markers and route when pickup or drop changes
  useEffect(() => {
    if (!mapRef.current || !(mapRef.current.isStyleLoaded && mapRef.current.isStyleLoaded())) return;
    if (!(mapRef.current.getLayer && mapRef.current.getSource)) return;

    // Remove existing markers and route layers
    if (mapRef.current.getLayer('route')) {
      mapRef.current.removeLayer('route');
    }
    if (mapRef.current.getSource('route')) {
      mapRef.current.removeSource('route');
    }
    if (mapRef.current.pickupMarker) {
      mapRef.current.pickupMarker.remove();
      mapRef.current.pickupMarker = null;
    }
    if (mapRef.current.dropMarker) {
      mapRef.current.dropMarker.remove();
      mapRef.current.dropMarker = null;
    }

    if (pickup) {
      mapRef.current.pickupMarker = new mapboxgl.Marker({ color: 'green' })
        .setLngLat([pickup.lng, pickup.lat])
        .addTo(mapRef.current);
    }
    if (dropLocation) {
      mapRef.current.dropMarker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat([dropLocation.lng, dropLocation.lat])
        .addTo(mapRef.current);
    }

    if (pickup && dropLocation) {
      // Fit map bounds to markers
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([pickup.lng, pickup.lat]);
      bounds.extend([dropLocation.lng, dropLocation.lat]);
      mapRef.current.fitBounds(bounds, { padding: 50 });

      // Calculate distance
      const dist = calculateDistance(pickup.lat, pickup.lng, dropLocation.lat, dropLocation.lng);
      setDistance(dist);

      // Calculate fares
      const fares = {};
      rideOptions.forEach((ride) => {
        const fare = ride.baseFare + dist * ride.perKmRate;
        fares[ride.id] = Math.round(fare);
      });
      // Calculate range for 'Book Any'
      const miniRide = rideOptions.find(r => r.name === 'Mini');
      const primePlusRide = rideOptions.find(r => r.name === 'Prime Plus');
      if (miniRide && primePlusRide) {
        const miniFare = Math.round(miniRide.baseFare + dist * miniRide.perKmRate);
        const primePlusFare = Math.round(primePlusRide.baseFare + dist * primePlusRide.perKmRate);
        fares[1] = `₹${miniFare} - ₹${primePlusFare}`;
      }
      setRideFares(fares);

      // Fetch and display route using Mapbox Directions API
      const directionsRequest = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.lng},${pickup.lat};${dropLocation.lng},${dropLocation.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
      fetch(directionsRequest)
        .then(res => res.json())
        .then(data => {
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0].geometry;
            if (mapRef.current.getSource('route')) {
              mapRef.current.getSource('route').setData(route);
            } else {
              mapRef.current.addSource('route', {
                type: 'geojson',
                data: route,
              });
              mapRef.current.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round',
                },
                paint: {
                  'line-color': '#3887be',
                  'line-width': 5,
                  'line-opacity': 0.75,
                },
              });
            }
          }
        })
        .catch(err => {
          console.error('Error fetching directions:', err);
        });
    } else {
      setDistance(null);
      setRideFares({});
    }
  }, [pickup, dropLocation]);

  const handleBookRide = () => {
    if (!pickup) {
      alert('Please select pickup location.');
      return;
    }
    alert(`Ride booked!\nPickup: ${pickup.address}`);
  };

  return (
    <>
      <div style={styles.topBarContainer}>
        <button style={styles.menuButton} aria-label="Menu" onClick={() => setShowSideMenu(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div id="pickup-geocoder" style={styles.geocoderContainer}></div>
        <div id="drop-geocoder" style={styles.geocoderContainer}></div>
      </div>

      <div ref={mapContainerRef} style={styles.mapContainer} />

      <div style={styles.rideOptionsContainer}>
        {rideOptions.map((ride) => (
          <div
            key={ride.id}
            style={{
              ...styles.rideOption,
              backgroundColor: selectedRideId === ride.id ? '#FFF3CD' : 'transparent',
              borderRadius: selectedRideId === ride.id ? 5 : 0,
              cursor: 'pointer',
            }}
            onClick={() => setSelectedRideId(ride.id)}
          >
            <div style={styles.rideOptionLeft}>
              <div style={styles.rideEta}>{ride.eta}</div>
              <div style={styles.rideName}>{ride.name}</div>
              <div style={styles.rideDescription}>{ride.description}</div>
            </div>
            <div style={styles.rideFare}>
              {ride.id === 1
                ? rideFares[1] || '₹--'
                : rideFares[ride.id]
                ? `₹${rideFares[ride.id]}`
                : '₹--'}
            </div>
          </div>
        ))}
      </div>

      <div style={styles.bottomBar}>
        <div className="payment-options" style={styles.paymentOptions}>
          {paymentOptions.map((option) => (
            <div key={option.id} style={styles.paymentOption}>
              <span style={styles.paymentIcon}>{option.icon}</span>
              <span>{option.label}</span>
            </div>
          ))}
        </div>
        <button style={styles.bookButton} onClick={handleBookRide}>
          {selectedRideId === 1 ? 'Book Any' : `Book ${rideOptions.find(r => r.id === selectedRideId)?.name}`}
        </button>
      </div>

      {showSideMenu && <SideMenu onClose={() => setShowSideMenu(false)} />}
    </>
  );
};

const styles = {
  topBarContainer: {
    position: 'fixed',
    top: 10,
    left: 15,
    right: 15,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 10,
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    zIndex: 25,
  },
  geocoderContainer: {
    flex: 1,
    minWidth: 0,
  },
  mapContainer: {
    position: 'fixed',
    top: 80,
    left: 0,
    right: 0,
    bottom: 70,
    zIndex: 10,
  },
  rideOptionsContainer: {
    position: 'fixed',
    top: '60vh',
    left: 0,
    right: 0,
    bottom: 70,
    backgroundColor: 'white',
    padding: 15,
    overflowY: 'auto',
    zIndex: 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  rideOption: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #eee',
  },
  rideOptionLeft: {
    display: 'flex',
    flexDirection: 'column',
  },
  rideEta: {
    fontSize: 12,
    color: '#666',
  },
  rideName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  rideDescription: {
    fontSize: 12,
    color: '#666',
  },
  rideFare: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'white',
    borderTop: '1px solid #ddd',
    display: 'flex',
    alignItems: 'center',
    padding: '0 15px',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  paymentOptions: {
    display: 'flex',
    gap: 20,
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 14,
    cursor: 'pointer',
  },
  paymentIcon: {
    fontSize: 18,
  },
  bookButton: {
    backgroundColor: '#FFC107',
    color: 'white',
    padding: '12px 15px',
    borderRadius: 30,
    border: 'none',
    fontSize: 16,
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'Arial, sans-serif',
    width: 260,
    textAlign: 'center',
    boxSizing: 'border-box',
    whiteSpace: 'normal',
  },
  menuButton: {
    width: 30,
    height: 24,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
  },
};

export default BookingPage2;
