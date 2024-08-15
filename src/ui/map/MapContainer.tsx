import { useEffect, useState, useRef } from "react";

import styled from "styled-components";

import "./styles.css";

import {
  APIProvider,
  ControlPosition,
  MapControl,
  AdvancedMarker,
  Map,
  MapCameraChangedEvent,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

const MAP_API_KEY = "AIzaSyB8HxTy1ONHp4EbqDUcHgbjZcQQ9aGLvqM";

const AddressLocal = ({ addressDetails, getMapData }) => {
  const [apartment, setApartment] = useState("");
  const [formattedAddress, setFormattedAddress] = useState("");

  const handleApartmentChange = (e) => {
    setApartment(e.target.value);
  };

  useEffect(() => {
    const { address, postal_code, city, country } = addressDetails;
    let newFormattedAddress = "";

    if (address && apartment && postal_code && city && country) {
      newFormattedAddress = `${address}, ${apartment}, ${postal_code}, ${city}, ${country}`;
    }

    setFormattedAddress(newFormattedAddress);
    if (newFormattedAddress !== "") {
      getMapData(newFormattedAddress);
    }
  }, [addressDetails, apartment]);

  return (
    <div className="inputDiv">
      <div className="one">
        <input
          type="text"
          value={addressDetails.address}
          readOnly
          placeholder="Addres"
        />
        <input
          type="text"
          placeholder="Appartment"
          onChange={handleApartmentChange}
        />
      </div>
      <div className="two">
        <input
          type="text"
          value={addressDetails.postal_code}
          readOnly
          placeholder="Post number"
        />
        <input
          type="text"
          value={addressDetails.city}
          readOnly
          placeholder="City"
        />
        <input
          type="text"
          value={addressDetails.country}
          readOnly
          placeholder="Country"
        />
      </div>
    </div>
  );
};

interface MapHandlerProps {
  place: google.maps.places.PlaceResult | null;
  marker: google.maps.marker.AdvancedMarkerElement | null;
  setAddressDetails: (addressDetails: any) => void;
}

const MapHandler = ({ place, marker, setAddressDetails }: MapHandlerProps) => {
  const map = useMap();
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
    if (!map || !place || !marker) return;

    if (place.geometry?.viewport) {
      map.fitBounds(place.geometry?.viewport);
    }

    const location = place.geometry?.location;
    if (location) {
      const lat = location.lat();
      const lng = location.lng();
      map.setCenter({ lat, lng });
      marker.position = { lat, lng };
      fetchAddress(lat, lng);
    }
  }, [map, place, marker]);

  const fetchAddress = async (lat: number, lng: number) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAP_API_KEY}`
    );
    const data = await response.json();
    console.log(data);

    if (data.results && data.results.length > 0) {
      const addressComponents = data.results[0].address_components;

      const getAddressComponent = (type: string) => {
        const component = addressComponents.find((comp: any) =>
          comp.types.includes(type)
        );
        return component ? component.long_name : "";
      };

      const addressDetails = {
        address: addressComponents[1]?.long_name || "",
        city: addressComponents[2]?.long_name || "",
        province: addressComponents[4]?.long_name || "",
        country: addressComponents[5]?.long_name || "",
        postal_code: getAddressComponent("postal_code"),
      };

      setAddressDetails(addressDetails);
    } else {
      setAddressDetails({
        address: "",
        city: "",
        province: "",
        country: "",
        postal_code: "",
      });
    }
  };

  return null;
};

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

const PlaceAutocomplete = ({ onPlaceSelect }: PlaceAutocompleteProps) => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="autocomplete-container">
      <input ref={inputRef} />
    </div>
  );
};

interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

export const PlaceAutocompleteClassic = ({ onPlaceSelect }: Props) => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="autocomplete-container">
      <input ref={inputRef} />
    </div>
  );
};

const MapContainer = ({ getTheMapData }) => {
  const map = useMap();
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(null);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [addressDetails, setAddressDetails] = useState({
    address: "",
    city: "",
    province: "",
    country: "",
    postal_code: "",
  });

  const fetchAddress = async (lat: number, lng: number) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAP_API_KEY}`
    );
    const data = await response.json();
    console.log(data);

    if (data.results && data.results.length > 0) {
      const addressComponents = data.results[0].address_components;

      const getAddressComponent = (type: string) => {
        const component = addressComponents.find((comp: any) =>
          comp.types.includes(type)
        );
        return component ? component.long_name : "";
      };

      const addressDetails = {
        address: addressComponents[1]?.long_name || "",
        city: addressComponents[2]?.long_name || "",
        province: addressComponents[4]?.long_name || "",
        country: addressComponents[5]?.long_name || "",
        postal_code: getAddressComponent("postal_code"),
      };

      setAddressDetails(addressDetails);
    } else {
      setAddressDetails({
        address: "",
        city: "",
        province: "",
        country: "",
        postal_code: "",
      });
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLat(latitude);
          setLng(longitude);
          setCenter({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting the location", error);
          // Set a default location if needed
          setLat(37.7749); // Default to San Francisco
          setLng(-122.4194);
          setCenter({ lat: 37.7749, lng: -122.4194 });
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Set a default location if needed
      setLat(37.7749); // Default to San Francisco
      setLng(-122.4194);
      setCenter({ lat: 37.7749, lng: -122.4194 });
    }
  }, []);

  useEffect(() => {
    if (map) {
      const listener = map.addListener("center_changed", () => {
        const newCenter = map.getCenter().toJSON();
        setCenter(newCenter);
      });

      return () => {
        google.maps.event.removeListener(listener);
      };
    }
  }, [map]);

  const MapControlWrapper = styled.div`
    position: absolute;
    top: 0;
    width: 100%;
  `;
  return (
    <>
      <APIProvider
        apiKey={MAP_API_KEY}
        onLoad={() => console.log("Maps API has loaded.")}
      >
        <div className={"d"}>
          <Map
            defaultZoom={13}
            defaultCenter={{ lat, lng }}
            mapId="f513784acf4c03d0"
            onCameraChanged={(ev: MapCameraChangedEvent) =>
              console.log(
                "camera changed:",
                ev.detail.center,
                "zoom:",
                ev.detail.zoom
              )
            }
            gestureHandling={"greedy"}
            disableDefaultUI={true}
          >
            <AdvancedMarker ref={markerRef} position={null} />
          </Map>

          <div className="map-wrapper">
            <MapControl position={ControlPosition.TOP_CENTER}>
              <div className="autocomplete-control">
                <PlaceAutocompleteClassic onPlaceSelect={setSelectedPlace} />
              </div>
            </MapControl>
          </div>
          <MapHandler
            place={selectedPlace}
            marker={marker}
            setAddressDetails={setAddressDetails}
          />
          <AddressLocal
            addressDetails={addressDetails}
            getMapData={(value) => {
              getTheMapData(value);
            }}
          />
        </div>
      </APIProvider>
    </>
  );
};

export default MapContainer;
