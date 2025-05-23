import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
};

const center = {
  lat: 20.5937,
  lng: 78.9629,
};

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
  const [drop, setDrop] = useState(null);
  const [distance, setDistance] = useState(null);
  const [fare, setFare] = useState(null);
  const [selectedTime, setSelectedTime] = useState('now');
  const [directions, setDirections] = useState(null);

  const pickupRef = useRef(null);
  const dropRef = useRef(null);

  useEffect(() => {
    if (pickup && drop) {
      const dist = calculateDistance(
        pickup.lat,
        pickup.lng,
        drop.lat,
        drop.lng
      );
      setDistance(dist.toFixed(2));
      const estimatedFare = 50 + dist * 15;
      setFare(estimatedFare.toFixed(2));
    } else {
      setDistance(null);
      setFare(null);
      setDirections(null);
    }
  }, [pickup, drop]);

  const onLoadPickup = (autocomplete) => {
    pickupRef.current = autocomplete;
  };

  const onLoadDrop = (autocomplete) => {
    dropRef.current = autocomplete;
  };

  const onPlaceChangedPickup = () => {
    if (pickupRef.current !== null) {
      const place = pickupRef.current.getPlace();
      if (place.geometry) {
        setPickup({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address,
        });
      }
    }
  };

  const onPlaceChangedDrop = () => {
    if (dropRef.current !== null) {
      const place = dropRef.current.getPlace();
      if (place.geometry) {
        setDrop({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address,
        });
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

  const handleBookRide = () => {
    if (!pickup || !drop) {
      alert('Please select both pickup and drop locations.');
      return;
    }
    alert(
      `Ride booked!\nPickup: ${pickup.address}\nDrop: ${drop.address}\nTime: ${
        selectedTime === 'now' ? 'Now' : 'Later'
      }\nEstimated Fare: ₹${fare}`
    );
  };

  return (
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backButton}>
        Back
      </button>
      <h2 style={styles.title}>Book a Ride</h2>

      <LoadScript googleMapsApiKey="AIzaSyDrHVMgjjtj-roJ3M_2eUVLyeoKFLgv1kk" libraries={['places']}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Pickup Location</label>
          <Autocomplete onLoad={onLoadPickup} onPlaceChanged={onPlaceChangedPickup}>
            <input type="text" placeholder="Enter pickup location" style={styles.input} />
          </Autocomplete>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Drop Location</label>
          <Autocomplete onLoad={onLoadDrop} onPlaceChanged={onPlaceChangedDrop}>
            <input type="text" placeholder="Enter drop location" style={styles.input} />
          </Autocomplete>
        </div>

        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={5}>
          {pickup && <Marker position={{ lat: pickup.lat, lng: pickup.lng }} />}
          {drop && <Marker position={{ lat: drop.lat, lng: drop.lng }} />}
          {pickup && drop && (
            <DirectionsService
              options={{
                origin: { lat: pickup.lat, lng: pickup.lng },
                destination: { lat: drop.lat, lng: drop.lng },
                travelMode: 'DRIVING',
              }}
              callback={directionsCallback}
            />
          )}
          {directions && (
            <DirectionsRenderer
              options={{
                directions: directions,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>

      {distance && fare && (
        <div style={styles.fareInfo}>
          <p>Distance: {distance} km</p>
          <p>Estimated Fare: ₹{fare}</p>
        </div>
      )}

      <div style={styles.timeSelection}>
        <label>
          <input
            type="radio"
            value="now"
            checked={selectedTime === 'now'}
            onChange={() => setSelectedTime('now')}
          />
          Now
        </label>
        <label style={{ marginLeft: 20 }}>
          <input
            type="radio"
            value="later"
            checked={selectedTime === 'later'}
            onChange={() => setSelectedTime('later')}
          />
          Later
        </label>
      </div>

      <button onClick={handleBookRide} style={styles.bookButton}>
        Book Ride
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: 20,
    maxWidth: 500,
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  backButton: {
    marginBottom: 10,
    background: 'none',
    border: 'none',
    color: '#FFC107',
    cursor: 'pointer',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    display: 'block',
    marginBottom: 6,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    fontSize: 16,
    borderRadius: 4,
    border: '1px solid #ccc',
  },
  fareInfo: {
    marginBottom: 20,
    fontSize: 16,
  },
  timeSelection: {
    marginBottom: 20,
    fontSize: 16,
  },
  bookButton: {
    backgroundColor: '#FFC107',
    border: 'none',
    padding: '12px 20px',
    fontSize: 18,
    borderRadius: 4,
    cursor: 'pointer',
    width: '100%',
  },
};

export default BookingPage;
