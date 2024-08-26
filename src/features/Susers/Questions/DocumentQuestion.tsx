import {
  ReactNode,
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import Form from "../../../ui/AuthForm";
import { extractChoicesFromString } from "../../../utils/helpers";
import styled from "styled-components";
import { HiMiniChevronDown, HiMiniChevronUp } from "react-icons/hi2";
import axios from "axios";
import { API } from "../../../utils/constants";
import { getApiConfig } from "../../../utils/constants";
import "./styles/form.css";
import { IoMdRemove } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import { BsBuildings } from "react-icons/bs";

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

import debounce from "lodash/debounce";

import "../../../ui/map/styles.css";

// import MapContainer from "../../../ui/map/MapContainer";

const Checkbox = styled.input`
  /* accent-color: var(--color-stone-300); */
  /* border: none; */
  position: relative;
  width: 2rem;
  height: 2rem;
  appearance: none;
  border-radius: 50%;

  &:focus {
    border-radius: 50%;
  }
  box-shadow: var(--shadow);
  &::before,
  &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
  }
  &::before {
    background-color: var(--white);
    top: 0;
    left: 0;
    width: 2rem;
    height: 2rem;
  }
  &::after {
    opacity: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--color-stone-600);
    width: 1rem;
    height: 1rem;
  }
  &:checked::after {
    opacity: 1;
  }
  &:checked::before {
    background-color: var(--color-stone-150);
    border: 1px solid var(--color-stone-500);
  }
`;

const Choices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  & > div {
    display: grid;
    grid-template-columns: repeat(2, min-content);
    grid-template-columns: min-content max-content;
    align-items: center;
    gap: 1rem;
    label {
      font-size: 1.5rem;
      color: var(--color-grey-500);
      font-weight: 500;
      cursor: pointer;
      &::first-letter {
        text-transform: uppercase;
      }
    }
  }
`;

const Description = styled.div`
  /* font-size: 1.6rem; */

  text-align: center;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  color: var(--color-grey-500);
  font-size: 1.3rem;
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 3rem;
  gap: 1rem;
  button {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--color-grey-500);
    font-weight: 500;
    background-color: var(--color-stone-150);
    border: none;
    padding: 0.6rem 1.5rem;
    font-size: 1.3rem;
    border-radius: var(--rounded-3xl);
    box-shadow: var(--shadow);
  }
`;

const Details = styled(Description)`
  align-self: center;
  display: inline-block;
  background-color: var(--color-stone-150);
  padding: 2rem 3rem;
  border-radius: var(--rounded);
  box-shadow: var(--shadow-sm);
  color: var(--color-grey-500);
  font-size: 1.3rem;
  font-weight: 500;
`;

const InputContainer = styled.div`
  width: 50vw;
  align-self: center;
  /* 900px */
  @media screen and (max-width: 56.25em) {
    width: 60vw;
  }
  /* 600px */
  @media screen and (max-width: 37.5em) {
    width: 75vw;
  }
  /* 500px */
  @media screen and (max-width: 25em) {
    width: 85vw;
  }
`;

const Input = styled(Form.Input)`
  padding: 0.8rem 1.2rem;
`;

const Textarea = styled(Form.Textarea)`
  width: 100%;
  min-height: 12rem;
