import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import SideMenu from './SideMenu';

import BikeImage from '../assets/images/Bike.png';
import HourlyRentalImage from '../assets/images/HourlyRental.png';
import SUVImage from '../assets/images/SUV.png';
import MiniImage from '../assets/images/Mini.png';
import SedanImage from '../assets/images/Sedan.png';
import BookAnyImage from '../assets/images/BookAny.png';
import AutoImage from '../assets/images/Auto.png';

mapboxgl.accessToken = 'pk.eyJ1IjoidGlydGhhMzYiLCJhIjoiY21iM2J2NGwyMDVqeDJscXU2Z2hrZ3J4biJ9.WoXVXz_PN39xA4eqVfl0GQ'; // Replace with your actual Mapbox access token

const rideOptions = [
  { id: 1, name: 'Book Any', description: 'Mini, Prime Sedan, Prime Plus', eta: '4 min', baseFare: 400, perKmRate: 20, redeem: 11, image: BookAnyImage },
  { id: 6, name: 'MotoGo', description: 'Fast and economical bike rides', eta: '2 min', baseFare: 100, perKmRate: 10, image: BikeImage },
  { id: 2, name: 'TukTuk', description: 'Quickest auto ride in town', eta: '1 min', baseFare: 150, perKmRate: 15, image: AutoImage },
  { id: 5, name: 'GoLite', description: 'Comfy, economical cars', eta: '5 min', baseFare: 200, perKmRate: 18, image: MiniImage },
  { id: 3, name: 'Ride+', description: 'Ride in utmost comfort', eta: '4 min', baseFare: 250, perKmRate: 22, image: SedanImage },
  { id: 4, name: 'SmoothGo', description: 'Top sedans', eta: '5 min', baseFare: 230, perKmRate: 20, image: SedanImage },
  { id: 7, name: 'MaxCab', description: 'Extra large SUVs for groups', eta: '6 min', baseFare: 300, perKmRate: 25, image: SUVImage },
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
    if (!mapContainerRef.current) {
      console.error('Map container ref is null');
      return;
    }
    if (mapRef.current) {
      return; // initialize map only once
    }

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [78.9629, 20.5937],
      zoom: 4,
    });

    mapRef.current.on('load', () => {
      mapRef.current.resize();
    });

    // Initialize pickup geocoder
    pickupGeocoderRef.current = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      placeholder: 'Enter pickup location',
      mapboxgl: mapboxgl,
      marker: false,
      collapsed: false, // ensure suggestions dropdown is shown
      zoom: 14, // zoom level when selecting a location
      flyTo: true, // fly to location on selection
      proximity: mapRef.current ? mapRef.current.getCenter().toArray() : undefined,
      countries: 'in',
    });
    const pickupGeocoderContainer = document.getElementById('pickup-geocoder');
    if (pickupGeocoderContainer) {
      while (pickupGeocoderContainer.firstChild) {
        pickupGeocoderContainer.removeChild(pickupGeocoderContainer.firstChild);
      }
      pickupGeocoderContainer.appendChild(pickupGeocoderRef.current.onAdd(mapRef.current));
    }
    pickupGeocoderRef.current.on('result', (e) => {
      const coords = e.result.center;
      setPickup({ lat: coords[1], lng: coords[0], address: e.result.place_name });
    });
    pickupGeocoderRef.current.on('error', (e) => {
      console.error('Pickup geocoder error event:', e);
    });

    // Initialize drop geocoder
    dropGeocoderRef.current = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      placeholder: 'Enter drop location',
      mapboxgl: mapboxgl,
      marker: false,
      collapsed: false, // ensure suggestions dropdown is shown
      zoom: 14, // zoom level when selecting a location
      flyTo: true, // fly to location on selection
      proximity: mapRef.current ? mapRef.current.getCenter().toArray() : undefined,
      countries: 'in',
    });
    const dropGeocoderContainer = document.getElementById('drop-geocoder');
    if (dropGeocoderContainer) {
      while (dropGeocoderContainer.firstChild) {
        dropGeocoderContainer.removeChild(dropGeocoderContainer.firstChild);
      }
      dropGeocoderContainer.appendChild(dropGeocoderRef.current.onAdd(mapRef.current));
    }
    dropGeocoderRef.current.on('result', (e) => {
      const coords = e.result.center;
      setDropLocation({ lat: coords[1], lng: coords[0], address: e.result.place_name });
    });
    dropGeocoderRef.current.on('error', (e) => {
      console.error('Drop geocoder error event:', e);
    });

    // Apply inline styles to geocoder input boxes after they are rendered
    setTimeout(() => {
      const pickupInput = document.querySelector('#pickup-geocoder input.mapboxgl-ctrl-geocoder--input');
      if (pickupInput) {
        pickupInput.style.borderRadius = '30px';
        pickupInput.style.padding = '12px 40px 12px 40px'; // increased left and right padding to avoid overlap with search icon
        pickupInput.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        pickupInput.style.width = '100%';
        pickupInput.style.fontSize = '16px';
        pickupInput.style.outline = 'none';
        pickupInput.style.border = '1px solid #ddd';
        pickupInput.style.boxSizing = 'border-box';
        pickupInput.style.position = 'relative';
        pickupInput.style.zIndex = '1002';
        const pickupParent = pickupInput.closest('.mapboxgl-ctrl-geocoder.mapboxgl-ctrl');
        if (pickupParent) {
          pickupParent.style.borderRadius = '30px';
          pickupParent.style.overflow = 'visible';
          pickupParent.style.position = 'relative';
          pickupParent.style.zIndex = '1000';
          pickupParent.style.width = '100%'; // Added to expand parent container fully
          pickupParent.style.maxWidth = 'none'; // Remove max width if any
        }
        // Fix cross button pointer events
        const pickupClearBtn = pickupParent.querySelector('.mapboxgl-ctrl-geocoder--button');
        if (pickupClearBtn) {
          pickupClearBtn.style.pointerEvents = 'auto';
          pickupClearBtn.style.zIndex = '1003';
        }
      }
      const dropInput = document.querySelector('#drop-geocoder input.mapboxgl-ctrl-geocoder--input');
      if (dropInput) {
        dropInput.style.borderRadius = '30px';
        dropInput.style.padding = '12px 40px 12px 40px'; // increased left and right padding to avoid overlap with search icon
        dropInput.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        dropInput.style.width = '100%';
        dropInput.style.fontSize = '16px';
        dropInput.style.outline = 'none';
        dropInput.style.border = '1px solid #ddd';
        dropInput.style.boxSizing = 'border-box';
        dropInput.style.position = 'relative';
        dropInput.style.zIndex = '1001';
        const dropParent = dropInput.closest('.mapboxgl-ctrl-geocoder.mapboxgl-ctrl');
        if (dropParent) {
          dropParent.style.borderRadius = '30px';
          dropParent.style.overflow = 'visible';
          dropParent.style.position = 'relative';
          dropParent.style.zIndex = '1000';
          dropParent.style.width = '100%'; // Added to expand parent container fully
          dropParent.style.maxWidth = 'none'; // Remove max width if any
        }
        // Fix cross button pointer events
        const dropClearBtn = dropParent.querySelector('.mapboxgl-ctrl-geocoder--button');
        if (dropClearBtn) {
          dropClearBtn.style.pointerEvents = 'auto';
          dropClearBtn.style.zIndex = '1003';
        }
      }
    }, 100);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers and route when pickup or drop changes
  useEffect(() => {
    if (!mapRef.current || !(mapRef.current.isStyleLoaded && mapRef.current.isStyleLoaded())) return;

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
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([pickup.lng, pickup.lat]);
      bounds.extend([dropLocation.lng, dropLocation.lat]);
      mapRef.current.fitBounds(bounds, { padding: 50 });

      const dist = calculateDistance(pickup.lat, pickup.lng, dropLocation.lat, dropLocation.lng);
      setDistance(dist);

      const fares = {};
      rideOptions.forEach((ride) => {
        const fare = ride.baseFare + dist * ride.perKmRate;
        fares[ride.id] = Math.round(fare);
      });
      const miniRide = rideOptions.find(r => r.name === 'Mini');
      const primePlusRide = rideOptions.find(r => r.name === 'Prime Plus');
      if (miniRide && primePlusRide) {
        const miniFare = Math.round(miniRide.baseFare + dist * miniRide.perKmRate);
        const primePlusFare = Math.round(primePlusRide.baseFare + dist * primePlusRide.perKmRate);
        fares[1] = `₹${miniFare} - ₹${primePlusFare}`;
      }
      setRideFares(fares);

      const directionsRequest = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.lng},${pickup.lat};${dropLocation.lng},${dropLocation.lat}?geometries=geojson&overview=full&steps=true&access_token=${mapboxgl.accessToken}`;
      fetch(directionsRequest)
        .then(res => res.json())
        .then(data => {
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0].geometry;
            const routeGeoJSON = {
              type: 'Feature',
              properties: {},
              geometry: route,
            };
            if (mapRef.current.getSource('route')) {
              mapRef.current.getSource('route').setData(routeGeoJSON);
            } else {
              mapRef.current.addSource('route', {
                type: 'geojson',
                data: routeGeoJSON,
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
      <div ref={mapContainerRef} style={styles.mapContainer} />

      <div className="topBarContainer" style={styles.topBarContainer}>
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100%' }}>
          <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 10 }}>
            <button className="menuButton" aria-label="Menu" onClick={() => setShowSideMenu(true)}>
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
          </div>
          <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1000 }}>
            <div id="pickup-geocoder" className="geocoderContainer" style={{ width: '100%', position: 'relative', zIndex: 1100 }}></div>
          <div id="drop-geocoder" className="geocoderContainer dropGeocoderSeparate" style={{ marginTop: 6, width: '100%', position: 'relative', zIndex: 1000 }}></div>
          </div>
        </div>
      </div>

      {/* Dummy My Location Button */}
      <button
        style={{ ...styles.myLocationButton, top: window.innerWidth <= 600 ? 510 : 400 }}
        onClick={() => {
          // Dummy handler for now
        }}
        aria-label="Use my current location"
        title="Use my current location"
      >
        <img
          src="https://img.icons8.com/?size=100&id=60991&format=png&color=000000"
          alt="My Location"
          width={24}
          height={24}
          style={{ display: 'block', margin: 'auto' }}
        />
      </button>

      {/* Removed separate dropContainer div */}

      <div style={styles.rideOptionsContainer}>
        {rideOptions.map((ride) => (
          <div
            key={ride.id}
          style={{
              ...styles.rideOption,
              backgroundColor: selectedRideId === ride.id ? '#FFF3CD' : 'transparent',
              borderRadius: selectedRideId === ride.id ? 8 : 0,
              cursor: 'pointer',
              border: selectedRideId === ride.id ? '1.5px solid #FFC107' : 'none',
              boxShadow: selectedRideId === ride.id ? '0 1px px rgba(255, 193, 7, 0.5)' : 'none',
              padding: selectedRideId === ride.id ? '12px 10px' : '10px 0',
            }}
            onClick={() => setSelectedRideId(ride.id)}
          >
          <div style={styles.rideOptionLeft}>
            <div style={styles.rideImageContainer}>
              <img src={ride.image} alt={ride.name} style={styles.rideImage} />
              <div style={styles.rideEta}>{ride.eta}</div>
            </div>
            <div style={styles.rideTextContainer}>
              <div style={styles.rideName}>{ride.name}</div>
              <div style={styles.rideDescription}>{ride.description}</div>
            </div>
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
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    minHeight: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(5px)',
    WebkitBackdropFilter: 'blur(5px)',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 10,
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    zIndex: 30,
    flexDirection: 'row', // horizontal layout
    pointerEvents: 'auto',
    width: '100%',
  },
  rideImage: {
    width: 40,
    height: 40,
    objectFit: 'contain',
  },
  geocoderContainer: {
    position: 'relative',
    height: '50px',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  menuPickupContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dropGeocoderSeparate: {
    position: 'relative',
    height: '50px',
    backgroundColor: 'white',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  '@media (min-width: 801px)': {
    geocoderContainer: {
      width: '100%',
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 10,
      paddingBottom: 10,
      maxWidth: 'none', // remove max width to allow full expansion
      boxSizing: 'border-box',
      flexGrow: 1,
    },
    dropGeocoderSeparate: {
      width: '100%',
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 10,
      paddingBottom: 10,
      maxWidth: 'none', // remove max width to allow full expansion
      boxSizing: 'border-box',
      flexGrow: 1,
    },
  },
  '@media (max-width: 600px)': {
    topBarContainer: {
      flexDirection: 'column',
      alignItems: 'stretch',
      padding: 10,
      gap: 10,
    },
    geocoderContainer: {
      width: '100%',
      borderRadius: 30,
      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      padding: '8px 12px',
      backgroundColor: 'white',
    },
    menuButton: {
      alignSelf: 'flex-start',
      marginBottom: 10,
    },
  },
  mapContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: '30vh', // changed to leave 30% space at bottom
    zIndex: 5, 
    height: '70vh', // changed to 70% of viewport height
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
    transition: 'border 0.3s ease, box-shadow 0.3s ease, padding 0.3s ease',
  },
  rideOptionLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  rideEta: {
    fontSize: 12,
    color: '#666',
    marginLeft: 0,
    marginTop: 1,
    alignSelf: 'flex-start',
    paddingLeft: 6,
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
    gap: 10,
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
  myLocationButton: {
    position: 'fixed',
    top: '61%',
    right: 20,
    transform: 'translateY(-50%)',
    zIndex: 40,
    backgroundColor: 'white',
    border: 'none',
    width: 48,
    height: 48,
    padding: 0,
    borderRadius: '50%',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
'@media (min-width: 801px)': {
  myLocationButton: {
    top: '55%',
  },
},
  rideImageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
};

export default BookingPage2;
