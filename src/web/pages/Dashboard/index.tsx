import React, { useCallback, useEffect, useState} from "react";
import { useStoreActions, useStoreState } from "react-app-store";

const Navbar = React.lazy(() => import("../../components/Navbar"));
const CustomSuspense = React.lazy(
  () => import("../../components/CustomSuspense")
);
const GooglePlaceAutoComplete = React.lazy(
  () => import("../../components/GooglePlaceAutoComplete")
);



const Dashboard: React.FC = (): JSX.Element => {

  const [subscriberCount, setSubscriberCount] = useState<string | number >(0);
  const [memberCount, setMemberCount] = useState<string | number>(0);
 

  //State
  const subscribersCount = useStoreState((state) => state.dashboard.subscribersCount);
  const membersCount = useStoreState((state) => state.dashboard.membersCount);

  //Actions
  const getSubscribersCount = useStoreActions(
    (actions) => actions.dashboard.getSubscribersCount
  );

  const getMembersCount = useStoreActions(
    (actions) => actions.dashboard.getMembersCount
  );

 

 

  const getData = useCallback(async () => {
    await getSubscribersCount({ url: "dashboard/get-subscribers-count" });
    await getMembersCount({ url: "dashboard/get-members-count" });
  }, []);

  useEffect(() => {
    getData()
  }, []);

  useEffect(() => {
    setSubscriberCount(subscribersCount)
}, [subscribersCount]);

useEffect(() => {
  setMemberCount(membersCount)
}, [membersCount]);


 

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
                <div className="dashboardSubTitle">Members Detail</div>
                <div className="filter">
                  <select
                    className="form-select me-2"
                    aria-label="Default select example"
                  >
                    <option>All Employers</option>
                  </select>
                </div>
              </div>
              <div className="customScroll">
                <div className="detailOuer">
                  <label>No. of members</label>
                  <span>{memberCount || 0}</span>
                </div>
                <div className="detailOuer">
                  <label>No. of subscriber</label>
                  <span>{subscriberCount || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="cardBox dashboardBoxes">
              <div className="dashAppointFilterOuter">
                <div className="dashboardSubTitle">Groups Detail</div>

                <GooglePlaceAutoComplete/>
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
                      <td>No. of groups</td>
                      <td>100 </td>
                    </tr>
                    <tr>
                      <td>No. of events</td>
                      <td>250 </td>
                    </tr>
                    <tr>
                      <td>No. of active</td>
                      <td>170</td>
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
