import React, { Suspense, useCallback, useEffect, useState, useMemo } from 'react';
import { useStoreActions, useStoreState } from 'react-app-store';
import { IUsers, IEnableDisable, IPagination } from 'react-app-interfaces';
import InfiniteScroll from 'react-infinite-scroll-component';
import ConfirmAlert from '../components/ConfirmAlert';
import { confirmAlert } from 'react-confirm-alert';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import LOGO from 'react-app-images/logo.png';

const TableHeader = React.lazy(() => import('../components/TableHeader'));
const SearchUser = React.lazy(() => import('../components/SearchUser'));
const Users: React.FC = (): JSX.Element => {
  const tableHeader = useMemo(() => {
    return [
      { key: 'image', value: 'Image' },
      { key: 'first_name', value: 'First name' },
      { key: 'last_name', value: 'Last Name' },
      { key: 'email', value: 'Email' },
      { key: 'username', value: 'Username' },
      { key: 'status', value: 'Status' },
      { key: 'is_premium', value: 'Premium' },
    ]
  }, []);
  const userInititalState = useMemo(() => {
    return {
      q: '', page: 1, limit: 25, status: '', is_premium: ''
    }
  }, []);

  const [formData, setFormData] = useState<IUsers>(userInititalState);
  const [pagination, setPagination] = useState<IPagination>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [data, setData] = useState<Array<any>>([]);

  const isLoading = useStoreState(state => state.common.isLoading);
  const response = useStoreState(state => state.user.response);
  const getUsers = useStoreActions(actions => actions.user.getUsers);
  const enableDisable = useStoreActions(actions => actions.user.enableDisable);


  const getUserData = useCallback(async (payload: IUsers) => {
    await getUsers({ url: "user/get-all-users", payload });
  }, []);
  useEffect(() => {
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
    setFormData(_ => ({ ..._, ...payload, page: 1, limit: 25 }));
  }, []);
  const onReset = useCallback(() => {
    setFormData(userInititalState);
  }, []);


  useEffect(() => {
    if (formData) {
      getUserData(formData);
    }
  }, [formData]);

  const loadMore = useCallback(() => {
    setFormData(_ => ({ ..._, page: parseInt((_.page ?? 1)?.toString()) + 1 }));
  }, []);

  const onYes = useCallback(async (id: string, status: string | number) => {
    const payload: IEnableDisable = {
      _id: id, type: "user", status: status === 1 ? 0 : 1
    }
    await enableDisable({ url: 'common/enable-disable', payload });
  }, []);

  const enableDisableUser = useCallback((id, status) => {
    let text: string;
    if (status === 1) {
      text = 'You want to inactivate user?';
    }
    else {
      text = 'You want to activate user?';
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
    return `https://8f99j1irga.execute-api.us-west-2.amazonaws.com/production/media/` + options?.type + "/" + url + "?width=" + options?.width + "&height=" + (options?.height || "")
  }


  return (
    <>

      <div className="Content">
        <div className="mainTitle">
          <h4 className="flex-grow-1">Manage users</h4>
          <button type="button" className="btn btn-outline-primary btn-lg"><i className="bi bi-plus-lg"></i> Invite user</button>
        </div>
        <div className="cardBox">


          <Suspense fallback={<>Loading...</>}>
            <SearchUser onSearch={onSearch} onReset={onReset} />
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
                <table className="table customTable mb-0">
                  <Suspense fallback={<>Loading...</>}>
                    <TableHeader fields={tableHeader} />
                  </Suspense>
                  <tbody>
                    {data && data.length > 0 ? (
                      data.map((val: any, index: number) => (
                        <tr key={index}>
                          <td>
                            {<LazyLoadImage
                              placeholderSrc={LOGO}
                              effect={val?.image ? "blur" : undefined}
                              alt={'image'}
                              height={60}
                              src={val?.image ? getImageUrl(val?.image, { type: 'users', width: 60 }) : LOGO} // use normal <img> attributes as props
                              width={60} />
                            }
                          </td>
                          <td>{val?.first_name || '-'}</td>
                          <td>{val?.last_name || '-'}</td>
                          <td>{val?.email || '-'}</td>
                          <td>{val?.username || '-'}</td>
                          <td className={"onHover"} onClick={() => enableDisableUser(val?._id, val?.active)}><div className={val?.active === 1 ? "manageStatus active" : "manageStatus inactive"}>{val?.active === 1 ? 'Active' : 'Inactive'}</div></td>
                          <td>
                            <div className={val?.is_premium === 1 ? "manageStatus active" : "manageStatus inactive"}>{val?.is_premium === 1 ? 'Yes' : 'No'}</div>
                          </td>
                        </tr>
                      ))

                    ) : (
                      <tr>
                        <td className="text-center">No record found</td>
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
export default Users;