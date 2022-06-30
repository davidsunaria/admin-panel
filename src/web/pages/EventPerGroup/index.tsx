import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import { useStoreActions, useStoreState } from "react-app-store";
import { IUsers } from "react-app-interfaces";
import "react-lazy-load-image-component/src/effects/blur.css";
import env from "../../../config";
import CustomSuspense from "../../components/CustomSuspense";
import LoadingOverlay from "react-loading-overlay-ts";

const TableHeader = React.lazy(() => import("../../components/TableHeader"));
const NoRecord = React.lazy(() => import("../../components/NoRecord"));

const EventPerGroup: React.FC = (): JSX.Element => {
  const inititalState = useMemo(() => {
    return {
      page: env.REACT_APP_FIRST_PAGE,
      limit: env.REACT_APP_PER_PAGE,
    };
  }, []);

  const tableHeader = useMemo(() => {
    return [
      { key: "group_name", value: "Group name" },
      { key: "event_count", value: "No. of events" },
    ];
  }, []);

  const [groupPayload, setGroupPayload] = useState<IUsers>(inititalState);

  const { pagination, data } = useStoreState(
    (state) => state.dashboard.numberOfEventsPerGroup
  );
  const isEventPerGroupLoading = useStoreState(
    (state) => state.dashboard.isEventPerGroupLoading
  );
  const getEventCountPerGroup = useStoreActions(
    (actions) => actions.dashboard.getEventCountPerGroup
  );

  const getNumberOfEventsPerGroup = useCallback(async (payload) => {
    await getEventCountPerGroup({
      url: "dashboard/get-no-of-events-per-group",
      payload,
    });
  }, []);

  useEffect(() => {
    if (groupPayload) {
      getNumberOfEventsPerGroup(groupPayload);
    }
  }, [groupPayload]);

  const listInnerRef = useRef(null);
  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (
        scrollTop + clientHeight === scrollHeight &&
        pagination[0]?.nextPage !== null
      ) {
        setGroupPayload((_) => ({
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
          {isEventPerGroupLoading && (
            <LoadingOverlay
              active={isEventPerGroupLoading}
              spinner
              text="Please wait..."
            ></LoadingOverlay>
          )}
          <div className="dashAppointFilterOuter">
            <div className="dashboardSubTitle">No. of events per group</div>

            {/* <GooglePlaceAutoComplete /> */}
          </div>
          <div className="table-responsive">
            <table className="table customTable stickyHeader">
              <CustomSuspense>
                <TableHeader fields={tableHeader} />
              </CustomSuspense>
              <tbody onScroll={onScroll} ref={listInnerRef}>
                {data && data?.length > 0 ? (
                  data.map((val: any, index: number) => {
                    return (
                      <tr key={index}>
                        <td className="w-50">{val?.name || 0}</td>
                        <td className="w-50">{val?.events || 0} </td>
                      </tr>
                    );
                  })
                ) : (
                  <NoRecord colspan={2} />
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
export default EventPerGroup;
