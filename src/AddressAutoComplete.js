import React, { useState } from "react";
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import axios from "axios";

const API_KEY = "d81b2cda0a254089a5ec6da4bdcac27f";
const GEOCODER_ENDPOINT = "https://api.geoapify.com/v1/geocode/autocomplete";

const AddressAutoComplete = ({setLocation}) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  console.log(selectedLocation)

  const handleInputChange = (event) => {
    if (event.target.value) {
      console.log(event);
      const newValue = event.target.value;

      setInputValue(newValue);

      if (newValue.length >= 3) {
        fetchAddressSuggestions(newValue);
      }
    }
  };

  const handleSelect = async (event) => {
    const selectedValue = event.target.innerHTML;
    setInputValue(selectedValue);

    try {
      console.log(selectedValue);
      const response = await axios.get(GEOCODER_ENDPOINT, {
        params: {
          text: selectedValue,
          apiKey: API_KEY,
        },
      });

      if (response.data.features.length > 0) {
        const selectedFeature = response.data.features[0];
        setSelectedLocation({name: selectedValue, location: selectedFeature.geometry.coordinates});
        setLocation({name: selectedValue, location: selectedFeature.geometry.coordinates})
      }
    } catch (error) {
      console.error("Error fetching selected address location:", error);
    }
  };

  const fetchAddressSuggestions = async (query) => {
    try {
      const response = await axios.get(GEOCODER_ENDPOINT, {
        params: {
          text: query,
          apiKey: API_KEY,
        },
      });

      const suggestions = response.data.features.map(
        (feature) => feature.properties.formatted
      );

      setOptions(suggestions);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };
  return (
    <Autocomplete
      freeSolo
      options={options}
      onInputChange={handleInputChange}
      onChange={handleSelect}
      renderInput={(params) => (
        <TextField {...params} label="Enter an address" variant="outlined" />
      )}
    />
  );
};

export default AddressAutoComplete;
