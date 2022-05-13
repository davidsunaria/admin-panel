import React, { useCallback, useEffect, useState } from "react";
import { useStoreActions, useStoreState } from "react-app-store";
import "react-lazy-load-image-component/src/effects/blur.css";
import LoadingOverlay from "react-loading-overlay-ts";
import * as _ from "lodash";

const PaypalVsCash: React.FC = (): JSX.Element => {
  const [paypalCash, setPaypalCash] = useState<[]>([]);
  const [totalSum, setTotalSum] = useState<any>(null);

  //State
  const paypalVsCash = useStoreState((state) => state.dashboard.paypalVsCash);
  const isPaypalVsCashLoading = useStoreState(
    (state) => state.dashboard.isPaypalVsCashLoading
  );

  //Actions
  const getPaypalVsCash = useStoreActions(
    (actions) => actions.dashboard.getPaypalVsCash
  );

  const getData = useCallback(async () => {
    await getPaypalVsCash({ url: "dashboard/get-percentage-paypal-vs-cash" });
  }, []);

  useEffect(() => {
    getData();
  }, []);
 

  useEffect(() => {
    setPaypalCash(paypalVsCash);
    let sum = _.sumBy(paypalVsCash, 'total');
    setTotalSum(sum)
  }, [paypalVsCash]);


const getPercentage = useCallback((perValue:any) => {
  let response =0 
   response= _.round((perValue*100)/totalSum, 2); 
   return response;
  }, [paypalCash]);


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
            <div className="dashboardSubTitle">Paypal vs Cash</div>
          </div>
          <div className="customScroll">
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
          </div>
        </div>
      </div>
    </>
  );
};
export default PaypalVsCash;