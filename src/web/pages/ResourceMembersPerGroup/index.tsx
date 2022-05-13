import React, { useCallback, useEffect, useState, useMemo,useRef,memo } from 'react';
import { useStoreActions, useStoreState } from 'react-app-store';
import { IUsers,  IPagination } from 'react-app-interfaces';
import 'react-lazy-load-image-component/src/effects/blur.css';
import env from '../../../config';
import CustomSuspense from '../../components/CustomSuspense';

const TableHeader = React.lazy(() => import('../../components/TableHeader'));


const ResourceMembersPerGroup: React.FC = (): JSX.Element => {
  

   
  
   const inititalState = useMemo(() => {
    return {
       page: env.REACT_APP_FIRST_PAGE, limit: env.REACT_APP_PER_PAGE, resource_type: "group"
    }
  }, []);
  

  const [memberCountPerResource, setMemberCountPerResource] = useState<any[]>([]);
  const [resourcePayload, setResourcePayload] = useState<IUsers>(inititalState);
  const [nextPage, setNextPage] = useState<number>(1);
 
 

  const tableHeader = useMemo(() => {
        return [
            { key: "Groupname", value: "Group name" },
            { key: "membercount", value: "No. of members" }
        ]
    }, []);
  


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
      const {
        data,
        pagination: [paginationObject],
      } = numberOfMemberPerGroup;
      setNextPage(paginationObject?.nextPage);

      if (paginationObject?.currentPage === 1 || !paginationObject) {
        setMemberCountPerResource(data);
      } else {
        setMemberCountPerResource((_: any) => [..._, ...data]);
      }
    }
  }, [numberOfMemberPerGroup]);

  


  useEffect(() => {
    if (resourcePayload) {
        getNumberOfMembersPerResource(resourcePayload);
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

  
  return (
    <>
              
              <div className="table-responsive">
                <table className="table customTable stickyHeader">
                  <CustomSuspense>
                    <TableHeader fields={tableHeader} headerWidth={"w-50"} />
                  </CustomSuspense>
                  <tbody onScroll={onScroll} ref={listInnerRef}>
                  {memberCountPerResource && memberCountPerResource?.length > 0 ? (
                      memberCountPerResource.map((val: any, index: number) => {
                        return (
                          <tr key={index}>
                            <td className={"w-50"}>{val?.name || 0}</td>
                            <td className={"w-50"}>{val?.resource_members || 0} </td>
                             {/* <td className="w-33">{val?.capacity || 0} </td> */}
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
  )
}
export default memo(ResourceMembersPerGroup) ;