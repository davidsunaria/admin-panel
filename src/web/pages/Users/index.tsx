import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useStoreActions, useStoreState } from "react-app-store";
import {
  IUsers,
  IEnableDisable,
  IPagination,
  IInviteuser,
  IPremiumuser,
} from "react-app-interfaces";
import InfiniteScroll from "react-infinite-scroll-component";
import ConfirmAlert from "../../components/ConfirmAlert";
import { confirmAlert } from "react-confirm-alert";
import CustomSuspense from "../../components/CustomSuspense";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Formik } from "formik";
import { useAuthValidation } from "../../../lib/validations/AuthSchema";
import env from "../../../config";
import DEFAULT_USER_IMG from "react-app-images/default_user.png";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const TableHeader = React.lazy(() => import("../../components/TableHeader"));
const SearchUser = React.lazy(() => import("../../components/SearchUser"));
const MyModal = React.lazy(() => import("../../components/MyModal"));
const Input = React.lazy(() => import("../../components/Input"));
const InputRadio = React.lazy(() => import("../../components/InputRadio"));
const CustomDatePicker = React.lazy(
  () => import("../../components/CustomDatePicker")
);
const Navbar = React.lazy(() => import("../../components/Navbar"));
const Users: React.FC = (): JSX.Element => {
  const { InviteUserSchema, PremiumSchema } = useAuthValidation();
  const tableHeader = useMemo(() => {
    return [
      { key: "image", value: "Image" },
      { key: "first_name", value: "First name" },
      { key: "last_name", value: "Last Name" },
      { key: "email", value: "Email" },
      { key: "username", value: "Username" },
      { key: "is_premium", value: "Premium" },
      { key: "is_blocked_by_admin", value: "Blocked by admin" },
      { key: "status", value: "Status" },
      { key: "action", value: "Action" },
    
    ];
  }, []);
  const userInititalState = useMemo(() => {
    return {
      q: "",
      page: env.REACT_APP_FIRST_PAGE,
      limit: env.REACT_APP_PER_PAGE,
      status: "",
      is_premium: "",
    };
  }, []);
  const inviteInititalState = useCallback((): IInviteuser => {
    return {
      email: "",
    };
  }, []);

  const premiumInititalState = useCallback((): IPremiumuser => {
    return {
      type: "",
      is_premium: "",
      user_id: "",
      expire_at: "",
    };
  }, []);
  const [currentUserId, setCurrentUserId] = useState<String>("");
  const [currentUserStatus, setCurrentUserStatus] = useState<String | number>(
    ""
  );
  const [currentUserDeleteStatus, setCurrentUserDeleteStatus] = useState<
    String | number
  >("");

  const [formData, setFormData] = useState<IUsers>(userInititalState);
  const [pagination, setPagination] = useState<IPagination>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [data, setData] = useState<Array<any>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPremiumModalOpen, setPremiumOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [isPremium, setPremium] = useState<any>("");

  //State
  const isLoading = useStoreState((state) => state.common.isLoading);
  const response = useStoreState((state) => state.user.response);
  const memberShipData = useStoreState((state) => state.user.memberShipData);
  const deleteStatus = useStoreState((state) => state.user.deleteStatus);
  const isInvitationSend = useStoreState(
    (state) => state.user.isInvitationSend
  );
  const isEnabledDisabled = useStoreState(
    (state) => state.user.isEnabledDisabled
  );

  const premiumStatus = useStoreState((state) => state.user.premiumStatus);
  //Actions
  const getUsers = useStoreActions((actions) => actions.user.getUsers);

  const enableDisable = useStoreActions(
    (actions) => actions.user.enableDisable
  );
  const inviteUser = useStoreActions((actions) => actions.user.inviteUser);
  const markAsPremium = useStoreActions(
    (actions) => actions.user.markAsPremium
  );
  const deleteUser = useStoreActions((actions) => actions.user.deleteUser);
  const flushData = useStoreActions((actions) => actions.user.flushData);
  const toggle = () => setIsOpen(!isOpen);

  const openPremiumModal = async (
    id: string,
    is_premium: any,
    expiredDate: any
  ) => {
    togglePremium();
    setUserId(id);
    if (expiredDate === false) {
      setPremium("1");
    }
    if (expiredDate === true) {
      setPremium("0");
    }
    if (typeof expiredDate === "undefined") {
      setPremium(is_premium === 0 ? "1" : "0");
    }

    if (is_premium === 1 && expiredDate === true) {
      let payload = {
        user_id: id,
        is_premium: "0",
        type: "",
        expire_at: "",
      };
      await markAsPremium({ url: "user/mark-premium", payload });
    }
  };
  const togglePremium = () => {
    setPremiumOpen(!isPremiumModalOpen);
  };

  const getUserData = useCallback(async (payload: IUsers) => {
    await getUsers({ url: "user/get-all-users", payload });
  }, []);
  useEffect(() => {
    if (response?.data) {
      const {
        data,
        pagination: [paginationObject],
      } = response;
      setPagination(paginationObject);
      setCurrentPage(paginationObject?.currentPage);

      if (paginationObject?.currentPage === 1 || !paginationObject) {
        setData(data);
      } else {
        setData((_: any) => [..._, ...data]);
      }
    }
  }, [response]);

  const onSearch = useCallback((payload: IUsers) => {
    setFormData((_) => ({
      ..._,
      ...payload,
      page: env.REACT_APP_FIRST_PAGE,
      limit: env.REACT_APP_PER_PAGE,
    }));
  }, []);

  const onReset = useCallback(() => {
    console.log(2);
    setFormData(userInititalState);
    getUserData(formData);
  }, []);

  useEffect(() => {
    if (formData) {
      console.log(3, formData);
      getUserData(formData);
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
      type: "user",
      status: status === 1 ? 0 : 1,
    };
    await enableDisable({ url: "common/enable-disable", payload });
  }, []);

  const deleteMember = useCallback(
    async (id: string, status: string | number) => {
      setCurrentUserId(id);
      setCurrentUserDeleteStatus(status);
      const payload: IUsers = {
        user_id: id,
      };
      await deleteUser({ url: "user/delete-user", payload });
    },
    []
  );
  const manageAction = useCallback((id, status) => {
    let text: string;
    if (status === 1) {
      text = "You want to inactivate user?";
    } else if (status === "delete") {
      text = "You want to delete user?";
    } else {
      text = "You want to activate user?";
    }
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <ConfirmAlert
            onClose={onClose}
            onYes={
              status !== "delete"
                ? () => onYes(id, status)
                : () => deleteMember(id, status)
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
      `${env.REACT_APP_MEDIA_URL}` +
      options?.type +
      "/" +
      url +
      "?width=" +
      options?.width +
      "&height=" +
      (options?.height || "")
    );
  };

  const onInvite = async (payload: IInviteuser) => {
    await inviteUser({ url: "user/invite-user", payload });
    //
  };

  const markPremium = async (formData: IPremiumuser) => {
    let payload = {
      ...formData,
      user_id: userId,
      is_premium: isPremium,
    };
    await markAsPremium({ url: "user/mark-premium", payload });
  };

  useEffect(() => {
    async function changeData() {
      //console.log("change data",isPremium)
      let localStateData = [...data];
      let index = localStateData.findIndex((item) => item._id === userId);
      localStateData[index].is_premium = parseInt(isPremium);
      localStateData[index].membership = memberShipData;
      setData(localStateData);
      await flushData();
    }
    if (premiumStatus && premiumStatus === true) {
      changeData();
      setUserId("");
      setPremium("");
    }
  }, [premiumStatus]);

  useEffect(() => {
    async function changeData() {
      //console.log("change data",isPremium)
      let localStateData = [...data];
      let index = localStateData.findIndex(
        (item) => item._id === currentUserId
      );

      localStateData[index].active =
        currentUserDeleteStatus === "delete" ? 0 : 1;
      localStateData.splice(index, 1);
      setData(localStateData);
      await flushData();
    }
    if (deleteStatus && deleteStatus === true) {
      changeData();
      setUserId("");
      setCurrentUserDeleteStatus("");
    }
  }, [deleteStatus]);
  useEffect(() => {
    async function flush() {
      toggle();
      await flushData();
    }
    if (isInvitationSend && isInvitationSend === true) {
      flush();
    }
  }, [isInvitationSend]);

  useEffect(() => {
    async function changeData() {
      let localStateData = [...data];
      let index = localStateData.findIndex(
        (item) => item._id === currentUserId
      );
      localStateData[index].active = currentUserStatus === 1 ? 0 : 1;
      setData(localStateData);
      await flushData();
    }
    if (isEnabledDisabled && isEnabledDisabled === true) {
      changeData();
      setCurrentUserId("");
      setCurrentUserStatus("");
    }
  }, [isEnabledDisabled]);

  const radioParameters: any = [
    { value: "monthly", label: "Monthly", name: "type" },
    { value: "yearly", label: "Yearly", name: "type" },
  ];

  const compareDate = useCallback((date?: string) => {
    if (date) {
      const today = moment(moment(new Date()).format("YYYY-MM-DD")).unix();
      const expireAt = moment(moment(date).format("YYYY-MM-DD")).unix();

      if (today > expireAt && date) {
        return false;
      } else {
        return true;
      }
    }
    // return true;
  }, []);

  return (
    <>
      <div className="Content">
        <CustomSuspense>
          <Navbar toggle={toggle} text={"Manage users"} />
        </CustomSuspense>
        <div className="cardBox">
          <CustomSuspense>
            <MyModal
              heading={"Invite user"}
              showSubmitBtn={false}
              isOpen={isOpen}
              toggle={toggle}
            >
              <Formik
                enableReinitialize={true}
                initialValues={inviteInititalState()}
                onSubmit={async (values) => {
                  //setFormData(JSON.stringify(values, null, 2))
                  onInvite(values);
                }}
                validationSchema={InviteUserSchema}
              >
                {(props) => {
                  const { values, handleChange, handleBlur, handleSubmit } =
                    props;
                  return (
                    <form onSubmit={handleSubmit} className="p-3">
                      <Input
                        label={"Email"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={"form-control"}
                        type={"text"}
                        autoComplete={"off"}
                        value={values?.email}
                        name={"email"}
                        id={"name"}
                        placeholder={"email"}
                      />
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={toggle}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Submit
                        </button>
                      </div>
                    </form>
                  );
                }}
              </Formik>
            </MyModal>
            <SearchUser
              type={"users"}
              onSearch={onSearch}
              onReset={onReset}
              exportButton={true}
            />
          </CustomSuspense>

          <CustomSuspense>
            {isPremium === "1" && (
              <MyModal
                heading={isPremium === "1" ? "Mark Premium" : "Unmark Premium"}
                showSubmitBtn={false}
                isOpen={isPremiumModalOpen}
                toggle={() => togglePremium()}
              >
                <Formik
                  enableReinitialize={true}
                  initialValues={premiumInititalState()}
                  onSubmit={async (values) => {
                    markPremium(values);
                  }}
                  validationSchema={PremiumSchema}
                >
                  {(props) => {
                    const { values, handleSubmit } = props;
                    return (
                      <form onSubmit={handleSubmit}>
                        <div className="p-3">
                          <div className="mb-3">
                            <InputRadio
                              values={radioParameters}
                              heading="Frequency"
                            />
                          </div>
                          <CustomDatePicker
                            value={values?.expire_at}
                            label="Expiry at"
                            name="expire_at"
                            props={props}
                          />
                        </div>

                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => togglePremium()}
                          >
                            Cancel
                          </button>
                          <button type="submit" className="btn btn-primary">
                            Submit
                          </button>
                        </div>
                      </form>
                    );
                  }}
                </Formik>
              </MyModal>
            )}
          </CustomSuspense>
          <div className="table-responsive">
            {
              <InfiniteScroll
                dataLength={currentPage}
                next={loadMore}
                hasMore={pagination?.nextPage == null ? false : true}
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
                    {data && data.length > 0 ? (
                      data.map((val: any, index: number) => (
                        <tr key={index}>
                          {/* {console.log(val)}   */}
                          <td>
                            {
                              <LazyLoadImage
                                wrapperClassName={"overideImageCircle"}
                                placeholderSrc={DEFAULT_USER_IMG}
                                effect={val?.image ? "blur" : undefined}
                                alt={"image"}
                                height={60}
                                src={
                                  val?.image
                                    ? getImageUrl(val?.image, {
                                        type: "users",
                                        width: 60,
                                      })
                                    : DEFAULT_USER_IMG
                                } // use normal <img> attributes as props
                                width={60}
                              />
                            }
                          </td>
                          <td>{val?.first_name || "-"}</td>
                          <td>{val?.last_name || "-"}</td>
                          <td>{val?.email || "-"}</td>
                          <td>{val?.username || "-"}</td>
                         
                          <td>
                            <div
                              className={
                                val?.is_premium === 1 &&
                                compareDate(val?.membership?.expire_at)
                                  ? "manageStatus manageExpire active"
                                  : "manageStatus  manageExpire inactive"
                              }
                            >
                              {val?.is_premium === 1 &&
                                val?.membership &&
                                compareDate(val?.membership?.expire_at) &&
                                "Yes"}
                              {val?.is_premium === 0 &&
                                typeof val?.membership === "undefined" &&
                                "No"}
                              {val?.is_premium === 1 &&
                                typeof val?.membership !== "undefined" &&
                                !compareDate(val?.membership?.expire_at) &&
                                "No(expired)"}
                            </div>
                          </td>
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

                          <td className={"onHover"}>
                            <div
                              onClick={() =>
                                manageAction(val?._id, val?.active)
                              }
                              className={
                                val?.active === 1 || val?.active === true
                                  ? "manageStatus active me-1"
                                  : "manageStatus inactive me-1"
                              }
                            >
                              {" "}
                              {val?.active === 1 || val?.active === true
                                ? "Active"
                                : "Inactive"}
                            </div>
                          </td>

                          <td className={"tdAction"}>
                            {/* {JSON.stringify(compareDate(val?.membership?.expire_at))} */}
                            {/* <div
                              className={
                                val?.is_premium === 1 &&
                                compareDate(val?.membership?.expire_at)
                                  ? "manageStatus managePremium  active"
                                  : "manageStatus managePremium  inactive"
                              }
                              onClick={() =>
                                openPremiumModal(
                                  val?._id,
                                  val?.is_premium,
                                  compareDate(val?.membership?.expire_at)
                                )
                              }
                            >
                              {val?.is_premium === 1 &&
                              compareDate(val?.membership?.expire_at)
                                ? "Unmark Premium"
                                : "Mark Premium"}
                            </div> */}
                             <div className="d-flex">
                            <i
                              title={
                                val?.is_premium === 1 &&
                                compareDate(val?.membership?.expire_at)
                                  ? "Unmark Premium"
                                  : "Mark Premium"
                              }
                              className={`bi bi-star-fill ${
                                val?.is_premium === 1 &&
                                compareDate(val?.membership?.expire_at)
                                  ? "success"
                                  : "danger"
                              }`}
                              onClick={() =>
                                openPremiumModal(
                                  val?._id,
                                  val?.is_premium,
                                  compareDate(val?.membership?.expire_at)
                                )
                              }
                            />

                            <i
                              title="Delete User"
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
                      <tr>
                        <td colSpan={9} className="text-center">
                          No record found
                        </td>
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
  );
};
export default Users;
