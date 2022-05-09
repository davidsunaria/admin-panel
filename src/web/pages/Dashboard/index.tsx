import React, { useCallback, useEffect, useState, useMemo ,useRef} from "react";
import { useStoreActions, useStoreState } from "react-app-store";
import { IPagination, IUsers } from "react-app-interfaces";
import InfiniteScroll from "react-infinite-scroll-component";
import env from "../../../config";

const Navbar = React.lazy(() => import("../../components/Navbar"));
const CustomSuspense = React.lazy(
  () => import("../../components/CustomSuspense")
);
const GooglePlaceAutoComplete = React.lazy(
  () => import("../../components/GooglePlaceAutoComplete")
);
const TableHeader = React.lazy(() => import("../../components/TableHeader"));

const Dashboard: React.FC = (): JSX.Element => {
  const groupInititalState = useMemo(() => {
    return {
      page: env.REACT_APP_FIRST_PAGE,
      limit: env.REACT_APP_PER_PAGE,
    };
  }, []);

  const tableHeader = useMemo(() => {
    return [
      { key: "Groupname", value: "Group name" },
      { key: "eventcount", value: "No. of event" },
    ];
  }, []);

  const [subscriberCount, setSubscriberCount] = useState<string | number>(0);
  const [memberCount, setMemberCount] = useState<string | number>(0);
  const [groupData, setGroupData] = useState<any[]>([]);
  const [groupPayload, setGroupPayload] = useState<IUsers>(groupInititalState);
  const [pagination, setPagination] = useState<IPagination>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  //State
  const subscribersCount = useStoreState(
    (state) => state.dashboard.subscribersCount
  );
  const membersCount = useStoreState((state) => state.dashboard.membersCount);
  const groupDetail = useStoreState((state) => state.dashboard.groupDetail);
  const isLoading = useStoreState((state) => state.common.isLoading);

  //Actions
  const getSubscribersCount = useStoreActions(
    (actions) => actions.dashboard.getSubscribersCount
  );

  const getMembersCount = useStoreActions(
    (actions) => actions.dashboard.getMembersCount
  );
  const getGroupDetail = useStoreActions(
    (actions) => actions.dashboard.getGroupDetail
  );

  const getData = useCallback(async () => {
    await getSubscribersCount({ url: "dashboard/get-subscribers-count" });
    await getMembersCount({ url: "dashboard/get-members-count" });
  }, []);

  const getGroupData = useCallback(async (payload) => {
    await getGroupDetail({
      url: "dashboard/get-no-of-events-per-group",
      payload,
    });
  }, []);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getGroupData(groupInititalState);
  }, []);

  useEffect(() => {
    setSubscriberCount(subscribersCount);
  }, [subscribersCount]);

  useEffect(() => {
    setMemberCount(membersCount);
  }, [membersCount]);

  useEffect(() => {
    if (groupDetail?.data) {
      const {
        data,
        pagination: [paginationObject],
      } = groupDetail;
      setPagination(paginationObject);
      setCurrentPage(paginationObject?.currentPage);

      if (paginationObject?.currentPage === 1 || !paginationObject) {
        setGroupData(data);
      } else {
        setGroupData((_: any) => [..._, ...data]);
      }
    }
  }, [groupDetail]);

  useEffect(() => {
    if (groupPayload) {
      getGroupData(groupPayload);
    }
  }, [groupPayload]);



  const listInnerRef = useRef(null);
  const onScroll = () => {
    if (listInnerRef.current) {
      
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        setGroupPayload((_) => ({
          ..._,
          page: parseInt((_.page ?? 1)?.toString()) + 1,
        }));
      }
    }
  };

  return (
    <>
      <div className="Content">
        <CustomSuspense>
          <Navbar text={"Dashboard"} />
        </CustomSuspense>

        <div className="row">
          <div className="col-lg-6">
            <div className="cardBox dashboardBoxes">
              <div className="dashAppointFilterOuter">
                <div className="dashboardSubTitle">No. of members, subscribers</div>
                {/* <div className="filter">
                  <select
                    className="form-select me-2"
                    aria-label="Default select example"
                  >
                    <option>All Employers</option>
                  </select>
                </div> */}
              </div>
              <div className="customScroll">
                <div className="detailOuer">
                  <label>Members</label>
                  <span>{memberCount || 0}</span>
                </div>
                <div className="detailOuer">
                  <label>Subscribers</label>
                  <span>{subscriberCount || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="cardBox dashboardBoxes">
              <div className="dashAppointFilterOuter">
                <div className="dashboardSubTitle">No. of events per group</div>

                {/* <GooglePlaceAutoComplete /> */}
              </div>
              <div
                className="table-responsive customScroll"
                onScroll={onScroll}
                ref={listInnerRef}
              >
              
                <table className="table customTable">
                  <CustomSuspense>
                    <TableHeader fields={tableHeader} />
                  </CustomSuspense>
                  <tbody>
                    {groupData && groupData.length > 0 ? (
                      groupData.map((val: any, index: number) => {
                        return (
                          <tr key={index}>
                            <td>{val?.name}</td>
                            <td>{val?.events} </td>
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
          <div className="col-lg-6">
            <div className="cardBox dashboardBoxes">
              <div className="dashAppointFilterOuter">
                <div className="dashboardSubTitle">Upcoming Appointments</div>
                <div className="filter">
                  <select
                    className="form-select me-2"
                    aria-label="Default select example"
                  >
                    <option>All Employers</option>
                  </select>
                </div>
              </div>
              <div className="table-responsive customScroll">
                <table className="table customTable">
                  <thead>
                    <tr>
                      <th scope="col">Groups</th>
                      <th scope="col">Members</th>
                      <th scope="col">Likes</th>
                      <th scope="col">Events</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>test complaint</td>
                      <td>10 </td>
                      <td>150</td>
                      <td>5 </td>
                    </tr>
                    <tr>
                      <td>test complaint</td>
                      <td>10 </td>
                      <td>150</td>
                      <td>5 </td>
                    </tr>
                    <tr>
                      <td>test complaint</td>
                      <td>10 </td>
                      <td>150</td>
                      <td>5 </td>
                    </tr>
                    <tr>
                      <td>test complaint</td>
                      <td>10 </td>
                      <td>150</td>
                      <td>5 </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="cardBox dashboardBoxes">
              <div className="dashAppointFilterOuter">
                <div className="dashboardSubTitle">Upcoming Appointments</div>
                <div className="filter">
                  <div className="search-box mb-3 mb-md-0 me-2">
                    {" "}
                    <i className="bi bi-search"></i>
                    <input type="text" placeholder="Search" />
                  </div>
                </div>
              </div>
              <div className="table-responsive customScroll">
                <table className="table customTable">
                  <thead>
                    <tr>
                      <th scope="col">Patient11</th>
                      <th scope="col">Appointment time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>test complaint</td>
                      <td>12:00 pm </td>
                    </tr>
                    <tr>
                      <td>test complaint</td>
                      <td>12:00 pm </td>
                    </tr>
                    <tr>
                      <td>test complaint</td>
                      <td>12:00 pm </td>
                    </tr>
                    <tr>
                      <td>test complaint</td>
                      <td>12:00 pm </td>
                    </tr>
                    <tr>
                      <td>test complaint</td>
                      <td>12:00 pm </td>
                    </tr>
                    <tr>
                      <td>test complaint</td>
                      <td>12:00 pm </td>
                    </tr>
                    <tr>
                      <td>test complaint</td>
                      <td>12:00 pm </td>
                    </tr>
                    <tr>
                      <td>test complaint</td>
                      <td>12:00 pm </td>
                    </tr>
                    <tr>
                      <td>test complaint</td>
                      <td>12:00 pm </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
