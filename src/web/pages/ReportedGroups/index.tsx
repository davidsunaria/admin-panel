import React, { Suspense, useCallback, useEffect, useState, useMemo } from 'react';
import { useStoreActions, useStoreState } from 'react-app-store';
import { IUsers, IEnableDisable, IPagination } from 'react-app-interfaces';
import InfiniteScroll from 'react-infinite-scroll-component';
import ConfirmAlert from '../../components/ConfirmAlert';
import { confirmAlert } from 'react-confirm-alert';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import env from '../../../config';
import DEFAULT_GROUP_IMG from 'react-app-images/default_group.png';
import { truncate } from '../../../lib/utils/Service';
import moment from "moment"

const TableHeader = React.lazy(() => import('../../components/TableHeader'));
const SearchUser = React.lazy(() => import('../../components/SearchUser'));
const Navbar = React.lazy(() => import('../../components/Navbar'));


const ReportedGroups: React.FC = (): JSX.Element => {
  const tableHeader = useMemo(() => {
    return [
      { key: 'image', value: 'Image' },
      { key: 'name', value: 'Group Name' },
      { key: 'creator', value: 'Admin' },
      { key: 'category', value: 'Purpose' },
      { key: 'address', value: 'Address' },
      { key: 'reported', value: 'Reported at' },
      { key: 'reported', value: 'Reported by' },
      { key: 'action', value: 'Action' },
    ]
  }, []);
  const userInititalState = useMemo(() => {
    return {
      q: '', page: env.REACT_APP_FIRST_PAGE, limit: env.REACT_APP_PER_PAGE, is_blocked_by_admin: "all", resource_type: "group"
    }
  }, []);

  const [formData, setFormData] = useState<IUsers>(userInititalState);
  const [pagination, setPagination] = useState<IPagination>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [data, setData] = useState<Array<any>>([]);
  const [currentUserId, setCurrentUserId] = useState<String>("");
  const [currentUserStatus, setCurrentUserStatus] = useState<String | number>("");
  //State
  const isLoading = useStoreState(state => state.common.isLoading);
  const response = useStoreState(state => state.reportedResource.reportedGroupsResponse);
  const isEnabledDisabled = useStoreState(state => state.reportedResource.isEnabledDisabled);
  //Actions
  const flushData = useStoreActions(actions => actions.reportedResource.flushData);
  const getGroups = useStoreActions(actions => actions.reportedResource.getReportedGroups);
  const enableDisable = useStoreActions(actions => actions.reportedResource.enableDisable);

  const getGroupData = useCallback(async (payload: IUsers) => {
    await getGroups({ url: "resource/get-reported-resources", payload });
  }, []);

  useEffect(() => {
    //console.log('Response', response);
    if (response?.data) {
      const { data, pagination: [paginationObject] } = response;
      setPagination(paginationObject);
      setCurrentPage(paginationObject?.currentPage);


      if (paginationObject?.currentPage === 1 || !paginationObject) {
        setData(data);
      }
      else {
        setData((_: any) => [..._, ...data]);
      }
    }
  }, [response]);
  //console.log("response",response)
  const onSearch = useCallback((payload: IUsers) => {
    setFormData(_ => ({ ..._, ...payload, page: env.REACT_APP_FIRST_PAGE, limit: env.REACT_APP_PER_PAGE }));
  }, []);

  const onReset = useCallback(() => {
    setFormData(userInititalState);
  }, []);

  useEffect(() => {
    if (formData) {
      getGroupData(formData);
    }
  }, [formData]);

  const loadMore = useCallback(() => {
    setFormData(_ => ({ ..._, page: parseInt((_.page ?? 1)?.toString()) + 1 }));
  }, []);

  const onYes = useCallback(async (id: string, is_blocked_by_admin: string | number) => {
    setCurrentUserId(id);
    setCurrentUserStatus(is_blocked_by_admin);
    const payload: IEnableDisable = {
      _id: id, type: "group", is_blocked_by_admin: is_blocked_by_admin === 1 ? 0 : 1
    }
    await enableDisable({ url: 'resource/enable-disable-resource', payload });
  }, []);

  const enableDisableGroup = useCallback((id, is_blocked_by_admin) => {
    let text: string;
    if (is_blocked_by_admin === 1) {
      text = 'You want to inactivate group?';
    }
    else {
      text = 'You want to activate group?';
    }
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <ConfirmAlert onClose={onClose} onYes={() => onYes(id, is_blocked_by_admin)} heading="Are you sure?" subHeading={text} onCloseText="No" onSubmitText="Yes" />
        );
      }
    });
  }, []);

  const getImageUrl = (url: string, options: any) => {
    return `${env.REACT_APP_MEDIA_URL}` + options?.type + "/" + url + "?width=" + options?.width + "&height=" + (options?.height || "")
  }

  useEffect(() => {
    async function changeData() {
      let localStateData = [...data];
      let index = localStateData.findIndex(item => item.reported_groups._id === currentUserId);
      localStateData[index].reported_groups.is_blocked_by_admin = currentUserStatus === 1 ? 0 : 1;
      setData(localStateData);
      await flushData();
    }
    if (isEnabledDisabled && isEnabledDisabled === true) {
      changeData();
      setCurrentUserId("");
      setCurrentUserStatus("");
    }
  }, [isEnabledDisabled]);

  return (
    <>
      <div className="Content">
        <Suspense fallback={<>Loading...</>}>
          <Navbar text={"Reported groups"} />
        </Suspense>
        <div className="cardBox">
          <Suspense fallback={<>Loading...</>}>
            <SearchUser type={"reported"} onSearch={onSearch} onReset={onReset} />
          </Suspense>
          <div className="table-responsive">
            {
              <InfiniteScroll
                dataLength={currentPage}
                next={loadMore}
                hasMore={(pagination?.nextPage == null) ? false : true}
                loader={isLoading && <h4>Loading...</h4>}
                scrollThreshold={0.8}
              >

                <table className="table mb-0">
                  <Suspense fallback={<>Loading...</>}>
                    <TableHeader fields={tableHeader} />
                  </Suspense>
                  <tbody>
                    {data && data.length > 0 ? (
                      data.map((val: any, index: number) => (
                        <tr key={index}>
                          <td>
                            {<LazyLoadImage
                              wrapperClassName={"overideImageCircle"}
                              placeholderSrc={DEFAULT_GROUP_IMG}
                              effect={val?.image ? "blur" : undefined}
                              alt={'image'}
                              height={60}
                              src={val?.reported_groups?.image ? getImageUrl(val?.reported_groups?.image, { type: 'groups', width: 60 }) : DEFAULT_GROUP_IMG} // use normal <img> attributes as props
                              width={60} />
                            }
                          </td>
                          <td>{val?.reported_groups?.name || '-'}</td>
                          <td><div title={val?.group_creator?.first_name + " " + val?.group_creator?.last_name}>{truncate(val?.group_creator?.first_name + " " + val?.group_creator?.last_name) || '-'}</div></td>

                          <td>{val?.category || '-'}</td>
                          <td><div title={val?.reported_groups?.address}>{truncate(val?.reported_groups?.address) || '-'}</div></td>
                          <td>{moment(val?.created_at).format('MMMM Do YYYY, h:mm:ss a') || '-'}</td>
                          <td>
                            {val?.resource_reporter.map((value: any, i: number, row: Array<object>) => {
                              return (
                                <span title={value?.first_name + " " + value?.last_name}>{
                                  truncate(i + 1 !== row.length ? value?.first_name + " " + value?.last_name + ", " : value?.first_name + " " + value?.last_name) || '-'}
                                </span>)
                            })}
                          </td>
                          <td className={"onHover"} onClick={() => enableDisableGroup(val?.reported_groups?._id, val?.reported_groups?.is_blocked_by_admin)}>
                            <div className={(val?.reported_groups?.is_blocked_by_admin === 1 || val?.reported_groups?.is_blocked_by_admin === false) ? "manageStatus inactive" : "manageStatus active"}> {(val?.reported_groups?.is_blocked_by_admin === 1 || val?.reported_groups?.is_blocked_by_admin === true) ? 'Inactive' : 'active'}</div></td>
                        </tr>
                      ))

                    ) : (
                        <tr>
                          <td colSpan={6} className="text-center">No record found</td>
                        </tr>
                      )}


                  </tbody>
                </table>
              </InfiniteScroll>
            }
          </div>
        </div>
      </div>
    </>
  )
}
export default ReportedGroups;