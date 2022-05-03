import React, { useState, useCallback, HTMLInputTypeAttribute, useEffect } from "react";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

interface IInput {
  type?: HTMLInputTypeAttribute | undefined;
  value?: string | ReadonlyArray<string> | number | undefined;
  label?: string | undefined;
  name?: string;
  id?: string | undefined;
  placeholder?: string | undefined;
  autoComplete?: string | undefined;
  className?: string | undefined;
  onChange?: (e: any) => void;
  onBlur?: (e: any) => void;
}

const GooglePlaceAutoComplete: React.FC<IInput> = ({
  type,
  className,
  value,
  label,
  name,
  id,
  placeholder,
  autoComplete,
  onChange,
  onBlur,
}) => {
  const [address, setAddress] = useState<string>("");
  const [coordinate, setCoordinate] = useState<object>({
    lat: null,
    lng: null,
  });

  // const loadScript = async (src:any) => {
  //   return new Promise((resolve) => {
  //     const script = document.createElement('script');
  //     script.src = src;
  //     script.onload = () => {
  //       console.log("true")
  //       resolve(true);
  //     };
  //     script.onerror = () => {
  //       console.log("false")
  //       resolve(false);
  //     };
  //     document.body.appendChild(script);
  //   });
  // }
 

  useEffect(()=>{
    const script = document.createElement("script");
    
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAUa0vyyLKCQpfhy6P5MG3_L87YvhAS1Io&libraries=places";
    script.async = true;

    document.body.appendChild(script);
  },[])


  

  const handleSelect = useCallback(async (value: any) => {
  
    console.log("value", value);
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
export default GooglePlaceAutoComplete;
