import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
  memo
} from "react";
import { useStoreActions, useStoreState } from "react-app-store";
import { IUsers, IPagination } from "react-app-interfaces";
import "react-lazy-load-image-component/src/effects/blur.css";
import env from "../../../config";
import CustomSuspense from "../../components/CustomSuspense";


const TableHeader = React.lazy(() => import("../../components/TableHeader"));

const ResourceMembersPerEvent: React.FC = (): JSX.Element => {
  const inititalState = useMemo(() => {
    return {
      page: env.REACT_APP_FIRST_PAGE,
      limit: env.REACT_APP_PER_PAGE,
      resource_type: "event",
    };
  }, []);

  const [memberCountPerResource, setMemberCountPerResource] = useState<any[]>(
    []
  );
  const [resourcePayload, setResourcePayload] = useState<IUsers>(inititalState);
  const [pagination, setPagination] = useState<IPagination>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const tableHeader = useMemo(() => {
    return [
      { key: "Eventname", value: "Event name" },
      { key: "membercount", value: "No. of members" },
      { key: "capacity", value: "capacity" },
    ];
  }, []);

  const numberOfMemberPerEvent = useStoreState(
    (state) => state.dashboard.numberOfMemberPerEvent
  );
  const getMembersCountPerResource = useStoreActions(
    (actions) => actions.dashboard.getMembersCountPerResource
  );

  const getNumberOfMembersPerResource = useCallback(async (payload) => {
    await getMembersCountPerResource({
      url: "dashboard/get-no-of-resource-members",
      payload,
    });
  }, []);

  useEffect(() => {
    if (numberOfMemberPerEvent?.data) {
      console.log(numberOfMemberPerEvent?.data);
      const {
        data,
        pagination: [paginationObject],
      } = numberOfMemberPerEvent;
      setPagination(paginationObject);
      setCurrentPage(paginationObject?.currentPage);

      if (paginationObject?.currentPage === 1 || !paginationObject) {
        setMemberCountPerResource(data);
      } else {
        setMemberCountPerResource((_: any) => [..._, ...data]);
      }
    }
  }, [numberOfMemberPerEvent]);

 

  useEffect(() => {
    if (resourcePayload) {
      getNumberOfMembersPerResource(resourcePayload);
    }
  }, [resourcePayload]);

  const listInnerRef = useRef(null);
  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        setResourcePayload((_) => ({
          ..._,
          page: parseInt((_.page ?? 1)?.toString()) + 1,
        }));
      }
    }
  };

  console.log("hi")
  return (
    <>
      <div className="table-responsive">
        
        <table className="table customTable stickyHeader">
          <CustomSuspense>
            <TableHeader fields={tableHeader} headerWidth={"w-33"} />
          </CustomSuspense>
          <tbody onScroll={onScroll} ref={listInnerRef}>
            {memberCountPerResource && memberCountPerResource.length > 0 ? (
              memberCountPerResource.map((val: any, index: number) => {
                return (
                  <tr key={index}>
                    <td className={"w-33"}>{val?.name || 0}</td>
                    <td className={"w-33"}>{val?.resource_members || 0} </td>
                    <td className="w-33">{val?.capacity || 0} </td>
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
    </>
  );
};
export default memo(ResourceMembersPerEvent);
