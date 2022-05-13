import React, { useCallback, useEffect, useState } from "react";
import { useStoreActions, useStoreState } from "react-app-store";
import "react-lazy-load-image-component/src/effects/blur.css";
import LoadingOverlay from "react-loading-overlay-ts";
import * as _ from "lodash";
const GooglePlaceAutoComplete = React.lazy(
  () => import("../../components/GooglePlaceAutoComplete")
);

const GroupEventByLocation: React.FC = (): JSX.Element => {
  const [paypalCash, setPaypalCash] = useState<[]>([]);
  const [totalSum, setTotalSum] = useState<any>(null);
  const [city, setCity] = useState<any>();

  //State
  const groupEventByLocation = useStoreState((state) => state.dashboard.groupEventByLocation);
  const isPaypalVsCashLoading = useStoreState(
    (state) => state.dashboard.isPaypalVsCashLoading
  );

  //Actions
  const getGroupEventByLocation = useStoreActions(
    (actions) => actions.dashboard.getGroupEventByLocation
  );
  
  const getData = useCallback(async (city) => {
    //console.log("api",city)
    await getGroupEventByLocation({ url: `dashboard/get-resources-by-location?page=1&limit=10&city=${city}` });
  }, []);

  


const getCity = useCallback((value:any) => {
 getData(value)
  }, []);

  console.log("city",city)
 

const getPercentage = useCallback((perValue:any) => {
  let response =0 
   response= _.round((perValue*100)/totalSum, 2); 
   return response;
  }, [paypalCash]);

  
  console.log("groupEventByLocation",groupEventByLocation)
  return (
    <>
      <div className="col-lg-6">
        <div className="cardBox dashboardBoxes">
          {isPaypalVsCashLoading && (
            <LoadingOverlay
              active={isPaypalVsCashLoading}
              spinner
              text="Please wait..."
            ></LoadingOverlay>
          )}
          <div className="dashAppointFilterOuter">
            <div className="dashboardSubTitle">Group and Event By Location</div>
            <GooglePlaceAutoComplete onSearch={getCity}/>
          </div>
          {/* <div className="customScroll">
             {paypalCash && paypalCash?.length > 0
              ? paypalCash.map((val:any, i:number) => {
                  return (
                    <div key={i} className="detailOuer">
                      <label>{val?._id}</label>
                     <span>{getPercentage(val?.total)+"%"}</span> 
                    </div>
                  );
                })
              : null}
          </div> */}
        </div>
      </div>
    </>
  );
};
export default GroupEventByLocation;
