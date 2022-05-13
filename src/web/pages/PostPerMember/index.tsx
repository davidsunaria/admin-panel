import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

import CustomSuspense from "../../components/CustomSuspense";
import { IUsers, IPagination } from "react-app-interfaces";
import { useStoreActions, useStoreState } from "react-app-store";
import LoadingOverlay from "react-loading-overlay-ts";
import env from "../../../config";
import { truncate } from "../../../lib/utils/Service";
const TableHeader = React.lazy(() => import("../../components/TableHeader"));

const Dashboard: React.FC = (): JSX.Element => {
  const inititalState = useMemo(() => {
    return {
      page: env.REACT_APP_FIRST_PAGE,
      limit: env.REACT_APP_PER_PAGE,
    };
  }, []);
  const tableHeader = useMemo(() => {
    return [
      { key: "first_name", value: "First name" },
      { key: "last_name", value: "Last name" },
      { key: "group", value: "No. of Group" },
      { key: "event", value: "No. of Event" },
    ];
  }, []);

  const [numberOfResourcePerMember, setNumberOfResourcePerMember] = useState<
    any[]
  >([]);
  const [resourcePayload, setResourcePayload] = useState<IUsers>(inititalState);
  const [nextPage, setNextPage] = useState<number>(1);


  const postPerMember = useStoreState((state) => state.dashboard.postPerMember);
  const isPostPerMemberLoading = useStoreState(
    (state) => state.dashboard.isPostPerMemberLoading
  );
  const getPostPerMember = useStoreActions(
    (actions) => actions.dashboard.getPostPerMember
  );

  const getNumberOfEventGroupPerMember = useCallback(async (payload) => {
    await getPostPerMember({
      url: "dashboard/get-no-of-resources-per-member",
      payload,
    });
  }, []);

  useEffect(() => {
    if (postPerMember?.data) {
      const {
        data,
        pagination: [paginationObject],
      } = postPerMember;
      setNextPage(paginationObject?.nextPage);

      if (paginationObject?.currentPage === 1 || !paginationObject) {
        setNumberOfResourcePerMember(data);
      } else {
        setNumberOfResourcePerMember((_: any) => [..._, ...data]);
      }
    }
  }, [postPerMember]);

  useEffect(() => {
    if (resourcePayload) {
      getNumberOfEventGroupPerMember(resourcePayload);
    }
  }, [resourcePayload]);

  const listInnerRef = useRef(null);
  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight && nextPage !==null) {
        setResourcePayload((_) => ({
          ..._,
          page: parseInt((_.page ?? 1)?.toString()) + 1,
        }));
      }
    }
  };

  //console.log("postPerMember",postPerMember)

  const computeResourceCount = useCallback((index,value) => {
      
    let response = { group: 0, event: 0 };
    value?.length > 0 &&
      value?.map((value: any, index: number) => 
      {
        if (value?._id === "group") {
          response = { ...response, group: value?.total };
        }
        if (value?._id === "event") {
          response = { ...response, event: value?.total };
        }
      });
    return response;
  }, []);
  //console.log("helooo");
  return (
      
    <>
    
      <div className="col-lg-6">
        <div className="cardBox dashboardBoxes">
          {isPostPerMemberLoading && (
            <LoadingOverlay
              active={isPostPerMemberLoading}
              spinner
              text="Please wait..."
            ></LoadingOverlay>
          )}
          <div className="dashAppointFilterOuter">
            <div className="dashboardSubTitle">Group, events per member</div>
            {/* <div className="filter">
                  <div className="search-box mb-3 mb-md-0 me-2">
                    {" "}
                    <i className="bi bi-search"></i>
                    <input type="text" placeholder="Search" />
                  </div>
                </div>  */}
          </div>
          <div className="table-responsive">
            <table className="table customTable stickyHeader">
              <CustomSuspense>
                <TableHeader fields={tableHeader} headerWidth={"w-33"} />
              </CustomSuspense>
              <tbody onScroll={onScroll} ref={listInnerRef}>
                {numberOfResourcePerMember &&
                numberOfResourcePerMember?.length > 0 ? (
                  numberOfResourcePerMember.map((val: any, index: number) => {
                    // console.log("vala",val)
                    let { group, event } = computeResourceCount(index, val?.resources);
                    return (
                      <tr key={index}>
                        <td className={"w-33"}>
                          {truncate(val?.first_name) || "-"}
                        </td>

                        <td className={"w-33"}>
                          {truncate(val?.last_name) ||"-"}
                        </td>

                        <td className={"w-33"}>
                          {group}
                        </td>
                        <td className="w-33">
                          {event}
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
export default Dashboard;
