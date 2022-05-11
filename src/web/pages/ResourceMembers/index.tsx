import React, { useCallback, useState,memo } from 'react';
import LoadingOverlay from "react-loading-overlay-ts";
import { useStoreState } from "react-app-store";
const ResourceMembersPerEvent = React.lazy(() => import("../ResourceMembersPerEvent"));
const ResourceMembersPerGroup = React.lazy(() => import("../ResourceMembersPerGroup"));


const ResourceMembers: React.FC = (): JSX.Element => {
 
  const [resourceType, setResourceType] = useState<any>("group");
 
  const isMembersPerResourceLoading = useStoreState(state => state.dashboard.isMembersPerResourceLoading);
  const changeResourceType = useCallback(async (event) => {
    setResourceType(event.target.value)
  }, []);

  
  return (
    <>
    <div className="col-lg-6">
       <div className="cardBox dashboardBoxes">
       {isMembersPerResourceLoading && (
          <LoadingOverlay
            active={isMembersPerResourceLoading}
            spinner
            text="Please wait..."
          ></LoadingOverlay>
        )}
              <div className="dashAppointFilterOuter">
                <div className="dashboardSubTitle">#Members</div>
                <div className="filter">
                  <select
                    className="form-select me-2"
                    aria-label="Default select example"
                    onChange={changeResourceType}
                  >
                    <option value={"group"}>Groups</option>
                    <option value={"event"}>Events</option>
                  </select>
                </div>
              </div>
              {resourceType==="group"? <ResourceMembersPerGroup/>: <ResourceMembersPerEvent/>}
            </div>
            </div>
    </>
  )
}
export default memo(ResourceMembers) 