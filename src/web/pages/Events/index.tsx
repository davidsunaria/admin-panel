import React, { useCallback, useEffect, useState, useMemo } from 'react';
import CustomSuspense from '../../components/CustomSuspense';
import { useStoreActions, useStoreState } from 'react-app-store';
import { IUsers, IEnableDisable, IPagination } from 'react-app-interfaces';
import InfiniteScroll from 'react-infinite-scroll-component';
import ConfirmAlert from '../../components/ConfirmAlert';
import { confirmAlert } from 'react-confirm-alert';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import DEFAULT_EVENT_IMG from 'react-app-images/default_event.png';
import env from '../../../config';
import { truncate } from '../../../lib/utils/Service';

const TableHeader = React.lazy(() => import('../../components/TableHeader'));
const SearchUser = React.lazy(() => import('../../components/SearchUser'));
const Navbar = React.lazy(() => import('../../components/Navbar'));


const Events: React.FC = (): JSX.Element => {
  const tableHeader = useMemo(() => {
    return [
      { key: 'image', value: 'Image' },
      { key: 'name', value: 'Name' },
      { key: 'creator', value: 'Owner' },
      { key: 'group', value: 'Associated group' },
      { key: 'address', value: 'Address' },
      { key: 'capacity', value: 'Capacity' },
      { key: 'capacity_type', value: 'Capacity Type' },
      { key: 'status', value: 'Status' },
      { key: 'is_blocked_by_admin', value: 'Blocked by admin' },
    ]
  }, []);
  const userInititalState = useMemo(() => {
    return {
      q: '', page: env.REACT_APP_FIRST_PAGE, limit: env.REACT_APP_PER_PAGE, status: ''
    }
  }, []);


  const [formData, setFormData] = useState<IUsers>(userInititalState);
  const [pagination, setPagination] = useState<IPagination>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [data, setData] = useState<Array<any>>([]);
  const [exportedData, setExportedData] = useState<Array<any>>([]);
  const [filterStatus, setFilterStatus] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<String>("");
  const [currentUserStatus, setCurrentUserStatus] = useState<String | number>("");
  //State
  const isLoading = useStoreState(state => state.common.isLoading);
  const response = useStoreState(state => state.event.response);
  const exportedEvents = useStoreState(state => state.event.exportedEvents);
  const isEnabledDisabled = useStoreState(state => state.group.isEnabledDisabled);
  const exportStatus = useStoreState(state => state.common.exportStatus);
  //Actions
  const flushData = useStoreActions(actions => actions.group.flushData);
  const getEvents = useStoreActions(actions => actions.event.getEvents);
  const getExportedEvents = useStoreActions(actions => actions.event.getExportedEvents);
  const enableDisable = useStoreActions(actions => actions.group.enableDisable);
  const setExportStatus = useStoreActions(actions => actions.common.setExportStatus);

  const getGroupData = useCallback(async (payload: IUsers) => {
    if(!exportStatus){
    await getEvents({ url: "event/get-all-events", payload });
    }
  }, [exportStatus]);
  const getExportedData = useCallback(async (data: IUsers) => {

    if(exportStatus===true){
      if(!filterStatus){
        let payload = {
          q: data.q,
          status: data.status,
        }
        await getExportedEvents({ url: "event/export", payload});
        await setExportStatus(false)
      }
     
      if(filterStatus){
        let payload = {
          q: data.q,
          status: data.status,
          group_id: data.group_id?data.group_id:"all",
        }
        await getExportedEvents({ url: "event/export", payload });
        await setExportStatus(false)
      }
    }
  }, [filterStatus,exportStatus]);

      useEffect(() => {

        let newArray: any[] = [];
        exportedEvents?.map((item: any) => {

         // here i am  extracting only userId and title
          let obj = {
            Name: item.name, Owner: `${item.creator_of_event.first_name} ${item.creator_of_event.last_name}`,
            Address: item.address, "Associated group":item.event_group?.name, Capacity: item.capacity, "Capacity Type": item.capacity_type,
            Status: item.active == 1 ? "Active" : "Inactive",
            "BlockByAdmin": item.is_blocked_by_admin == 1 ? "Yes" : "No"
          };
           //after extracting what I need, I am adding it to newArray
          newArray?.push(obj);
          // now  I am adding newArray to localstate in order to passing it via props for exporting
          setExportedData(newArray);
        });
      }, [exportedEvents]);

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

  const onSearch = useCallback((payload: IUsers) => {
    console.log("hi")
    setFilterStatus(true)
    setFormData(_ => ({ ..._, ...payload, page: env.REACT_APP_FIRST_PAGE, limit: env.REACT_APP_PER_PAGE }));
  }, []);

  const onReset = useCallback(() => {
    setFormData(userInititalState);
  }, []);

  useEffect(() => {
    if (formData) {
      console.log("form data")
      getGroupData(formData);
      getExportedData(formData)
    }
  }, [formData]);

  const loadMore = useCallback(() => {
    setFormData(_ => ({ ..._, page: parseInt((_.page ?? 1)?.toString()) + 1 }));
  }, []);

  const onYes = useCallback(async (id: string, status: string | number) => {
    setCurrentUserId(id);
    setCurrentUserStatus(status);
    const payload: IEnableDisable = {
      _id: id, type: "event", status: status === 1 ? 0 : 1
    }
    await enableDisable({ url: 'common/enable-disable', payload });
  }, []);

  const enableDisableGroup = useCallback((id, status) => {
    let text: string;
    if (status === 1) {
      text = 'You want to inactivate event?';
    }
    else {
      text = 'You want to activate event?';
    }
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <ConfirmAlert onClose={onClose} onYes={() => onYes(id, status)} heading="Are you sure?" subHeading={text} onCloseText="No" onSubmitText="Yes" />
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
      let index = localStateData.findIndex(item => item._id === currentUserId);
      localStateData[index].status = currentUserStatus === 1 ? 0 : 1;
      //console.log('localStateData', localStateData);
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
        < CustomSuspense>
          <Navbar text={"Manage events"} />
        </CustomSuspense>
        <div className="cardBox">
          < CustomSuspense>
            <SearchUser type={"events"} onSearch={onSearch} onReset={onReset} exporteddata={exportedData} exportButton={true}/>
          </CustomSuspense>
          <div className="table-responsive">
            {
              <InfiniteScroll
                dataLength={currentPage}
                next={loadMore}
                hasMore={(pagination?.nextPage == null) ? false : true}
                loader={isLoading && <h4 className="listingLoader">Loading...</h4>}
                scrollThreshold={0.8}
              >

                <table className="table mb-0">
                  < CustomSuspense>
                    <TableHeader fields={tableHeader} />
                  </CustomSuspense>
                  <tbody>

                    {data && data.length > 0 ? (
                      data.map((val: any, index: number) => (
                        <tr key={index}>
                          <td>
                            {<LazyLoadImage
                              wrapperClassName={"overideImageCircle"}
                              placeholderSrc={DEFAULT_EVENT_IMG}
                              effect={val?.image ? "blur" : undefined}
                              alt={'image'}
                              height={60}
                              src={val?.image ? getImageUrl(val?.image, { type: 'events', width: 60 }) : DEFAULT_EVENT_IMG} // use normal <img> attributes as props
                              width={60} />
                            }
                          </td>
                          <td>{val?.name || '-'}</td>
                          <td><div title={val?.creator_of_event?.first_name + " " + val?.creator_of_event?.last_name}>{truncate(val?.creator_of_event?.first_name + " " + val?.creator_of_event?.last_name) || '-'}</div></td>
                          <td><div title={val?.event_group?.name}>{truncate(val?.event_group?.name) || '-'}</div></td>
                          <td><div title={val?.address}>{truncate(val?.address) || '-'}</div></td>
                          <td>{val?.capacity || '-'}</td>
                          <td>{val?.capacity_type || '-'}</td>
                          <td className={"onHover"} onClick={() => enableDisableGroup(val?._id, val?.status)}>
                            <div className={(val?.status === 1 || val?.status === true) ? "manageStatus active" : "manageStatus inactive"}> {(val?.status === 1 || val?.status === true) ? 'Active' : 'Inactive'}</div></td>
                          <td>
                            <div className={val?.is_blocked_by_admin === 1 ? "manageStatus inactive" : "manageStatus active"}>{val?.is_blocked_by_admin === 1 ? 'Yes' : 'No'}</div>
                          </td>

                        </tr>
                      ))

                    ) : (
                        <tr>
                          <td colSpan={9} className="text-center">No record found</td>
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
export default Events;