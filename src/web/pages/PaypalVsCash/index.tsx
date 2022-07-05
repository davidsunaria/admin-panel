import React, { useCallback, useEffect, useState } from "react";
import { useStoreActions, useStoreState } from "react-app-store";
import "react-lazy-load-image-component/src/effects/blur.css";
import LoadingOverlay from "react-loading-overlay-ts";
import * as _ from "lodash";

const PaypalVsCash: React.FC = (): JSX.Element => {
  const { payPalAmount, cashAmount } = useStoreState(
    (state) => state.dashboard.paypalCash
  );
  const totalSum = useStoreState((state) => state.dashboard.totalSum);

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

  const getPercentage = useCallback(
    (perValue: number) => {
      let response = 0;
      if (perValue) {
        response = _.round((perValue * 100) / totalSum, 2);
      }
      return response;
    },
    [payPalAmount, cashAmount]
  );
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
            <div className="detailOuer">
              <label className="text-dark">Cash</label>
              <span>{`${getPercentage(cashAmount)}%`}</span>
            </div>
            <div className="detailOuer">
              <label className="text-dark">Paypal</label>
              <span>{`${getPercentage(payPalAmount)}%`}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default PaypalVsCash;
