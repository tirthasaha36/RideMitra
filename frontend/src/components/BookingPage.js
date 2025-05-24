import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import SideMenu from './SideMenu';

const containerStyle = {
  width: '100vw',
  height: 'calc(100vh - 80px)',  // Adjust height to fill below top bar container (approx 80px height)
  position: 'relative',
  zIndex: 1,
};

const mapContainer = {
  position: 'fixed',
  top: 80,
  left: 0,
  right: 0,
  bottom: 70,
  zIndex: 10,
};

const center = {
  lat: 20.5937,
  lng: 78.9629,
};

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

const BookingPage = ({ onBack }) => {
  const [pickup, setPickup] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [dropLocation, setDropLocation] = useState(null);
  const [dropInputValue, setDropInputValue] = useState('');
  const [distance, setDistance] = useState(null);
  const [rideFares, setRideFares] = useState({});
  const [directions, setDirections] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState(center);
  const [selectedRideId, setSelectedRideId] = useState(1); // default to 'Book Any'
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [showSideMenu, setShowSideMenu] = useState(false);

  const pickupRef = useRef(null);
  const dropRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (pickup && dropLocation) {
      const dist = calculateDistance(pickup.lat, pickup.lng, dropLocation.lat, dropLocation.lng);
      setDistance(dist);

      // Calculate fares for each ride option
      const fares = {};
      rideOptions.forEach((ride) => {
        const fare = ride.baseFare + dist * ride.perKmRate;
        fares[ride.id] = Math.round(fare);
      });

      // Calculate range for 'Book Any' from Mini to Prime Plus
      const miniRide = rideOptions.find(r => r.name === 'Mini');
      const primePlusRide = rideOptions.find(r => r.name === 'Prime Plus');
      if (miniRide && primePlusRide) {
        const miniFare = Math.round(miniRide.baseFare + dist * miniRide.perKmRate);
        const primePlusFare = Math.round(primePlusRide.baseFare + dist * primePlusRide.perKmRate);
        fares[1] = `₹${miniFare} - ₹${primePlusFare}`;
      }

      setRideFares(fares);
    } else {
      setDistance(null);
      setRideFares({});
    }
  }, [pickup, dropLocation]);
  
  useEffect(() => {
    if (pickup) {
      setDistance(null);
      setDirections(null);
      setInputValue(pickup.address);
      setMapCenter({ lat: pickup.lat, lng: pickup.lng });
    }
  }, [pickup]);

  useEffect(() => {
    if (pickup && dropLocation && mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(new window.google.maps.LatLng(pickup.lat, pickup.lng));
      bounds.extend(new window.google.maps.LatLng(dropLocation.lat, dropLocation.lng));
      mapRef.current.fitBounds(bounds);
    }
  }, [pickup, dropLocation]);

  const onLoadMap = (map) => {
    mapRef.current = map;
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (pickup) {
      setDistance(null);
      setDirections(null);
      setInputValue(pickup.address);
      setMapCenter({ lat: pickup.lat, lng: pickup.lng });
    }
  }, [pickup]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onLoadPickup = (autocomplete) => {
    pickupRef.current = autocomplete;
  };

  const onPlaceChangedPickup = () => {
    if (pickupRef.current !== null) {
      const place = pickupRef.current.getPlace();
      if (place && place.geometry && place.geometry.location) {
        setPickup({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address || '',
        });
        setInputValue(place.formatted_address || '');
      } else {
        console.error('Selected place has no geometry or location');
      }
    }
  };

  const onLoadDrop = (autocomplete) => {
    dropRef.current = autocomplete;
  };

  const onPlaceChangedDrop = () => {
    if (dropRef.current !== null) {
      const place = dropRef.current.getPlace();
      if (place && place.geometry && place.geometry.location) {
        setDropLocation({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address || '',
        });
        setDropInputValue(place.formatted_address || '');
      } else {
        console.error('Selected drop place has no geometry or location');
      }
    }
  };

  const directionsCallback = (response) => {
    if (response !== null) {
      if (response.status === 'OK') {
        setDirections(response);
      } else {
        console.error('Directions request failed due to ' + response.status);
      }
    }
  };

  const handleLoadScript = () => {
    setScriptLoaded(true);
  };

  const handleBookRide = () => {
    if (!pickup) {
      alert('Please select pickup location.');
      return;
    }
    alert(`Ride booked!\nPickup: ${pickup.address}`);
  };

  return (
    <>
      <LoadScript
        googleMapsApiKey="AIzaSyDrHVMgjjtj-roJ3M_2eUVLyeoKFLgv1kk"
        libraries={['places']}
        onLoad={handleLoadScript}
      >
        {scriptLoaded && (
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
              <div style={styles.pickupInputContainer}>
                <Autocomplete onLoad={onLoadPickup} onPlaceChanged={onPlaceChangedPickup}>
                  <input
                    type="text"
                    placeholder="Enter pickup location"
                    style={styles.pickupInputWithClear}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </Autocomplete>
                {inputValue && (
                  <button
                    style={{ ...styles.clearButton, right: 10 }}
                    onClick={() => {
                      setInputValue('');
                      setPickup(null);
                    }}
                    aria-label="Clear pickup location"
                  >
                    &times;
                  </button>
                )}
              </div>
              <div style={{ ...styles.pickupContainer, marginTop: 20 }}>
                <Autocomplete onLoad={onLoadDrop} onPlaceChanged={onPlaceChangedDrop}>
                  <input
                    type="text"
                    placeholder="Enter drop location"
                    style={styles.pickupInputWithClear}
                    value={dropInputValue}
                    onChange={(e) => setDropInputValue(e.target.value)}
                  />
                </Autocomplete>
                {dropInputValue && (
                  <button
                    style={{ ...styles.clearButton, right: 20 }}
                    onClick={() => {
                      setDropInputValue('');
                      setDropLocation(null);
                    }}
                    aria-label="Clear drop location"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>

            <div style={styles.mapContainer}>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={12}
                options={{
                  mapTypeControl: false,
                  streetViewControl: false,
                  fullscreenControl: false,
                  zoomControl: true,
                  keyboardShortcuts: true,
                  disableDefaultUI: false,
                  draggable: true,
                }}
                onLoad={onLoadMap}
              >
                {pickup && <Marker position={{ lat: pickup.lat, lng: pickup.lng }} />}
                {dropLocation && <Marker position={{ lat: dropLocation.lat, lng: dropLocation.lng }} />}
                {pickup && dropLocation && (
                  <DirectionsService
                    options={{
                      origin: { lat: pickup.lat, lng: pickup.lng },
                      destination: { lat: dropLocation.lat, lng: dropLocation.lng },
                      travelMode: 'DRIVING',
                    }}
                    callback={directionsCallback}
                  />
                )}
                {directions && (
                  <DirectionsRenderer
                    options={{
                      directions: directions,
                      preserveViewport: true,
                    }}
                  />
                )}
              </GoogleMap>
            </div>

            <>
              <button
                style={styles.myLocationButton}
                onClick={() => {
                  // Dummy handler for now
                }}
                aria-label="Use my current location"
                title="Use my current location"
              >
                <img
                  src="https://img.icons8.com/?size=100&id=60991&format=png&color=000000"
                  alt="My Location"
                  width="24"
                  height="24"
                  style={{ display: 'block', margin: 'auto' }}
                />
              </button>
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
            </>

            <div style={styles.bottomBar}>
              <div
                className="payment-options"
                style={{
                  ...styles.paymentOptions,
                  gap: isMobile ? 6 : styles.paymentOptions.gap,
                }}
              >
                {paymentOptions.map((option) => (
                  <div key={option.id} style={styles.paymentOption}>
                    <span style={styles.paymentIcon}>{option.icon}</span>
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
              <button
                style={{
                  ...styles.bookButton,
                  padding: styles.bookButton.padding,
                  width: styles.bookButton.width,
                }}
                onClick={handleBookRide}
              >
                {selectedRideId === 1 ? 'Book Any' : `Book ${rideOptions.find(r => r.id === selectedRideId)?.name}`}
              </button>
            </div>
          </>
        )}
      </LoadScript>
      {showSideMenu && <SideMenu onClose={() => setShowSideMenu(false)} />}
    </>
  );
};

const styles = {
  topBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 15px',
    zIndex: 20,
  },
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
  pickupInputContainer: {
    flex: 1,
    position: 'relative',
    borderRadius: 30,
  },
  backButton: {
    fontSize: 24,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
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
  menuLine: {
    height: 3,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  pickupContainer: {
    position: 'fixed',
    top: 60,
    left: 15,
    right: 15,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 10,
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    zIndex: 15,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  pickupInput: {
    width: '100%',
    padding: '10px 12px',
    fontSize: 16,
    borderRadius: 6,
    border: '1px solid #ccc',
  },
  pickupInputWithClear: {
    width: '100%',
    padding: '10px 30px 10px 12px', /* extra right padding for clear button */
    fontSize: 16,
    borderRadius: 30,
    border: '1px solid #ccc',
    fontFamily: 'Arial, sans-serif',
  },
  pickupContainer: {
    position: 'fixed',
    top: 60,
    left: 15,
    right: 15,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 10,
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    zIndex: 15,
  },
  inputWrapper: {
    position: 'relative',
  },
  clearButton: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    fontSize: 20,
    cursor: 'pointer',
    color: '#999',
    padding: 0,
    lineHeight: 1,
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
  rideOptionsHeader: {
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',
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
  rideRedeem: {
    marginTop: 4,
    fontSize: 12,
    color: '#f0a500',
    fontWeight: 'bold',
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
  myLocationButton: {
    position: 'absolute',
    top: 500,
    right: 15,
    backgroundColor: 'white',
    borderRadius: '50%',
    width: 48,
    height: 48,
    border: '1px solid #ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    zIndex: 200,
  },
};

const styleSheet = `
  @media (max-width: 600px) {
    .payment-options {
      gap: 6px !important;
    }
  }
`;

export default BookingPage;
