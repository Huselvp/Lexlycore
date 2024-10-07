import { useState, useRef, useCallback, useEffect } from "react";
import { GoogleMap, useLoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "300px",
  position: "relative",
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const searchBoxStyle = {
  position: "absolute",
  top: "10px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "80%",
  height: "4rem",
  padding: "10px",
  zIndex: "10",
  backgroundColor: "white",
  boxShadow: "0px 2px 6px rgba(0,0,0,0.3)",
  borderRadius: "3px",
};

const MapComponent = ({ getMapData, data, isFull }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyB8HxTy1ONHp4EbqDUcHgbjZcQQ9aGLvqM",
    libraries,
  });

  const [map, setMap] = useState(null);
  const [addressDetails, setAddressDetails] = useState({
    address: data.address || "",
    city: data.city || "",
    country: data.country || "",
    postal_code: data.postal_code || "",
    apartment: data.apartment || "",
    x: data.x || "",
    y: data.y || "",
  });

  const formatAddress = () => {
    return `${
      addressDetails.apartment ? addressDetails.apartment + ", " : ", "
    }${addressDetails.address ? addressDetails.address + ", " : ", "}${
      addressDetails.city ? addressDetails.city + ", " : ", "
    }${addressDetails.country ? addressDetails.country + ", " : ", "}${
      addressDetails.postal_code ? addressDetails.postal_code + ", " : ", "
    }${addressDetails.x !== "" ? addressDetails.x + ", " : ", "}${
      addressDetails.y !== "" ? addressDetails.y : ""
    }`;
  };

  useEffect(() => {
    if (getMapData) {
      const formattedAddress = formatAddress();
      if (formattedAddress !== "") {
        getMapData(formattedAddress);
        if (
          addressDetails.address !== "" &&
          addressDetails.city !== "" &&
          addressDetails.country !== "" &&
          addressDetails.postal_code !== "" &&
          addressDetails.apartment
        ) {
          isFull(true);
        } else {
          isFull(false);
        }
      }
    }
  }, [addressDetails, getMapData, formatAddress]);

  const autocompleteRef = useRef(null);

  const onMapLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      const addressComponents = place.address_components || [];
      let address = "";
      let city = "";
      let country = "";
      let postal_code = "";
      let apartment = "";

      addressComponents.forEach((component) => {
        const types = component.types;

        if (types.includes("street_number")) {
          address = component.long_name + " " + address;
        }
        if (types.includes("route")) {
          address += component.long_name;
        }
        if (types.includes("locality")) {
          city = component.long_name;
        }
        if (types.includes("country")) {
          country = component.long_name;
        }
        if (types.includes("postal_code")) {
          postal_code = component.long_name;
        }
        if (types.includes("subpremise")) {
          apartment = component.long_name;
        }
      });

      setAddressDetails((prevDetails) => ({
        ...prevDetails,
        address,
        city,
        country,
        postal_code,
        apartment,
        x: lat,
        y: lng,
      }));

      map.panTo(place.geometry.location);
      map.setZoom(14);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div style={{ marginBottom: "4rem" }}>
      <div style={mapContainerStyle}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={center}
          options={options}
          onLoad={onMapLoad}
        >
          <Autocomplete
            onLoad={(autocomplete) => {
              autocompleteRef.current = autocomplete;
            }}
            onPlaceChanged={handlePlaceChanged}
          >
            <input
              type="text"
              placeholder="Search for a place"
              style={searchBoxStyle}
            />
          </Autocomplete>
        </GoogleMap>
      </div>

      <div className="inputDiv">
        <div className="one">
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={addressDetails.address}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="apartment"
            placeholder="Apartment"
            value={addressDetails.apartment}
            onChange={handleInputChange}
          />
        </div>
        <div className="two">
          <input
            type="text"
            name="postal_code"
            placeholder="Post number"
            value={addressDetails.postal_code}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={addressDetails.city}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={addressDetails.country}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