`;

const DocumentQuestion = ({
  question,
  children,
  value,
  setValue,
  isTherData,
  isTherDays,
  isTherTimes,
  getMapData,
}: {
  question: Question;
  children: ReactNode;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  if (typeof question === "undefined") return null;
  const choices = useMemo(
    () => extractChoicesFromString(question!.valueType),
    [question!.valueType]
  );

  const [formBlocks, setFormBlocks] = useState([]);
  const [formData, setFormData] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [formErrors, setFormErrors] = useState([]);
  const [isAllDataEntered, setIsAllDataEntered] = useState(false);

  // Fetch form blocks and filter data
  useEffect(() => {
    const getFormBlocks = async () => {
      if (question?.valueType === "form") {
        try {
          const result = await axios.get(
            `${API}/suser/question-details/${question.id}`,
            getApiConfig()
          );
          setFormBlocks(result?.data.form.blocks);
          console.log(
            result?.data.form.blocks,
            "this is the blogs hdyuhefyuefyufryurf"
          );
        } catch (err) {
          console.log(err);
        }
      }
    };

    const getFilterData = async () => {
      if (question?.valueType === "filter") {
        try {
          const result = await axios.get(
            `${API}/suser/question-details/${question.id}`,
            getApiConfig()
          );
          setFilterData(result?.data.filter);
        } catch (err) {
          console.log(err);
        }
      }
    };

    getFormBlocks();
    getFilterData();
  }, [question.id, question?.valueType]);

  useEffect(() => {
    if (value) {
      setFormData(value);
    }
  }, [value]);

  const countTotalInputs = (blocks) => {
    return blocks.reduce((total, block) => total + block?.labels.length, 0);
  };

  const totalInputs = countTotalInputs(formBlocks);

  useEffect(() => {
    const initialFormErrors = formBlocks?.flatMap((block) =>
      block.labels?.map(() => "")
    );
    setFormErrors(initialFormErrors);
  }, [formBlocks]);

  const handleChange = useCallback(
    (blockId, labelId, value, questionText) => {
      setFormData((prevFormData) => {
        const updatedFormData = prevFormData.filter(
          (item) => !(item?.blockId === blockId && item?.labelId === labelId)
        );

        if (value.trim() !== "") {
          updatedFormData.push({
            blockId,
            labelId,
            LabelValue: value,
            questionText,
          });
        }

        const allInputsFilled = updatedFormData?.length === totalInputs;
        setIsAllDataEntered(allInputsFilled);
        isTherData(allInputsFilled);
        setValue(updatedFormData, question.valueType);

        return updatedFormData;
      });
    },
    [totalInputs, isTherData, setValue]
  );

  //=========================

  const isTheFilterHavAvalue = useCallback(() => {
    return value !== "";
  }, [value]);

  const [Fvalue, setFValue] = useState(() => {
    if (isTheFilterHavAvalue()) {
      return value;
    } else if (
      filterData &&
      filterData?.filterStartInt &&
      filterData?.filterEndInt
    ) {
      return (+filterData?.filterStartInt + filterData?.filterEndInt) / 2;
    }
  });

  const handleSliderChange = (event) => {
    const newValue = Number(event.target.value);

    setFValue(newValue);
    setValue(newValue, question.valueType);
  };

  // ++++++++++++++++++++++++++++++++++++++++++

  const isTimesHaveValues = () => {
    return (
      Array.isArray(value) &&
      value.length >= 2 &&
      value[0]?.time &&
      value[1]?.time
    );
  };

  // Initialize state based on a condition
  const [times, setTimes] = useState(() => {
    if (isTimesHaveValues()) {
      return [
        { index: 0, time: value[0]?.time },
        { index: 1, time: value[1]?.time },
      ];
    } else {
      return [
        { index: 0, time: "" },
        { index: 1, time: "" },
      ];
    }
  });

  // Handle time changes
  const handleTimeChange = (index, event) => {
    const newTimes = times?.map((time) =>
      time.index === index ? { ...time, time: event.target.value } : time
    );
    setTimes(newTimes);
    setValue(newTimes, question.valueType); // Assuming setValue is defined elsewhere
  };

  // Use useEffect without conditional calls
  useEffect(() => {
    if (times[0]?.time !== "" && times[1]?.time !== "") {
      isTherTimes(true);
    } else {
      isTherTimes(false);
    }
  }, [times, isTherTimes]);

  const isSecondTimeDisabled = times[0]?.time === "";

  // ========================

  const isDaysHaveValues = () => {
    return (
      Array.isArray(value) &&
      value.length >= 2 &&
      value[0]?.day &&
      value[1]?.day
    );
  };

  const [days, setDays] = useState(() => {
    if (isDaysHaveValues()) {
      return [
        { index: 0, day: value[0]?.day },
        { index: 1, day: value[1]?.day },
      ];
    } else {
      return [
        { index: 0, day: "" },
        { index: 1, day: "" },
      ];
    }
  });

  const handleSelectChange = (index, event) => {
    const newDays = days.map((day) =>
      day.index === index ? { ...day, day: event.target.value } : day
    );
    setDays(newDays);
    setValue(newDays, question.valueType);

    if (days[0]?.day !== "" && days[1]?.day !== "") {
      isTherDays(true);
    }
  };

  useEffect(() => {
    if (days[0]?.day !== "" && days[1]?.day !== "") {
      isTherDays(true);
    } else {
      isTherDays(false);
    }
  }, [days, isTherDays]);

  const isSecondDayDisabled = days[0]?.day === "";

  // ========================

  const [countriesList, setCountriesList] = useState([]);

  // const getCountriesList = async () => {
  //   try {
  //     const result = await axios.get(
  //       "http://api.geonames.org/countryInfoJSON?username=anasiker&lang=da"
  //     );
  //     const sortedCountries = result.data.geonames.sort((a, b) => {
  //       if (a.countryName < b.countryName) return -1;
  //       if (a.countryName > b.countryName) return 1;
  //       return 0;
  //     });
  //     setCountriesList(sortedCountries);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   getCountriesList();
  // }, []);

  const getCountriesList = async () => {
    try {
      const result = await axios.get(
        "http://api.geonames.org/countryInfoJSON?username=anasiker&lang=da"
      );

      // Sort the countries alphabetically
      let sortedCountries = result.data.geonames.sort((a, b) => {
        if (a.countryName < b.countryName) return -1;
        if (a.countryName > b.countryName) return 1;
        return 0;
      });

      // Move 'Danmark' to the first position
      sortedCountries = sortedCountries.filter(
        (country) => country.countryName !== "Danmark"
      );
      sortedCountries.unshift({ countryName: "Danmark" });

      setCountriesList(sortedCountries);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCountriesList();
  }, []);

  // ====================== Map

  const MAP_API_KEY = "AIzaSyB8HxTy1ONHp4EbqDUcHgbjZcQQ9aGLvqM";

  interface AddressDetails {
    address: string;
    apartment: string;
    city: string;
    country: string;
    postal_code: string;
    x: number;
    y: number;
  }

  interface MapContainerProps {
    setValue: (value: string, valueType: string) => void;
  }

  const MapContainer: React.FC<MapContainerProps> = ({ setMapValue }) => {
    const [selectedPlace, setSelectedPlace] =
      useState<google.maps.places.PlaceResult | null>(null);
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(
      null
    );
    const [lat, setLat] = useState(37.7749);
    const [lng, setLng] = useState(-122.4194);

    const [addressDetails, setAddressDetails] = useState<AddressDetails>({
      address: "",
      city: "",
      country: "",
      postal_code: "",
      apartment: "",
      x: lat,
      y: lng,
    });

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
          }
        );
      }
    }, []);

    useEffect(() => {
      const formattedAddress = `${addressDetails.apartment}, ${addressDetails.address}, ${addressDetails.city}, ${addressDetails.country}, ${addressDetails.postal_code}, ${addressDetails.x}, ${addressDetails.y}`;
      setMapValue(formattedAddress, "map");
      localStorage.setItem("map", formattedAddress);
      setValue(formattedAddress);

      console.log(formattedAddress);
    }, [addressDetails, setMapValue]);

    return (
      <APIProvider
        apiKey={MAP_API_KEY}
        onLoad={() => console.log("Maps API has loaded.")}
      >
        <div className={"d"}>
          <Map
            defaultZoom={13}
            defaultCenter={{ lat, lng }}
            mapId="f513784acf4c03d0"
            gestureHandling={"greedy"}
            disableDefaultUI={true}
          >
            <AdvancedMarker ref={markerRef} position={center} />
            <MapControl position={ControlPosition.TOP_CENTER}>
              <div className="autocomplete-control">
                <PlaceAutocompleteClassic onPlaceSelect={setSelectedPlace} />
              </div>
            </MapControl>
          </Map>
          <MapHandler
            place={selectedPlace}
            marker={marker}
            setAddressDetails={setAddressDetails}
          />
          <AddressLocal
            addressDetails={addressDetails}
            setAddressDetails={setAddressDetails}
          />
        </div>
      </APIProvider>
    );
  };

  interface AddressLocalProps {
    addressDetails: AddressDetails;
    setAddressDetails: React.Dispatch<React.SetStateAction<AddressDetails>>;
  }

  const AddressLocal: React.FC<AddressLocalProps> = ({
    addressDetails,
    setAddressDetails,
  }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setAddressDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    };

    return (
      <div className="inputDiv">
        <div className="one">
          <input
            type="text"
            name="address"
            value={addressDetails.address}
            placeholder="Address"
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
            value={addressDetails.postal_code}
            placeholder="Post number"
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="city"
            value={addressDetails.city}
            placeholder="City"
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="country"
            value={addressDetails.country}
            placeholder="Country"
            onChange={handleInputChange}
          />
        </div>
      </div>
    );
  };

  interface MapHandlerProps {
    place: google.maps.places.PlaceResult | null;
    marker: google.maps.marker.AdvancedMarkerElement | null;
    setAddressDetails: (addressDetails: AddressDetails) => void;
  }

  const MapHandler: React.FC<MapHandlerProps> = ({
    place,
    marker,
    setAddressDetails,
  }) => {
    const map = useMap();

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

    const fetchAddress = useCallback(
      async (lat: number, lng: number) => {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAP_API_KEY}`
          );
          const data = await response.json();

          if (data.results && data.results.length > 0) {
            const addressComponents = data.results[0].address_components;

            const getAddressComponent = (type: string) => {
              const component = addressComponents.find((comp: any) =>
                comp.types.includes(type)
              );
              return component ? component.long_name : "";
            };

            const addressDetails: AddressDetails = {
              address: getAddressComponent("route") || "",
              city: getAddressComponent("locality") || "",
              country: getAddressComponent("country") || "",
              postal_code: getAddressComponent("postal_code") || "",
              apartment: "",
              x: lat,
              y: lng,
            };

            setAddressDetails(addressDetails);
          }
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      },
      [setAddressDetails]
    );

    return null;
  };

  interface PlaceAutocompleteProps {
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  }

  const PlaceAutocompleteClassic: React.FC<PlaceAutocompleteProps> = ({
    onPlaceSelect,
  }) => {
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
        <input ref={inputRef} placeholder="Search for a place" />
      </div>
    );
  };

  const handelSetMapValue = (value: string, valueType: string) => {
    // setValue(value, valueType);
    console.log(value);
    getMapData(value);
  };

  // ----------- CVR DATA -------------

  const [cvrData, setCVRData] = useState({});
  const [virksomhedsnavn, setVirksomhedsnavn] = useState("");
  const [adresse, setAdresse] = useState("");
  const [cvrNumber, setCvrNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Danmark"); // Default to "Danmark"

  const getSVRDataHandler = async (cvr) => {
    try {
      const result = await axios.get(
        `${API}/suser/company-details/${cvr}`,
        getApiConfig()
      );

      if (result.data) {
        setCVRData(result.data);
        setVirksomhedsnavn(result.data.name || "");
        setAdresse(result.data.address || "");
        setCvrNumber(result.data.cvrNumber || "");
        setPostalCode(result.data.postalCode || "");
        setCity(result.data.city || "");
        setCountry("Danmark"); // Reset to "Danmark" by default
      } else {
        clearFormFields(); // Clear fields if data is empty or incorrect
      }
    } catch (err) {
      console.log(err);
      clearFormFields(); // Clear fields in case of error
    }
  };

  const clearFormFields = () => {
    setVirksomhedsnavn("");
    setAdresse("");
    // Don't clear the CVR number; allow the user to modify it
    setPostalCode("");
    setCity("");
    setCountry("Danmark"); // Reset to "Danmark"
  };

  return (
    <>
      <div>
        <h2>{question.questionText}</h2>
        <Description>{question.description}</Description>
      </div>
      <DetailsContainer>
        <button onClick={() => setShowDetails((show) => !show)}>
          <span>{showDetails ? "Hide " : "Show"} details</span>
          {showDetails ? <HiMiniChevronUp /> : <HiMiniChevronDown />}
        </button>
        {showDetails && <Details>{question.descriptionDetails}</Details>}
      </DetailsContainer>
      <InputContainer>
        {question.valueType === "number" && (
          <Input
            placeholder={question.questionText}
            value={value}
            onChange={(e) => setValue(e.target.value, question.valueType)}
            type="number"
          />
        )}

        {question.valueType === "input" && (
          <Input
            placeholder={question.questionText}
            value={value}
            onChange={(e) => setValue(e.target.value, question.valueType)}
            type="text"
          />
        )}

        {question.valueType === "textarea" && (
          <Textarea
            placeholder={question.questionText}
            value={value}
            onChange={(e) => setValue(e.target.value, question.valueType)}
          />
        )}

        {question.valueType.startsWith("checkbox") && (
          <Choices>
            {choices.map((choice) => (
              <div key={choice.id}>
                <Checkbox
                  name="choice"
                  id={choice.choice}
                  value={choice.newRelatedText}
                  type="radio"
                  onChange={() => setValue(choice.newRelatedText, "checkbox")}
                  checked={value === choice.newRelatedText}
                />
                <label htmlFor={choice.choice}>{choice.choice}</label>
              </div>
            ))}
          </Choices>
        )}

        {/* this is the form  */}

        {question.valueType.startsWith("form") && (
          <div className="form_type">
            {formBlocks?.map((block) => {
              if (block.type === "COMPANY") {
                return (
                  <div
                    className="company"
                    style={{
                      backgroundColor: "rgb(255, 255, 255)",
                      padding: "2rem",
                      borderRadius: "10px",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "2rem",
                      }}
                    >
                      <div
                        style={{
                          width: "5rem",
                          height: "5rem",
                          backgroundColor: "#9a9278",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50px",
                        }}
                      >
                        <span>
                          <BsBuildings color="white" />
                        </span>
                      </div>
                      <p style={{ fontSize: "15px", fontWeight: "bold" }}>
                        Virksomhed
                      </p>
                    </div>

                    <div>
                      <form>
                        <div
                          style={{
                            display: "flex",
                            width: "100%",
                            gap: "2rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "start",
                              width: "100%",
                            }}
                          >
                            <label
                              htmlFor="Virksomhedsnavn"
                              style={{
                                marginBottom: "1rem",
                                fontWeight: "700",
                              }}
                            >
                              Virksomhedsnavn
                            </label>
                            <input
                              id="Virksomhedsnavn"
                              type="text"
                              style={{ width: "100%" }}
                              value={virksomhedsnavn}
                              onChange={(e) =>
                                setVirksomhedsnavn(e.target.value)
                              }
                            ></input>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "start",
                              width: "100%",
                            }}
                          >
                            <label
                              htmlFor="adresse"
                              style={{
                                marginBottom: "1rem",
                                fontWeight: "700",
                              }}
                            >
                              Adresse
                            </label>
                            <input
                              id="adresse"
                              type="text"
                              style={{ width: "100%" }}
                              value={adresse}
                              onChange={(e) => setAdresse(e.target.value)}
                            ></input>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            width: "100%",
                            gap: "2rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "start",
                              width: "100%",
                            }}
                          >
                            <label
                              htmlFor="cvr"
                              style={{
                                marginBottom: "1rem",
                                fontWeight: "700",
                              }}
                            >
                              CVR nr
                            </label>
                            <input
                              id="cvr"
                              type="text"
                              style={{ width: "100%" }}
                              value={cvrNumber}
                              onChange={(e) => {
                                setCvrNumber(e.target.value);
                                getSVRDataHandler(e.target.value);
                              }}
                            ></input>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "start",
                              width: "40%",
                            }}
                          >
                            <label
                              htmlFor="postnr"
                              style={{
                                marginBottom: "1rem",
                                fontWeight: "700",
                              }}
                            >
                              Postnr
                            </label>
                            <input
                              id="postnr"
                              type="number"
                              style={{ width: "100%" }}
                              value={postalCode}
                              onChange={(e) => setPostalCode(e.target.value)}
                            ></input>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "start",
                              width: "55%",
                            }}
                          >
                            <label
                              htmlFor="by"
                              style={{
                                marginBottom: "1rem",
                                fontWeight: "700",
                              }}
                            >
                              By
                            </label>
                            <input
                              id="by"
                              type="text"
                              style={{ width: "100%" }}
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                            ></input>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            width: "100%",
                            gap: "2rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "start",
                              width: "100%",
                            }}
                          >
                            <label
                              htmlFor="name"
                              style={{
                                marginBottom: "1rem",
                                fontWeight: "700",
                              }}
                            >
                              Herefter otalt som
                            </label>

                            <input
                              id="nmae"
                              type="text"
                              style={{ width: "100%" }}
                            ></input>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "start",
                              width: "100%",
                            }}
                          >
                            <label
                              htmlFor="adresse"
                              style={{
                                marginBottom: "1rem",
                                fontWeight: "700",
                              }}
                            >
                              Land
                            </label>
                            <select
                              name="land"
                              id="land"
                              style={{
                                width: "100%",
                                padding: "0.8rem 1.2rem",
                                border: "1px solid #d1d5db",
                                borderRadius: " 4px",
                                backgroundColor: " #fff",
                                boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                                paddingRight: "30px",
                              }}
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                            >
                              {countriesList.map((country) => {
                                return (
                                  <option value={country.countryName}>
                                    {country.countryName}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                );
              } else if (block.type === "PERSON") {
                return (
                  <div
                    className="person"
                    style={{
                      backgroundColor: "rgb(255, 255, 255)",
                      padding: "2rem",
                      borderRadius: "10px",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "2rem",
                      }}
                    >
                      <div
                        style={{
                          width: "5rem",
                          height: "5rem",
                          backgroundColor: "#9a9278",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50px",
                        }}
                      >
                        <span>
                          <FiUser color="white" />
                        </span>
                      </div>
                      <p style={{ fontSize: "15px", fontWeight: "bold" }}>
                        Person
                      </p>
                    </div>

                    <div>
                      <form>
                        <div
                          style={{
                            display: "flex",
                            width: "100%",
                            gap: "2rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "start",
                              width: "100%",
                            }}
                          >
                            <label
                              htmlFor="name"
                              style={{
                                marginBottom: "1rem",
                                fontWeight: "700",
                              }}
                            >
                              Navn
                            </label>
                            <input
                              id="nmae"
                              type="text"
                              style={{ width: "100%" }}
                            ></input>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "start",
                              width: "100%",
                            }}
                          >
                            <label
                              htmlFor="adresse"
                              style={{
                                marginBottom: "1rem",
                                fontWeight: "700",
                              }}
                            >
                              Adresse
                            </label>
                            <input
                              id="adresse"
                              type="text"
                              style={{ width: "100%" }}
                            ></input>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            width: "100%",
                            gap: "2rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "start",
                              width: "100%",
                            }}
                          >
                            <label
                              htmlFor="cpr"
                              style={{
                                marginBottom: "1rem",
                                fontWeight: "700",
                              }}
                            >
                              CPR nr
                            </label>
                            <input
                              id="cpr"
                              type="text"
                              style={{ width: "100%" }}
                            ></input>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "start",
                              width: "40%",
                            }}
                          >
                            <label
                              htmlFor="postnr"
                              style={{
                                marginBottom: "1rem",
                                fontWeight: "700",
                              }}
                            >
                              Postnr
                            </label>
                            <input
                              id="postnr"
                              type="number"
                              style={{ width: "100%" }}
                            ></input>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "start",
                              width: "55%",
                            }}
                          >
                            <label
                              htmlFor="by"
                              style={{
                                marginBottom: "1rem",
                                fontWeight: "700",
                              }}
                            >
                              By
                            </label>
                            <input
                              id="by"
                              type="text"
                              style={{ width: "100%" }}
                            ></input>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            width: "100%",
                            gap: "2rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "start",
                              width: "100%",
                            }}
                          >
                            <label
                              htmlFor="name"
                              style={{
                                marginBottom: "1rem",
                                fontWeight: "700",
                              }}
                            >
                              Herefter otalt som
                            </label>

                            <input
                              id="nmae"
                              type="text"
                              style={{ width: "100%" }}
                            ></input>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "start",
                              width: "100%",
                            }}
                          >
                            <label
                              htmlFor="adresse"
                              style={{
                                marginBottom: "1rem",
                                fontWeight: "700",
                              }}
                            >
                              Land
                            </label>
                            <select
                              name="land"
                              id="land"
                              style={{
                                width: "100%",
                                padding: "0.8rem 1.2rem",
                                border: "1px solid #d1d5db",
                                borderRadius: " 4px",
                                backgroundColor: " #fff",
                                boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                                paddingRight: "30px",
                              }}
                            >
                              {countriesList.map((country) => {
                                return (
                                  <option value={country.countryName}>
                                    {country.countryName}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                );
              }

              if (!block?.labels || block?.labels.length === 0) {
                return null;
              }

              return (
                <div className="form-block-user" key={block?.id}>
                  {/* <IoIosClose className="form_type_controllers" size={20} /> */}
                  {block.labels?.map((label) => {
                    const existingData = formData?.find(
                      (data) =>
                        data?.blockId === block?.id &&
                        data?.labelId === label?.id
                    );
                    const fieldValue = existingData
                      ? existingData.LabelValue
                      : "";
                    const questionText = label.name;

                    const handleInputChange = (e) => {
                      const { value } = e.target;
                      handleChange(block?.id, label?.id, value, questionText);
                    };

                    return (
                      <div key={label.id} className="block-input">
                        <label>{label.name}</label>
                        {label.type === "SELECT" ? (
                          <select
                            name={label.name}
                            value={fieldValue}
                            onChange={handleInputChange}
                          >
                            <option value="">Select an option</option>
                            {Object.keys(label.options)?.map((key) => (
                              <option key={key} value={label.options[key]}>
                                {label.options[key]}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={label.type}
                            name={label.name}
                            value={fieldValue}
                            placeholder={label.name}
                            onChange={handleInputChange}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {question.valueType.startsWith("filter") && (
          <div>
            <h3>
              {value !== ""
                ? value
                : (+filterData?.filterStartInt + filterData?.filterEndInt) / 2}
            </h3>
            <input
              type="range"
              min={filterData?.filterStartInt}
              max={filterData?.filterEndInt}
              value={Fvalue}
              onChange={handleSliderChange}
              style={{
                outline: "none",
                width: "100%",
                padding: "0",
                accentColor: "#ada587",
              }}
            />
          </div>
        )}

        {question.valueType.startsWith("day") && (
          <div className="daysofwork_container">
            <div className="select_input">
              <select
                id="daysOfWeek1"
                value={days[0]?.day}
                onChange={(e) => handleSelectChange(0, e)}
              >
                <option value="">Select a day</option>
                <option value="Mandag">Mandag</option>
                <option value="Tirsdag">Tirsdag</option>
                <option value="Onsdag">Onsdag</option>
                <option value="Torsdag">Torsdag</option>
                <option value="Fredag">Fredag</option>
                <option value="Lørdag">Lørdag</option>
                <option value="Søndag">Søndag</option>
              </select>
            </div>
            <div className="separator">
              <IoMdRemove />
            </div>
            <div className="select_input">
              <select
                id="daysOfWeek2"
                value={days[1]?.day}
                onChange={(e) => handleSelectChange(1, e)}
                disabled={isSecondDayDisabled}
              >
                <option value="">Select a day</option>
                <option value="Mandag">Mandag</option>
                <option value="Tirsdag">Tirsdag</option>
                <option value="Onsdag">Onsdag</option>
                <option value="Torsdag">Torsdag</option>
                <option value="Fredag">Fredag</option>
                <option value="Lørdag">Lørdag</option>
                <option value="Søndag">Søndag</option>
              </select>
            </div>
          </div>
        )}

        {question.valueType.startsWith("time") && (
          <div className="daysofwork_container">
            <div className="select_input">
              <input
                type="time"
                value={times[0]?.time}
                onChange={(event) => handleTimeChange(0, event)}
              />
            </div>
            <div className="separator">
              <IoMdRemove />
            </div>
            <div className="select_input">
              <input
                type="time"
                value={times[1]?.time}
                onChange={(event) => handleTimeChange(1, event)}
                disabled={isSecondTimeDisabled}
              />
            </div>
          </div>
        )}

        {question.valueType.startsWith("date") && (
          <div className="daysofwork_container">
            <div className="select_input">
              <input
                type="date"
                onChange={(e) => {
                  setValue(e.target.value, question.valueType);
                }}
                value={value}
              />
            </div>
          </div>
        )}

        {question.valueType.startsWith("map") && (
          <MapContainer setMapValue={handelSetMapValue} />
        )}

        {/* <button
          onClick={() => {
            console.log(cvrData);
          }}
        >
          get cvr data
        </button> */}

        {children}
      </InputContainer>
    </>
  );
};

export default DocumentQuestion;
