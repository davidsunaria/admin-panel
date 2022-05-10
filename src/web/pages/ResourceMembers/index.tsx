import React, { useCallback, useEffect, useState, useMemo,useRef } from 'react';
import { useStoreActions, useStoreState } from 'react-app-store';
import { IUsers,  IPagination } from 'react-app-interfaces';
import 'react-lazy-load-image-component/src/effects/blur.css';
import env from '../../../config';
import CustomSuspense from '../../components/CustomSuspense';

const TableHeader = React.lazy(() => import('../../components/TableHeader'));


const ResourceMembers: React.FC = (): JSX.Element => {
  

   
  
   const inititalState = useMemo(() => {
    return {
       page: env.REACT_APP_FIRST_PAGE, limit: env.REACT_APP_PER_PAGE, resource_type: "group"
    }
  }, []);
  

  const [memberCountPerResource, setMemberCountPerResource] = useState<any[]>([]);
  const [resourcePayload, setResourcePayload] = useState<IUsers>(inititalState);
  const [pagination, setPagination] = useState<IPagination>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [resourceType, setResourceType] = useState<any>("group");
 

  const tableHeader = useMemo(() => {

    if(resourceType==="group"){
        return [
            { key: "Groupname", value: "Group name" },
            { key: "membercount", value: "No. of members" }
        ]
    }
    else{
        return [
            { key: "Eventname", value: "Event name" },
            { key: "membercount", value: "No. of members" },
            { key: "capacity", value: "capacity" }
        ]
    }
   
    },
   [resourceType]);


  const numberOfMemberPerGroup = useStoreState((state) => state.dashboard.numberOfMemberPerGroup);
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
    if (numberOfMemberPerGroup?.data) {
        console.log(numberOfMemberPerGroup?.data)
      const {
        data,
        pagination: [paginationObject],
      } = numberOfMemberPerGroup;
      setPagination(paginationObject);
      setCurrentPage(paginationObject?.currentPage);

      if (paginationObject?.currentPage === 1 || !paginationObject) {
        setMemberCountPerResource(data);
      } else {
        setMemberCountPerResource((_: any) => [..._, ...data]);
      }
    }
  }, [numberOfMemberPerGroup]);

  useEffect(() => {
    getNumberOfMembersPerResource(inititalState);
  }, []);


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

  const changeResourceType = useCallback(async (event) => {
    setResourcePayload((_) => ({
        ..._,
        page: env.REACT_APP_FIRST_PAGE,
        resource_type: event.target.value,
      }));
    setResourceType(event.target.value)
  }, []);

//console.log("memberCountPerResource",memberCountPerResource)
  
  return (
    <>
       <div className="cardBox dashboardBoxes">
              <div className="dashAppointFilterOuter">
                <div className="dashboardSubTitle">No. of resources members</div>
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
              <div className="table-responsive">
                <table className="table customTable stickyHeader">
                  <CustomSuspense>
                    <TableHeader fields={tableHeader} headerWidth={resourceType==="event" ?"w-33":"w-50"} />
                  </CustomSuspense>
                  <tbody onScroll={onScroll} ref={listInnerRef}>
                  {memberCountPerResource && memberCountPerResource.length > 0 ? (
                      memberCountPerResource.map((val: any, index: number) => {
                        return (
                          <tr key={index}>
                            <td className={resourceType==="event" ?"w-33":"w-50"}>{val?.name || 0}</td>
                            <td className={resourceType==="event" ?"w-33":"w-50"}>{val?.resource_members || 0} </td>
                            {resourceType==="event" ? <td className="w-33">{val?.capacity || 0} </td>:null }
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
    </>
  )
}
export default ResourceMembers;