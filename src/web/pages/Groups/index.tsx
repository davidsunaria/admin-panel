import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useStoreActions, useStoreState } from 'react-app-store';
import { IUsers, IEnableDisable, IPagination ,ILockedGroup} from 'react-app-interfaces';
import InfiniteScroll from 'react-infinite-scroll-component';
import ConfirmAlert from '../../components/ConfirmAlert';
import CustomSuspense from '../../components/CustomSuspense';
import { confirmAlert } from 'react-confirm-alert';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import env from '../../../config';
import DEFAULT_GROUP_IMG from 'react-app-images/default_group.png';
import { truncate } from '../../../lib/utils/Service';
import { Formik } from 'formik';
import _, { toUpper } from 'lodash';

const TableHeader = React.lazy(() => import('../../components/TableHeader'));
const SearchUser = React.lazy(() => import('../../components/SearchUser'));
const Navbar = React.lazy(() => import('../../components/Navbar'));
const MyModal = React.lazy(() => import('../../components/MyModal'));
const InputRadio = React.lazy(() => import('../../components/InputRadio'));


const Groups: React.FC = (): JSX.Element => {
  const tableHeader = useMemo(() => {
    return [
      { key: 'image', value: 'Image' },
      { key: 'name', value: 'Name' },
      { key: 'creator', value: 'Owner' },
      { key: 'category', value: 'Purpose' },
      { key: 'address', value: 'Address' },
      { key: 'status', value: 'Status' },
      { key: 'is_blocked_by_admin', value: 'Blocked by admin' },
      { key: 'restrictedMode', value: 'Restricted Mode' },
      { key: 'action', value: 'Action' },
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
 // const [exportedData, setExportedData] = useState<Array<any>>([]);
  const [currentUserId, setCurrentUserId] = useState<String>("");
  const [currentUserStatus, setCurrentUserStatus] = useState<String | number>("");
  const [restrictedMode, setRestrictedMode] = useState<any>("");
  const [currentRestrictedMode, setCurrentRestrictedMode] = useState<any>("");
  const [isOpen, setIsOpen] = useState(false);
  const [groupId, setGroupId] = useState<String>("");
  //State
  const isLoading = useStoreState(state => state.common.isLoading);
  const response = useStoreState(state => state.group.response);
 // const exportedGroups = useStoreState(state => state.group.exportedGroups);
  const isEnabledDisabled = useStoreState(state => state.group.isEnabledDisabled);
  const isLockedUnlocked = useStoreState(state => state.group.isLockedUnlocked);
  //Actions
  //Actions
  const flushData = useStoreActions(actions => actions.group.flushData);
  const getGroups = useStoreActions(actions => actions.group.getGroups);
 // const getExportedGroups = useStoreActions(actions => actions.group.getExportedGroups);
  const enableDisable = useStoreActions(actions => actions.group.enableDisable);
  const lockedUnlocked = useStoreActions(actions => actions.group.lockedUnlocked);
  
  const toggle = () => setIsOpen(!isOpen);

  const openLockedPostingModal = async(id: string, restriction_mode: any) => {
    toggle()
    setGroupId(id);
    setCurrentRestrictedMode(restriction_mode)
  }

  const getGroupData = useCallback(async (payload: IUsers) => {
      await getGroups({ url: "group/get-all-groups", payload });
  }, []);

  // const getExportedData = useCallback(async (data: IUsers) => {
  //   if(exportStatus===true){
  //     console.log("grup",exportStatus)
  //     let payload = {
  //       q: data.q,
  //       status: data.status,
  //     }
  //     await getExportedGroups({ url: "group/export", payload });
  //    await setExportStatus(false)
  //   }
    
  // }, [exportStatus]);


  // useEffect(() => {

  //   let newArray: any[] = [];
  //   exportedGroups?.map((item: any) => {

  //     // here i am  extracting only userId;
  //     let obj = {
  //       Name: item.name, Owner: `${item.creator_of_group.first_name} ${item.creator_of_group.last_name}`, Purpose: item.category,
  //       Address: item.address, Status: item.active == 1 ? "Active" : "Inactive",
  //       "BlockByAdmin": item.is_blocked_by_admin == 1 ? "Yes" : "No"
  //     };
  //     //     //     // after extracting what I need, I am adding it to newArray
  //     newArray?.push(obj);
  //     //     //     // now  I am adding newArray to localstate in order to passing it via props for exporting
  //     setExportedData(newArray);
  //   });


  // }, [exportedGroups]);
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
    setFormData(_ => ({ ..._, ...payload, page: env.REACT_APP_FIRST_PAGE, limit: env.REACT_APP_PER_PAGE }));
  }, []);

  const onReset = useCallback(() => {
    setFormData(userInititalState);
    getGroupData(formData);
  }, []);

  useEffect(() => {
    if (formData) {
      getGroupData(formData);
    //  getExportedData(formData)
    }
  }, [formData]);

  const loadMore = useCallback(() => {
    setFormData(_ => ({ ..._, page: parseInt((_.page ?? 1)?.toString()) + 1 }));
  }, []);

  const onYes = useCallback(async (id: string, status: string | number) => {
    setCurrentUserId(id);
    setCurrentUserStatus(status);
    const payload: IEnableDisable = {
      _id: id, type: "group", status: status === 1 ? 0 : 1
    }
    await enableDisable({ url: 'common/enable-disable', payload });
  }, []);




  const enableDisableGroup = useCallback((id, status) => {
    let text: string;
    if (status === 1) {
      text = 'You want to inactivate group?';
    }
    else {
      text = 'You want to activate group?';
    }
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <ConfirmAlert onClose={onClose} onYes={() => onYes(id, status)} heading="Are you sure?" subHeading={text} onCloseText="No" onSubmitText="Yes" />
        );
      }
    });
  }, []);

  

  const radioParameters: any = [
    { value: "open", label: "Open", name: "restriction_mode" },
    { value: "subscribed", label: "Subscriber only", name: "restriction_mode" },
    { value: "admin", label: "Admin only", name: "restriction_mode" },
  ]


  const lockedGroupInititalState = useCallback((): ILockedGroup => {
    return {
      restriction_mode: currentRestrictedMode ??  "",
      _id: '',
    }
  }, [currentRestrictedMode]);

  const modal = React.useMemo(() => {
    return <>
      <MyModal heading={"Restrict Group"} showSubmitBtn={false} isOpen={isOpen} toggle={toggle}>
      <Formik
        enableReinitialize={true}
        initialValues={lockedGroupInititalState()}
       
        onSubmit={async values => {
          restrictedGroup(values);
        }}
        //validationSchema={PremiumSchema}
      >
        {props => {
          const {
            handleSubmit,
          } = props;
          return (
            <form onSubmit={handleSubmit} >
             <div className="p-3">
                <div className="mb-3">
                  <InputRadio values={radioParameters} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={toggle}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </form>
          );
        }}
      </Formik>
    </MyModal>  
    </>
  }, [currentRestrictedMode,isOpen]);



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

  useEffect(() => {
    
    async function changeData() {
      let localStateData = [...data];
      let index = localStateData.findIndex(item => item._id === groupId);
      localStateData[index].restriction_mode = restrictedMode ;
      //console.log('localStateData', localStateData);
      setData(localStateData);
      await flushData();
    }
    if (isLockedUnlocked && isLockedUnlocked === true) {
      changeData();
      setGroupId("");
      setRestrictedMode("");
    }
  }, [isLockedUnlocked]);

  const restrictedGroup = async (formData: ILockedGroup) => {
    setRestrictedMode(formData.restriction_mode)
    let payload = {
      _id: groupId,
      restriction_mode: formData.restriction_mode
    }
    await lockedUnlocked({ 'url': "group/lock-posting", payload });
    toggle()
  }

 

  return (
    <>
      <div className="Content">
        <CustomSuspense>
          <Navbar text={"Manage groups"} />
        </CustomSuspense>
        <div className="cardBox">
          <CustomSuspense>
            <SearchUser type={"groups"} onSearch={onSearch} onReset={onReset}  exportButton={true}/>
          </CustomSuspense>
          <CustomSuspense >
           {modal}      
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
                  <CustomSuspense>
                    <TableHeader fields={tableHeader} />
                  </CustomSuspense>
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
                              src={val?.image ? getImageUrl(val?.image, { type: 'groups', width: 60 }) : DEFAULT_GROUP_IMG} // use normal <img> attributes as props
                              width={60} />
                            }
                          </td>
                          <td>{val?.name || '-'}</td>
                          <td><div title={val?.creator_of_group?.first_name + " " + val?.creator_of_group?.last_name}>{truncate(val?.creator_of_group?.first_name + " " + val?.creator_of_group?.last_name) || '-'}</div></td>

                          <td>{val?.category || '-'}</td>
                          <td><div title={val?.address}>{truncate(val?.address) || '-'}</div></td>
                          <td className={"onHover"} onClick={() => enableDisableGroup(val?._id, val?.status)}>
                            <div className={(val?.status === 1 || val?.status === true) ? "manageStatus active" : "manageStatus inactive"}> {(val?.status === 1 || val?.status === true) ? 'Active' : 'Inactive'}</div></td>
                          <td>
                            <div className={val?.is_blocked_by_admin === 1 ? "manageStatus inactive" : "manageStatus active"}>{val?.is_blocked_by_admin === 1 ? 'Yes' : 'No'}</div>
                          </td>
                          <td>{_.upperFirst(val?.restriction_mode||"open") }</td>
                          <td> <i title='Lock for posting' className="bi bi-lock-fill" onClick={() => openLockedPostingModal(val?._id, val?.restriction_mode)}></i></td>
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
export default Groups;