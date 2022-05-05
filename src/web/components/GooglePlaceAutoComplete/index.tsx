import React, { useState, useCallback, HTMLInputTypeAttribute, useEffect } from "react";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import {GoogleApiWrapper} from 'google-maps-react';


const GooglePlaceAutoComplete= () => {
  const [address, setAddress] = useState<string>("");
  const [coordinate, setCoordinate] = useState<object>({
    lat: null,
    lng: null,
  });

  
  

  const handleSelect = useCallback(async (value: any) => {
  
    const result = await geocodeByAddress(value);
    console.log("inside result", result);
    const lat = await getLatLng(result[0]);
    setAddress(value);
    setCoordinate(lat);
  }, []);
  console.log("coordinate", coordinate);
  return (
    <PlacesAutocomplete
      value={address}
      onChange={setAddress}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <div className="filter">
            <div className="search-box mb-3 mb-md-0 me-2">
              {" "}
              <i className="bi bi-search"></i>
              <input
                {...getInputProps({
                  placeholder: "Search Places ...",
                  className: "location-search-input",
                })}
              />
            </div>
          </div>
          <div className="autocomplete-dropdown-container">
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion) => {
              const className = suggestion.active
                ? "suggestion-item--active"
                : "suggestion-item";
              // inline style for demonstration purpose
              const style = suggestion.active
                ? { backgroundColor: "#fafafa", cursor: "pointer" }
                : { backgroundColor: "#ffffff", cursor: "pointer" };
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

export default GoogleApiWrapper({
  apiKey: ("AIzaSyAUa0vyyLKCQpfhy6P5MG3_L87YvhAS1Io")
})(GooglePlaceAutoComplete)

