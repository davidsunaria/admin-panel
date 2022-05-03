import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useStoreActions, useStoreState } from "react-app-store";
import env from "../../../config";
import { IUsers, IEnableDisable, IPagination } from "react-app-interfaces";



const Dashboard: React.FC = (): JSX.Element => {
  const Navbar = React.lazy(() => import("../../components/Navbar"));
  const CustomSuspense = React.lazy(
    () => import("../../components/CustomSuspense")
  );
  const GooglePlaceAutoComplete = React.lazy(
    () => import("../../components/GooglePlaceAutoComplete")
  );

  //State
  const isLoading = useStoreState((state) => state.common.isLoading);
  const membersDetail = useStoreState((state) => state.dashboard.membersDetail);

  //Actions
  const getMembersDetail = useStoreActions(
    (actions) => actions.dashboard.getMembersDetail
  );

  const memberInititalState = useMemo(() => {
    return {
      q: "",
      page: env.REACT_APP_FIRST_PAGE,
      limit: env.REACT_APP_PER_PAGE,
      status: "",
      is_premium: "",
    };
  }, []);

  const [formData, setFormData] = useState<IUsers>(memberInititalState);

  const getMembersData = useCallback(async (payload: IUsers) => {
    console.log(4, payload);
    await getMembersDetail({ url: "user/get-all-users", payload });
  }, []);

  useEffect(() => {
    if (formData) {
      getMembersData(formData);
    }
  }, [formData]);

  console.log("memeberdeatail", membersDetail);
 

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
                  <span>100</span>
                </div>
                <div className="detailOuer">
                  <label>No. of subscriber</label>
                  <span>200</span>
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
