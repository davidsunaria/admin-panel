import React, { useCallback, useEffect, useState } from "react";
import { useStoreActions, useStoreState } from "react-app-store";
import "react-lazy-load-image-component/src/effects/blur.css";
import LoadingOverlay from "react-loading-overlay-ts";

const SubscriberMemberCount: React.FC = (): JSX.Element => {
  const [subscriberCount, setSubscriberCount] = useState<string | number>(0);
  const [memberCount, setMemberCount] = useState<string | number>(0);

  //State
  const subscribersCount = useStoreState(
    (state) => state.dashboard.subscribersCount
  );
  const membersCount = useStoreState((state) => state.dashboard.membersCount);
  const isSubscriberLoading = useStoreState(
    (state) => state.dashboard.isSubscriberLoading
  );

  //Actions
  const getSubscribersCount = useStoreActions(
    (actions) => actions.dashboard.getSubscribersCount
  );

  const getMembersCount = useStoreActions(
    (actions) => actions.dashboard.getMembersCount
  );

  const getData = useCallback(async () => {
    await getSubscribersCount({ url: "dashboard/get-subscribers-count" });
    await getMembersCount({ url: "dashboard/get-members-count" });
  }, []);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setSubscriberCount(subscribersCount);
  }, [subscribersCount]);

  useEffect(() => {
    setMemberCount(membersCount);
  }, [membersCount]);

  return (
    <>
    <div className="col-lg-6">
      <div className="cardBox dashboardBoxes">
        {isSubscriberLoading && (
          <LoadingOverlay
            active={isSubscriberLoading}
            spinner
            text="Please wait..."
          ></LoadingOverlay>
        )}
        <div className="dashAppointFilterOuter">
          <div className="dashboardSubTitle">No. of members, subscribers</div>
        </div>
        <div className="customScroll">
          <div className="detailOuer">
            <label className="text-dark">Members</label>
            <span>{memberCount || 0}</span>
          </div>
          <div className="detailOuer">
            <label className="text-dark">Subscribers</label>
            <span>{subscriberCount || 0}</span>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};
export default SubscriberMemberCount;
