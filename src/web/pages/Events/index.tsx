import React, { useCallback, useEffect, useState, useMemo } from "react";
import CustomSuspense from "../../components/CustomSuspense";
import { useStoreActions, useStoreState } from "react-app-store";
import { IUsers, IEnableDisable, IPagination } from "react-app-interfaces";
import InfiniteScroll from "react-infinite-scroll-component";
import ConfirmAlert from "../../components/ConfirmAlert";
import { confirmAlert } from "react-confirm-alert";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import DEFAULT_EVENT_IMG from "react-app-images/default_event.png";
import env from "../../../config";
import { truncate,toUpperCase } from "../../../lib/utils/Service";
import _  from 'lodash';

const TableHeader = React.lazy(() => import("../../components/TableHeader"));
const NoRecord = React.lazy(() => import("../../components/NoRecord"));
const SearchUser = React.lazy(() => import("../../components/SearchUser"));
const Navbar = React.lazy(() => import("../../components/Navbar"));

const Events: React.FC = (): JSX.Element => {
  const tableHeader = useMemo(() => {
    return [
      { key: "image", value: "Image" },
      { key: "name", value: "Name" },
      { key: "creator", value: "Owner" },
      { key: "group", value: "Associated group" },
      { key: "address", value: "Address" },
      { key: "capacity", value: "Capacity" },
      { key: "capacity_type", value: "Capacity Type" },
      { key: "is_blocked_by_admin", value: "Blocked by admin" },
      { key: "action", value: "Action" },
    ];
  }, []);
  const userInititalState = useMemo(() => {
    return {
      q: "",
      page: env?.REACT_APP_FIRST_PAGE,
      limit: env?.REACT_APP_PER_PAGE,
      status: "",
    };
  }, []);

  const [formData, setFormData] = useState<IUsers>(userInititalState);
  const [pagination, setPagination] = useState<IPagination>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [data, setData] = useState<Array<any>>([]);
  const [currentEventId, setCurrentEventId] = useState<String>("");
  const [currentEventStatus, setCurrentEventStatus] = useState<String>("");
  const [currentUserId, setCurrentUserId] = useState<String>("");
  const [currentUserStatus, setCurrentUserStatus] = useState<String | number>(
    ""
  );
  //State
  const isLoading = useStoreState((state) => state.common.isLoading);
  const response = useStoreState((state) => state.event.response);
  const paginationObject= useStoreState((state) => state.event.paginationObject);
  const isEnabledDisabled = useStoreState(
    (state) => state.group.isEnabledDisabled
  );
  const deleteStatus = useStoreState((state) => state.event.deleteStatus);
  //Actions
  const flushData = useStoreActions((actions) => actions.group.flushData);
  const getEvents = useStoreActions((actions) => actions.event.getEvents);
  const deleteEvent = useStoreActions((actions) => actions.event.deleteEvent);
  const enableDisable = useStoreActions(
    (actions) => actions.event.enableDisable
  );

  const getGroupData = useCallback(async (payload: IUsers) => {
    await getEvents({ url: "event/get-all-events", payload });
  }, []);

  // useEffect(() => {
  //   //console.log('Response', response);
  //   if (response?.data) {
  //     const {
  //       data,
  //       pagination: [paginationObject],
  //     } = response;
  //     setPagination(paginationObject);
  //     setCurrentPage(paginationObject?.currentPage);

  //     if (paginationObject?.currentPage === 1 || !paginationObject) {
  //       setData(data);
  //     } else {
  //       setData((_: any) => [..._, ...data]);
  //     }
  //   }
  // }, [response]);

  const onSearch = useCallback((payload: IUsers) => {
    setFormData((_) => ({
      ..._,
      ...payload,
      page: env?.REACT_APP_FIRST_PAGE,
      limit: env?.REACT_APP_PER_PAGE,
    }));
  }, []);

  const onReset = useCallback(() => {
    setFormData(userInititalState);
    getGroupData(formData);
  }, []);

  useEffect(() => {
    if (formData) {
      getGroupData(formData);
    }
  }, [formData]);

  const loadMore = useCallback(() => {
    setFormData((_) => ({
      ..._,
      page: parseInt((_.page ?? 1)?.toString()) + 1,
    }));
  }, []);

  const onYes = useCallback(async (id: string, status: string | number) => {
    setCurrentUserId(id);
    setCurrentUserStatus(status);
    const payload: IEnableDisable = {
      _id: id,
      type: "event",
      status: status === 1 ? 0 : 1,
    };
    await enableDisable({ url: "common/enable-disable", payload });
  }, []);

  const eventDelete = useCallback(
    async (id: string, status: any) => {
      console.log("event status",status)
      setCurrentEventId(id);
       setCurrentEventStatus(status);
      const payload: IEnableDisable = {
        _id: id,
      };
      await deleteEvent({ url: 'event/delete-event', payload });
    },
    []
  );

  const manageAction = useCallback((id, status) => {
    let text: string;
    if (status === 1) {
      text = "You want to inactivate event?";
    } else if (status === "delete") {
      text = "You want to delete event?";
    } else {
      text = "You want to activate event?";
    }
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <ConfirmAlert
            onClose={onClose}
            onYes={
              status !== "delete"
                ? () => onYes(id, status)
                : () => eventDelete(id, status)
            }
            heading="Are you sure?"
            subHeading={text}
            onCloseText="No"
            onSubmitText="Yes"
          />
        );
      },
    });
  }, []);

  const getImageUrl = (url: string, options: any) => {
    return (
      `${env?.REACT_APP_MEDIA_URL}` +
      options?.type +
      "/" +
      url +
      "?width=" +
      options?.width +
      "&height=" +
      (options?.height || "")
    );
  };

  // useEffect(() => {
  //   async function changeData() {
  //     let localStateData = [...data];
  //     let index = localStateData.findIndex(
  //       (item) => item._id === currentUserId
  //     );
  //     localStateData[index].status = currentUserStatus === 1 ? 0 : 1;
  //     //console.log('localStateData', localStateData);
  //     setData(localStateData);
  //     await flushData();
  //   }
  //   if (isEnabledDisabled && isEnabledDisabled === true) {
  //     changeData();
  //     setCurrentUserId("");
  //     setCurrentUserStatus("");
  //   }
  // }, [isEnabledDisabled]);

  // useEffect(() => {
  //   async function changeData() {
  //     //console.log("change data",isPremium)
  //     let localStateData = [...data];
  //     let index = localStateData.findIndex(
  //       (item) => item._id === currentEventId
  //     );
  //     localStateData[index].status =
  //     currentEventStatus === "delete" ? 0 : 1;
  //     localStateData.splice(index, 1);
  //     setData(localStateData);
  //     await flushData();
  //   }
  //   if (deleteStatus && deleteStatus === true) {
  //     changeData();
  //     setCurrentEventId("");
  //     setCurrentEventStatus("");
  //   }
  // }, [deleteStatus]);
  return (
    <>
      <div className="Content">
        <CustomSuspense>
          <Navbar text={"Manage events"} />
        </CustomSuspense>
        <div className="cardBox">
          <CustomSuspense>
            <SearchUser
              type={"events"}
              onSearch={onSearch}
              onReset={onReset}
              exportButton={true}
            />
          </CustomSuspense>
          <div className="table-responsive">
            {
              <InfiniteScroll
                dataLength={paginationObject?.currentPage}
                next={loadMore}
                hasMore={paginationObject?.nextPage == null ? false : true}
                loader={
                  isLoading && <h4 className="listingLoader">Loading...</h4>
                }
                scrollThreshold={0.8}
              >
                <table className="table customTable mb-0">
                  <CustomSuspense>
                    <TableHeader fields={tableHeader} />
                  </CustomSuspense>
                  <tbody>
                    {response && response.length > 0 ? (
                      response.map((val: any, index: number) => (
                        <tr key={index}>
                          <td>
                            {
                              <LazyLoadImage
                                wrapperClassName={"overideImageCircle"}
                                placeholderSrc={DEFAULT_EVENT_IMG}
                                effect={val?.image ? "blur" : undefined}
                                alt={"image"}
                                height={60}
                                src={
                                  val?.image
                                    ? getImageUrl(val?.image, {
                                        type: "events",
                                        width: 60,
                                      })
                                    : DEFAULT_EVENT_IMG
                                } // use normal <img> attributes as props
                                width={60}
                              />
                            }
                          </td>
                          <td>{toUpperCase(val?.name)}</td>
                          <td>
                            <div
                              title={
                                ` ${val?.creator_of_event?.first_name } ${val?.creator_of_event?.last_name}`
                              }
                            >
                              {truncate(
                                toUpperCase(` ${val?.creator_of_event?.first_name } ${val?.creator_of_event?.last_name}`))}
                            </div>
                          </td>
                          <td>
                            <div title={val?.event_group?.name}>
                              {truncate(toUpperCase(val?.event_group?.name))}
                            </div>
                          </td>
                          <td>
                            <div title={val?.address}>
                              {truncate(toUpperCase(val?.address))}
                            </div>
                          </td>
                          <td>{val?.capacity || "-"}</td>
                          <td>{toUpperCase(val?.capacity_type) }</td>
                          <td>
                            <div
                              className={
                                val?.is_blocked_by_admin === 1
                                  ? "manageStatus inactive"
                                  : "manageStatus active"
                              }
                            >
                              {val?.is_blocked_by_admin === 1 ? "Yes" : "No"}
                            </div>
                          </td>
                          <td className={"tdAction"}>
                            {/* <div
                              className={
                                val?.status === 1 || val?.status === true
                                  ? "manageStatus active"
                                  : "manageStatus inactive"
                              }
                            >
                              {" "}
                              {val?.status === 1 || val?.status === true
                                ? "Active"
                                : "Inactive"}
                            </div> */}

                            <div className="d-flex">
                              <i
                                title={
                                  val?.status === 1 || val?.status === true
                                    ? "Inactivate event"
                                    : "Activate event"
                                }
                                className={`bi  ${
                                  val?.status === 1 || val?.status === true
                                    ? "text-success bi-check-circle"
                                    : "text-danger bi-x-circle"
                                }`}
                                onClick={() =>
                                  manageAction(val?._id, val?.status)
                                }
                              ></i>
                              <i
                                title="Delete event"
                                className="bi  bi-trash"
                                onClick={() =>
                                  manageAction(val?._id, "delete")
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <NoRecord colspan={10}/>
                    )}
                  </tbody>
                </table>
              </InfiniteScroll>
            }
          </div>
        </div>
      </div>
    </>
  );
};
export default Events;
