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
import { v4 as uuidv4 } from "uuid";

import "../../../ui/map/styles.css";

// import MapContainer from "../../../ui/map/MapContainer";

import MMapComponent from "./MMapComponent";

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

  const defaultLabels = {
    COMPANY: [
      { labelName: "Virksomhedsnavn", type: "TEXT" },
      { labelName: "Adresse", type: "TEXT" },
      { labelName: "CVR nr", type: "NUMBER" },
      { labelName: "Postnr", type: "NUMBER" },
      { labelName: "By", type: "TEXT" },
      { labelName: "Herefter otalt som", type: "TEXT" },
      { labelName: "Land", type: "SELECT" },
    ],
    PERSON: [
      { labelName: "Navn", type: "TEXT" },
      { labelName: "Adresse", type: "TEXT" },
      { labelName: "CPR nr", type: "NUMBER" },
      { labelName: "Postnr", type: "NUMBER" },
      { labelName: "By", type: "TEXT" },
      { labelName: "Herefter otalt som", type: "TEXT" },
      { labelName: "Land", type: "SELECT" },
    ],
  };

  const collectLabelIds = (formBlocks) => {
    return formBlocks.flatMap((block) => block.labels.map((label) => label.id));
  };

  const generateFormDataWithUniqueLabels = (formBlocks) => {
    let generatedId = 0;
    let idsArray = collectLabelIds(formBlocks);

    return formBlocks.map((block) => {
      if (block.type === "COMPANY" || block.type === "PERSON") {
        const labels = defaultLabels[block.type].map((label) => {
          // Ensure we generate a unique ID
          while (idsArray.includes(generatedId)) {
            generatedId++;
          }

          const newId = generatedId; // Use the current generatedId
          generatedId++; // Increment for the next ID

          idsArray.push(newId); // Update the idsArray with the new ID

          return {
            name: label.labelName,
            type: label.type,
            id: newId,
          };
        });

        return {
          ...block,
          labels,
        };
      }
      return block;
    });
  };

  const newBlocksForm = generateFormDataWithUniqueLabels(formBlocks);

  const totalInputs = countTotalInputs(newBlocksForm);

  useEffect(() => {
    const initialFormErrors = formBlocks?.flatMap((block) =>
      block.labels?.map(() => "")
    );
    setFormErrors(initialFormErrors);
  }, [formBlocks]);

  const [virksomhedsnavn, setVirksomhedsnavn] = useState("");
  const [adresse, setAdresse] = useState("");
  const [cvrNumber, setCvrNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [herefterOtaltSom, setHerefterOtaltSom] = useState("");

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
    [totalInputs, isTherData, setValue, question.valueType]
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

  let testtt;

  const [mapAdress, setMapAdress] = useState("");
  const [mapApartment, setMapApartment] = useState("");
  const [mapPostalCode, setMapPostalCode] = useState("");
  const [mapCity, setMapCity] = useState("");
  const [mapCountry, setMapCountry] = useState("");

  const [mapData, setMapData] = useState({});

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
      //setMapValue(formattedAddress, "map");
      localStorage.setItem("map", formattedAddress);
      //setMapData(addressDetails);
      //setValue(formattedAddress);
      testtt = addressDetails;
      console.log(addressDetails);
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
          {/* <AddressLocal
            addressDetails={addressDetails}
            setAddressDetails={setAddressDetails}
          /> */}
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

  const [CVR, setCVR] = useState("");
  const [CVRBlockId, setCVRBlockId] = useState("");
  const [isCVRRight, setIsCVRRight] = useState(false);

  const getSVRDataHandler = async (cvr) => {
    try {
      const result = await axios.get(
        `${API}/suser/company-details/${cvr}`,
        getApiConfig()
      );

      if (result.data) {
        setVirksomhedsnavn(result.data.name || "");
        setAdresse(result.data.address || "");
        setCvrNumber(result.data.cvrNumber || "");
        setPostalCode(result.data.postalCode || "");
        setCity(result.data.city || "");
        setCountry("Danmark");
        setHerefterOtaltSom(result.data.hereafterReferredTo || "");
        console.log(result.data);
        setIsCVRRight(true);
      } else {
        clearFormFields();
        setIsCVRRight(true);
      }
    } catch (err) {
      console.log(err);
      clearFormFields();
      setIsCVRRight(true);
    }
  };

  const clearFormFields = () => {
    setVirksomhedsnavn("");
    setAdresse("");
    setPostalCode("");
    setCity("");
    // setCountry("Danmark");
    // setHerefterOtaltSom("");
  };

  // =============

  // const handleCVRChanges = (cvr, blockId) => {
  //   console.log("I am here and working good");
  //   console.log(blockId);

  //   // Ensure the targeted block exists
  //   let targetedBlock = newBlocksForm.find((block) => block.id === blockId);
  //   if (!targetedBlock) return;

  //   console.log(targetedBlock);

  //   // Map field names to their corresponding variables
  //   const fieldMappings = {
  //     Virksomhedsnavn: virksomhedsnavn,
  //     Adresse: adresse,
  //     "CVR nr": cvr,
  //     Postnr: postalCode,
  //     By: city,
  //     Land: country,
  //     HerefterOtaltSom: herefterOtaltSom,
  //   };

  //   setFormData((prevFormData) => {
  //     const updatedFormData = [...prevFormData];

  //     // Iterate over fieldMappings to update or add data
  //     Object.entries(fieldMappings).forEach(([labelName, value]) => {
  //       const existingEntryIndex = updatedFormData.findIndex(
  //         (entry) => entry.blockId === blockId && entry.labelId === labelName
  //       );

  //       if (existingEntryIndex !== -1) {
  //         // Update the existing entry
  //         updatedFormData[existingEntryIndex].LabelValue = value;
  //       } else {
  //         // Add a new entry
  //         updatedFormData.push({
  //           blockId,
  //           labelId: labelName,
  //           LabelValue: value,
  //           questionText: labelName,
  //         });
  //       }
  //     });

  //     // Directly update the form data and state
  //     setValue(updatedFormData, question.valueType);

  //     return updatedFormData;
  //   });
  // };

  // const handleCVRChanges = (cvr, blockId) => {
  //   console.log("I am here and working good");
  //   console.log(blockId);

  //   // Ensure the targeted block exists
  //   let targetedBlock = newBlocksForm.find((block) => block.id === blockId);
  //   if (!targetedBlock) return;

  //   console.log(targetedBlock);

  //   // Map field names to their corresponding variables
  //   const fieldMappings = {
  //     Virksomhedsnavn: virksomhedsnavn,
  //     Adresse: adresse,
  //     "CVR nr": cvr,
  //     Postnr: postalCode,
  //     By: city,
  //     Land: country,
  //     HerefterOtaltSom: herefterOtaltSom,
  //   };

  //   setFormData((prevFormData) => {
  //     let updatedFormData = [...prevFormData];

  //     // Iterate over fieldMappings to update, add, or remove data
  //     Object.entries(fieldMappings).forEach(([labelName, value]) => {
  //       const existingEntryIndex = updatedFormData.findIndex(
  //         (entry) => entry.blockId === blockId && entry.labelId === labelName
  //       );

  //       const targetedlabelId = targetedBlock.labels.find(
  //         (label) => label.name == labelName
  //       );

  //       console.log(targetedlabelId?.id, "here is the ");

  //       if (value !== "") {
  //         if (existingEntryIndex !== -1) {
  //           // Update the existing entry
  //           updatedFormData[existingEntryIndex].LabelValue = value;
  //         } else {
  //           // Add a new entry
  //           updatedFormData.push({
  //             blockId,
  //             labelId: targetedlabelId?.id,
  //             LabelValue: value,
  //             questionText: labelName,
  //           });
  //         }
  //       } else {
  //         if (existingEntryIndex !== -1) {
  //           // Remove the entry if the value is an empty string
  //           updatedFormData.splice(existingEntryIndex, 1);
  //         }
  //       }
  //     });

  //     // Directly update the form data and state
  //     setValue(updatedFormData, question.valueType);

  //     return updatedFormData;
  //   });
  // };

  const handleCVRChanges = (cvr, blockId) => {
    console.log("I am here and working good");
    console.log(blockId);

    // Ensure the targeted block exists
    let targetedBlock = newBlocksForm.find((block) => block.id === blockId);
    if (!targetedBlock) return;

    console.log(targetedBlock);

    // Map field names to their corresponding variables
    const fieldMappings = {
      Virksomhedsnavn: virksomhedsnavn,
      Adresse: adresse,
      "CVR nr": cvr,
      Postnr: postalCode,
      By: city,
      Land: country,
      HerefterOtaltSom: herefterOtaltSom,
    };

    setFormData((prevFormData) => {
      let updatedFormData = [...prevFormData];

      // Iterate over fieldMappings to update, add, or remove data
      Object.entries(fieldMappings).forEach(([labelName, value]) => {
        // Find the labelId from the targetedBlock's labels
        const targetedLabel = targetedBlock.labels.find(
          (label) => label.name === labelName
        );
        const labelId = targetedLabel ? targetedLabel.id : null; // Safely retrieve labelId

        if (labelId) {
          // Proceed only if labelId is found
          const existingEntryIndex = updatedFormData.findIndex(
            (entry) => entry.blockId === blockId && entry.labelId === labelId
          );

          if (value !== "") {
            if (existingEntryIndex !== -1) {
              // Update the existing entry
              updatedFormData[existingEntryIndex].LabelValue = value;
            } else {
              // Add a new entry
              updatedFormData.push({
                blockId,
                labelId,
                LabelValue: value,
                questionText: labelName,
              });
            }
          } else {
            if (existingEntryIndex !== -1) {
              // Remove the entry if the value is an empty string
              updatedFormData.splice(existingEntryIndex, 1);
            }
          }
        }
      });

      // Directly update the form data and state
      setValue(updatedFormData, question.valueType);

      return updatedFormData;
    });
  };

  // UseEffect with the updated dependency array
  useEffect(() => {
    handleCVRChanges(CVR, CVRBlockId);
  }, [CVR, virksomhedsnavn, adresse, cvrNumber, postalCode, city]);

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

        {/* {question.valueType.startsWith("form") && (
          <div className="form_type">
            {generateFormDataWithUniqueLabels(formBlocks)?.map((block) => {
              return (
                <div className="form-block-user" key={block?.id}>
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
        )} */}

        {question.valueType.startsWith("form") && (
          <div className="form_type">
            {generateFormDataWithUniqueLabels(formBlocks)?.map((block) => {
              if (block.type === "PERSON") {
                return (
                  <div
                    className="company"
                    style={{
                      backgroundColor: "rgb(255, 255, 255)",
                      padding: "2rem",
                      borderRadius: "10px",
                      width: "100%",
                    }}
                    key={block?.id}
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
                        Virksomhed
                      </p>
                    </div>

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
                            Navn
                          </label>
                          <input
                            id="Virksomhedsnavn"
                            type="text"
                            style={{ width: "100%" }}
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[0]?.id
                              )?.LabelValue || ""
                            }
                            onChange={(e) =>
                              handleChange(
                                block?.id,
                                block.labels[0]?.id,
                                e.target.value,
                                block.labels[0]?.name
                              )
                            }
                          />
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
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[1]?.id
                              )?.LabelValue || ""
                            }
                            onChange={(e) =>
                              handleChange(
                                block?.id,
                                block.labels[1]?.id,
                                e.target.value,
                                block.labels[1]?.name
                              )
                            }
                          />
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
                            CPR nr
                          </label>
                          <input
                            id="cvr"
                            type="text"
                            style={{ width: "100%" }}
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[2]?.id
                              )?.LabelValue || ""
                            }
                            onChange={(e) => {
                              handleChange(
                                block?.id,
                                block.labels[2]?.id,
                                e.target.value,
                                block.labels[2]?.name
                              );
                              // getSVRDataHandler(e.target.value);
                            }}
                          />
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
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[3]?.id
                              )?.LabelValue || ""
                            }
                            onChange={(e) =>
                              handleChange(
                                block?.id,
                                block.labels[3]?.id,
                                e.target.value,
                                block.labels[3]?.name
                              )
                            }
                          />
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
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[4]?.id
                              )?.LabelValue || ""
                            }
                            onChange={(e) =>
                              handleChange(
                                block?.id,
                                block.labels[4]?.id,
                                e.target.value,
                                block.labels[4]?.name
                              )
                            }
                          />
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
                            id="name"
                            type="text"
                            style={{ width: "100%" }}
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[5]?.id
                              )?.LabelValue || ""
                            }
                            onChange={(e) =>
                              handleChange(
                                block?.id,
                                block.labels[5]?.id,
                                e.target.value,
                                block.labels[5]?.name
                              )
                            }
                          />
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
                          {/* <select
                            name="land"
                            id="land"
                            style={{
                              width: "100%",
                              padding: "0.8rem 1.2rem",
                              border: "1px solid #d1d5db",
                              borderRadius: "4px",
                              backgroundColor: "#fff",
                              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                              paddingRight: "30px",
                            }}
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[6]?.id
                              )?.LabelValue || "Danemark"
                            }
                            onChange={(e) =>
                              handleChange(
                                block?.id,
                                block.labels[6]?.id,
                                e.target.value,
                                block.labels[6]?.name
                              )
                            }
                          >
                            <option>Land</option>
                            {countriesList.map((country) => (
                              <option
                                key={country.countryName}
                                value={country.countryName}
                              >
                                {country.countryName}
                              </option>
                            ))}
                          </select> */}

                          <select
                            name="land"
                            id="land"
                            style={{
                              width: "100%",
                              padding: "0.8rem 1.2rem",
                              border: "1px solid #d1d5db",
                              borderRadius: "4px",
                              backgroundColor: "#fff",
                              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                              paddingRight: "30px",
                            }}
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[6]?.id
                              )?.LabelValue || "" // Default value is set to an empty string
                            }
                            onChange={(e) =>
                              handleChange(
                                block?.id,
                                block.labels[6]?.id,
                                e.target.value,
                                block.labels[6]?.name
                              )
                            }
                          >
                            <option value="">Land</option>{" "}
                            {/* Placeholder option */}
                            {countriesList.map((country) => (
                              <option
                                key={country.countryName}
                                value={country.countryName}
                              >
                                {country.countryName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </form>
                  </div>
                );
              }

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
                    key={block?.id}
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
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[0]?.id
                              )?.LabelValue || virksomhedsnavn
                            }
                            onChange={(e) => {
                              handleChange(
                                block?.id,
                                block.labels[0]?.id,
                                e.target.value,
                                block.labels[0]?.name
                              );

                              setVirksomhedsnavn(e.target.value);
                            }}
                          />
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
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[1]?.id
                              )?.LabelValue || adresse
                            }
                            onChange={(e) => {
                              handleChange(
                                block?.id,
                                block.labels[1]?.id,
                                e.target.value,
                                block.labels[1]?.name
                              );

                              setAdresse(e.target.value);
                            }}
                          />
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
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[2]?.id
                              )?.LabelValue || cvrNumber
                            }
                            onChange={(e) => {
                              // handleChange(
                              //   block?.id,
                              //   block.labels[2]?.id,
                              //   e.target.value,
                              //   block.labels[2]?.name
                              // );
                              setCvrNumber(e.target.value);
                              getSVRDataHandler(e.target.value);
                              setCVR(e.target.value);
                              setCVRBlockId(block?.id);
                            }}
                          />
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
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[3]?.id
                              )?.LabelValue || postalCode
                            }
                            onChange={(e) => {
                              setPostalCode(e.target.value);
                              handleChange(
                                block?.id,
                                block.labels[3]?.id,
                                e.target.value,
                                block.labels[3]?.name
                              );
                            }}
                          />
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
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[4]?.id
                              )?.LabelValue || city
                            }
                            onChange={(e) => {
                              handleChange(
                                block?.id,
                                block.labels[4]?.id,
                                e.target.value,
                                block.labels[4]?.name
                              );

                              setCity(e.target.value);
                            }}
                          />
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
                            id="name"
                            type="text"
                            style={{ width: "100%" }}
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[5]?.id
                              )?.LabelValue || ""
                            }
                            onChange={(e) =>
                              handleChange(
                                block?.id,
                                block.labels[5]?.id,
                                e.target.value,
                                block.labels[5]?.name
                              )
                            }
                          />
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
                              borderRadius: "4px",
                              backgroundColor: "#fff",
                              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                              paddingRight: "30px",
                            }}
                            value={
                              formData?.find(
                                (data) =>
                                  data?.blockId === block?.id &&
                                  data?.labelId === block.labels[6]?.id
                              )?.LabelValue || ""
                            }
                            onChange={(e) =>
                              handleChange(
                                block?.id,
                                block.labels[6]?.id,
                                e.target.value,
                                block.labels[6]?.name
                              )
                            }
                          >
                            <option value="">Land</option>{" "}
                            {countriesList.map((country) => (
                              <option
                                key={country.countryName}
                                value={country.countryName}
                              >
                                {country.countryName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </form>
                  </div>
                );
              }

              return (
                <div className="form-block-user" key={block?.id}>
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
          <MMapComponent
            key={question.id}
            getMapData={(value) => {
              setValue(value);
            }}
          />
        )}

        {children}
      </InputContainer>
    </>
  );
};

export default DocumentQuestion;
