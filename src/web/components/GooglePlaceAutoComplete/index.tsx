import React, { useState, useCallback, HTMLInputTypeAttribute, useEffect } from "react";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import {GoogleApiWrapper} from 'google-maps-react';
import env from "../../../config";


const GooglePlaceAutoComplete= (Props:any) => {
  const [address, setAddress] = useState<string>("");
  const [coordinate, setCoordinate] = useState<object>({
    lat: null,
    lng: null,
  });

  
  

  const handleSelect = useCallback(async (value: any) => {
    console.log("value",value)
  
    const result = await geocodeByAddress(value);
    //console.log("inside result", result);
   const address= await  getAddressFromLocation(result)
   console.log(address)
   Props?.onSearch(address?.otherData?.city)
    const lat = await getLatLng(result[0]);
    setAddress(value);
    setCoordinate(lat);
  }, []);
  const options = {
    types: ['city']

  }
  return (
    <PlacesAutocomplete
    
      value={address}
      onChange={setAddress}
      onSelect={handleSelect}
      // searchOptions={options}
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


export const getAddressFromLocation = async (response:any) => {
  try {
      // console.log('ADDRESS JSON:', JSON.stringify(json));

      let formattedAddress = response?.[0]?.formatted_address;
      let addressComponent = response?.[0]?.address_components;
      let valueAvailable = false
      addressComponent?.some((item:any) => {
          if (item?.types?.includes("locality") || item?.types?.includes("political")) {
              valueAvailable = true
              return true
          }
      })
      if (!valueAvailable) {
          addressComponent = response?.[1]?.address_components;
          formattedAddress = response?.[1]?.formatted_address;
      }


      const otherData = getOtherData(addressComponent);
      // console.log('other Data', otherData);

      const address = getFormattedAddress(addressComponent, formattedAddress) //json.results[0].formatted_address;
     // console.log('ADDRESS:', JSON.stringify(address));
      return { address, otherData }
  }
  catch (e) {
     // console.log(e)
      // _showErrorMessage("Location Error: " + e?.message)
      // _showErrorMessage('Location is unavailable, please check your network.', 5000)
      return { address: null, otherData: null }
  }
}

export const getOtherData = (addressComponent: any) => {
  let city = "", state = "", country = "", adminCity = "";
  for (let i = 0; i < addressComponent.length - 1; i++) {
      let locality = addressComponent[i];
      let types = locality.types;
      for (let j = 0; j < types.length - 1; j++) {
          if (types[j] === 'locality') {
              city = locality.long_name
          }
          if (types[j] === 'administrative_area_level_2') {
              adminCity = locality.long_name
          }
          if (types[j] === 'administrative_area_level_1') {
              state = locality.long_name
          }
          if (types[j] === 'country') {
              country = locality.long_name
          }
      }
  }
  return { city: city?.trim() || adminCity?.trim(), state: state?.trim(), country: country?.trim() }
}

export const getFormattedAddress = (addressComponent: any, formattedAddress: string) => {
  let main_text = ""
  let secondary_text = ""
  let b = false

  let cityName = addressComponent?.find((item: any, index: number) => (item?.types?.includes('locality')))?.long_name

  if (!cityName)

      if (cityName)
          return {
              main_text: formattedAddress?.substring(0, formattedAddress?.toLowerCase()?.indexOf(cityName?.toLowerCase())),
              secondary_text: formattedAddress?.substring(formattedAddress?.toLowerCase()?.indexOf(cityName?.toLowerCase()))
          }
  //console.log("addressComponent", addressComponent);

  for (let i = 0; i < addressComponent.length; i++) {
      let address = addressComponent[i];
      let types = address.types;
      if (!types?.includes("postal_code") && !types.includes('plus_code')) {

          if (!types.includes('administrative_area_level_1') && !types.includes('administrative_area_level_2')) {
              if (b) {
                  if (!secondary_text?.includes(address?.long_name)) secondary_text += address?.long_name + ", "
              } else
                  if (!main_text?.includes(address?.long_name)) main_text += (address?.long_name) + ", "

          }
          if (types.includes('administrative_area_level_2') || types.includes('administrative_area_level_1')) {
              b = true
              if (main_text) {
                  if (!secondary_text?.includes(address?.long_name)) secondary_text += address?.long_name + ", "
              }
              else
                  if (!main_text?.includes(address?.long_name)) main_text += address?.long_name + ", "
          } else if (types.includes('country')) {
              if (!secondary_text?.includes(address?.long_name)) secondary_text += address?.long_name + ", "
          }
      }
  }
  main_text = main_text?.trim().slice(0, -1)
  secondary_text = secondary_text?.trim().slice(0, -1)
  if ((!main_text && secondary_text) || (main_text && !secondary_text)) {
      main_text = main_text || secondary_text
      secondary_text = main_text.substring(main_text?.indexOf(", "))?.trim()
      main_text = main_text.substring(0, main_text?.indexOf(", "))?.trim()

      if (secondary_text?.startsWith(","))
          secondary_text = secondary_text?.replace(",", "")

  }
  return {
      main_text: main_text?.trim(), secondary_text: secondary_text?.trim()
  }
}













