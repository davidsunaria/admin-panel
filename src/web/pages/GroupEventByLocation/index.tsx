import React, { useCallback, useEffect, useState ,useMemo,useRef} from "react";
import { useStoreActions, useStoreState } from "react-app-store";
import "react-lazy-load-image-component/src/effects/blur.css";
import LoadingOverlay from "react-loading-overlay-ts";
import env from "../../../config";
import { IUsers} from "react-app-interfaces";
import CustomSuspense from "../../components/CustomSuspense";
const GooglePlaceAutoComplete = React.lazy(
  () => import("../../components/GooglePlaceAutoComplete")
);
const TableHeader = React.lazy(() => import("../../components/TableHeader"));



const GroupEventByLocation: React.FC = (): JSX.Element => {
  const inititalState = useMemo(() => {
    return {
      page: env.REACT_APP_FIRST_PAGE,
      limit: env.REACT_APP_PER_PAGE,
      city:""
    };
  }, []);
  const tableHeader = useMemo(() => {
    return [
      { key: "city", value: "City" },
      { key: "group", value: "No. of Group" },
      { key: "event", value: "No. of Event" },
    ];
  }, []);
  const [params, setParams] = useState<IUsers>(inititalState);
  const [data, setData] = useState<any[]>([]);

  //State
  const groupEventByLocation = useStoreState(
    (state) => state.dashboard.groupEventByLocation
  );
  const isGroupEventByLocationLoading = useStoreState(
    (state) => state.dashboard.isGroupEventByLocationLoading
  );

  //Actions
  const getGroupEventByLocation = useStoreActions(
    (actions) => actions.dashboard.getGroupEventByLocation
  );
 

  const getData = useCallback(async (payload) => {
    console.log("hi")
    await getGroupEventByLocation({
      url: "dashboard/get-resources-by-location",
      payload,
    });
  }, []);

  

  useEffect(() => {
    if (params) {
      getData(params);
    }
  }, [params]);

  const getCity = useCallback((value: any) => {
    setParams((_) => ({
      ..._,
      city: value,
    }));
  }, []);

  useEffect(() => {
    if (groupEventByLocation?.data) {
      const {
        data,
        pagination: [paginationObject],
      } = groupEventByLocation;
     

      if (paginationObject?.currentPage === 1 || !paginationObject) {
        setData(data);
      } 
      else {
        setData((_: any) => [..._, ...data]);
      }
    }
  }, [groupEventByLocation]);


  // useEffect(() => {
  //   setData(groupEventByLocation?.data);
  // }, [groupEventByLocation]);

  const listInnerRef = useRef(null);
  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        setParams((_) => ({
          ..._,
          page: parseInt((_.page ?? 1)?.toString()) + 1,
        }));
      }
    }
  };

  return (
    <>
      <div className="col-lg-6">
        <div className="cardBox dashboardBoxes">
          {isGroupEventByLocationLoading && (
            <LoadingOverlay
              active={isGroupEventByLocationLoading}
              spinner
              text="Please wait..."
            ></LoadingOverlay>
          )}
          <div className="dashAppointFilterOuter">
            <div className="dashboardSubTitle">Groups,events by location</div>
            <GooglePlaceAutoComplete onSearch={getCity} />
          </div>
          <div className="table-responsive">
          <table className="table customTable stickyHeader">
              <CustomSuspense>
                <TableHeader fields={tableHeader} headerWidth={"w-50"} />
              </CustomSuspense>
              <tbody onScroll={onScroll} ref={listInnerRef}>
                {data &&
                data?.length > 0 ? (
                  data.map((val: any, index: number) => {
                    // console.log("vala",val)
                    return (
                      <tr key={index}>
                        <td className={"w-50"}>
                          {val?.city}
                        </td>
                        <td className={"w-50"}>
                          {val?.total_groups}
                        </td>
                        <td className={"w-50"}>
                          {val?.total_events}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={2}>No data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
export default GroupEventByLocation;
