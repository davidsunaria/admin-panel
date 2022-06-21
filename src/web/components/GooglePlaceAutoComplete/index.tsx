import React, { useState, useCallback,  useRef } from "react";

import PlacesAutocomplete, {
  
} from "react-places-autocomplete";
import {GoogleApiWrapper} from 'google-maps-react';
import env from "../../../config";


const GooglePlaceAutoComplete= (Props:any) => {
  const [address, setAddress] = useState<string>("");
  

  
  

  const handleSelect = useCallback(async (value: any,placeId:any) => {
  const response = placeRef?.current?.state?.suggestions?.find((_:any)=>_?.placeId===placeId)?.formattedSuggestion
  const address = getOtherDataFromAddress(response)
  if(address?.city){
    Props?.onSearch(address?.city)
  }
  else{
    Props?.onSearch(value)
  }
    setAddress(value);
  }, []);
 
  const placeRef = useRef<PlacesAutocomplete|any>(null);
  return (
    <PlacesAutocomplete
    shouldFetchSuggestions={true}
    ref={placeRef}
      value={address}
      onChange={setAddress}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className="search-outer">
          <div className="filter">
            <div className="search-box mb-3 mb-md-0">
              {" "}
              <i className="bi bi-search"></i>
              <input
                {...getInputProps({
                  placeholder: "Search by city name",
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


export const getOtherDataFromAddress = (address: { mainText: string, secondaryText: string }) => {
  let state = "", country = "";
  const arr = address?.secondaryText?.split(",")
  arr?.some((_, i) => {
      if (i === arr.length - 1) {
          country = _
      } else {
          state = state + (i > 0 ? ", " : "") + _
      }
  })
  return { city: address?.mainText?.trim(), state: state?.trim(), country: country?.trim() }
}













