import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import { useStoreActions, useStoreState } from "react-app-store";
import { IPagination, IUsers } from "react-app-interfaces";
import env from "../../../config";

const Navbar = React.lazy(() => import("../../components/Navbar"));
const CustomSuspense = React.lazy(
  () => import("../../components/CustomSuspense")
);
const GooglePlaceAutoComplete = React.lazy(
  () => import("../../components/GooglePlaceAutoComplete")
);
const TableHeader = React.lazy(() => import("../../components/TableHeader"));
const ResourceMembers = React.lazy(() => import("../ResourceMembers"));

const Dashboard: React.FC = (): JSX.Element => {
  const groupInititalState = useMemo(() => {
    return {
      page: env.REACT_APP_FIRST_PAGE,
      limit: env.REACT_APP_PER_PAGE,
    };
  }, []);

  const tableHeader = useMemo(() => {
    return [
      { key: "group_name", value: "Group name" },
      { key: "event_count", value: "No. of event" },
    ];
  }, []);
  

  const [subscriberCount, setSubscriberCount] = useState<string | number>(0);
  const [memberCount, setMemberCount] = useState<string | number>(0);
  const [EventsPerGroup, setEventsPerGroup] = useState<any[]>([]);
  const [groupPayload, setGroupPayload] = useState<IUsers>(groupInititalState);
  const [pagination, setPagination] = useState<IPagination>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  //State
  const subscribersCount = useStoreState(
    (state) => state.dashboard.subscribersCount
  );
  const membersCount = useStoreState((state) => state.dashboard.membersCount);
  const numberOfEventPerGroup = useStoreState(
    (state) => state.dashboard.numberOfEventPerGroup
  );
  const isLoading = useStoreState((state) => state.common.isLoading);

  //Actions
  const getSubscribersCount = useStoreActions(
    (actions) => actions.dashboard.getSubscribersCount
  );

  const getMembersCount = useStoreActions(
    (actions) => actions.dashboard.getMembersCount
  );
  const getEventCountPerGroup = useStoreActions(
    (actions) => actions.dashboard.getEventCountPerGroup
  );

  const getData = useCallback(async () => {
    await getSubscribersCount({ url: "dashboard/get-subscribers-count" });
    await getMembersCount({ url: "dashboard/get-members-count" });
  }, []);

  const getNumberOfEventsPerGroup = useCallback(async (payload) => {
    await getEventCountPerGroup({
      url: "dashboard/get-no-of-events-per-group",
      payload,
    });
  }, []);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getNumberOfEventsPerGroup(groupInititalState);
  }, []);

  useEffect(() => {
    setSubscriberCount(subscribersCount);
  }, [subscribersCount]);

  useEffect(() => {
    setMemberCount(membersCount);
  }, [membersCount]);

  useEffect(() => {
    if (numberOfEventPerGroup?.data) {
      const {
        data,
        pagination: [paginationObject],
      } = numberOfEventPerGroup;
      setPagination(paginationObject);
      setCurrentPage(paginationObject?.currentPage);

      if (paginationObject?.currentPage === 1 || !paginationObject) {
        setEventsPerGroup(data);
      } else {
        setEventsPerGroup((_: any) => [..._, ...data]);
      }
    }
  }, [numberOfEventPerGroup]);

  useEffect(() => {
    if (groupPayload) {
      getNumberOfEventsPerGroup(groupPayload);
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
                <div className="dashboardSubTitle">
                  No. of members, subscribers
                </div>
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
              <div className="table-responsive">
                <table className="table customTable stickyHeader">
                  <CustomSuspense>
                    <TableHeader fields={tableHeader} />
                  </CustomSuspense>
                  <tbody onScroll={onScroll} ref={listInnerRef}>
                    {EventsPerGroup && EventsPerGroup.length > 0 ? (
                      EventsPerGroup.map((val: any, index: number) => {
                        return (
                          <tr key={index}>
                            <td className="w-50">{val?.name || 0}</td>
                            <td className="w-50">{val?.events || 0} </td>
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
            <ResourceMembers/>
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
              <div className="table-responsive">
                <table className="table customTable stickyHeader">
                  <thead>
                    <tr>
                      <th className="w-50" scope="col">
                        Patient11
                      </th>
                      <th className="w-50" scope="col">
                        Appointment time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="w-50">test complaint</td>
                      <td className="w-50">12:00 pm </td>
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
