import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useStoreActions, useStoreState } from "react-app-store";
import {
  IUsers,
  IEnableDisable,
  IInviteuser,
  IPremiumuser,
  IImageOptions
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
import { toUpperCase } from "../../../lib/utils/Service";
import { toast } from "react-toastify";

const TableHeader = React.lazy(() => import("../../components/TableHeader"));
const NoRecord = React.lazy(() => import("../../components/NoRecord"));
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
      { key: "created_at", value: "Joined Date" },
      { key: "last_seen", value: "Last Logged In" },
      { key: "language", value: "Language" },
      { key: "is_premium", value: "Premium" },
      { key: "is_blocked_by_admin", value: "Blocked by admin" },
      { key: "status", value: "Status" },
      { key: "action", value: "Action" },
    ];
  }, []);

  const radioParameters: any = [
    { value: "monthly", label: "Monthly", name: "type" },
    { value: "yearly", label: "Yearly", name: "type" },
  ];
  const userInititalState = useMemo(() => {
    return {
      q: "",
      page: env?.REACT_APP_FIRST_PAGE,
      limit: env?.REACT_APP_PER_PAGE,
      status: "",
      is_premium: "",
    };
  }, []);
  const inviteInititalState = useMemo((): IInviteuser => {
    return {
      email: "",
    };
  }, []);

  const premiumInititalState = useMemo((): IPremiumuser => {
    return {
      type: "",
      is_premium: "",
      user_id: "",
      expire_at_unix: "",
    };
  }, []);
  
 
  const [formData, setFormData] = useState<IUsers>(userInititalState);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPremiumModalOpen, setPremiumOpen] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<string | undefined>("");
  const [expireAtUnix, setExpireAtUnix] = useState<number>(0);

  //State
  const isLoading = useStoreState((state) => state.common.isLoading);
  const response = useStoreState((state) => state.user.response);
  const userId = useStoreState((state) => state.user.userId);
  const paginationObject = useStoreState(
    (state) => state.user.paginationObject
  );
  const isPremium = useStoreState((state) => state.user.isPremium);
  //Actions
  const getUsers = useStoreActions((actions) => actions.user.getUsers);
  const setPremium = useStoreActions((actions) => actions.user.setPremium);
  const setUserId = useStoreActions((actions) => actions.user.setUserId);

  const enableDisable = useStoreActions(
    (actions) => actions.user.enableDisable
  );
  const inviteUser = useStoreActions((actions) => actions.user.inviteUser);
  const markAsPremium = useStoreActions(
    (actions) => actions.user.markAsPremium
  );
  const deleteUser = useStoreActions((actions) => actions.user.deleteUser);
  const toggle = () => setIsOpen(!isOpen);

  const openPremiumModal = async (
    id: string,
    is_premium: any,
    expiredDate: boolean | undefined,
    device: string
  ) => {
    setUserId(id);
    if (is_premium === 1 && expiredDate === true && device === "web") {
      let payload = {
        user_id: id,
        is_premium: "0",
        type: "",
        expire_at_unix: "",
      };
      setPremium("0");
      await markAsPremium({ url: "user/mark-premium", payload });
    } else if (
      is_premium === 1 &&
      expiredDate === true &&
      (device === "ios" || device === "android")
    ) {
      toast.error("This membership is purchased from mobile device. you cannot unmark from here");
    } else if (is_premium === 1 && (device === "ios" || device === "android")) {
      toast.error("You cannot mark premium");
    } else {
      togglePremium();
      if (expiredDate === false) {
        setPremium("1");
      }
      // if (expiredDate === true) {
      //   setPremium("0");
      // }
      if (typeof expiredDate === "undefined") {
        setPremium(is_premium === 0 ? "1" : "0");
      }
    }
  };
  const togglePremium = () => {
    setPremiumOpen(!isPremiumModalOpen);
  };

  const getUserData = useCallback(async (payload: IUsers) => {
    await getUsers({ url: "user/get-all-users", payload });
  }, []);


  const onSearch = useCallback((payload: IUsers) => {
    setFormData((_:IUsers) => ({
      ..._,
      ...payload,
      page: env?.REACT_APP_FIRST_PAGE,
      limit: env?.REACT_APP_PER_PAGE,
    }));
  }, []);

  const onReset = useCallback(() => {
    setFormData(userInititalState);
    getUserData(formData);
  }, []);

  useEffect(() => {
    if (formData) {
      getUserData(formData);
    }
  }, [formData]);

  const loadMore = useCallback(() => {
    setFormData((_:IUsers) => ({
      ..._,
      page: parseInt((_.page ?? 1)?.toString()) + 1,
    }));
  }, []);

  const onYes = useCallback(async (id: string, status: string | number) => {
    const payload: IEnableDisable = {
      _id: id,
      type: "user",
      status: status === 1 ? 0 : 1,
    };
    await enableDisable({ url: "common/enable-disable", payload });
  }, []);

  const deleteMember = useCallback(
    async (id: string, status: string | number) => {
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

  const getImageUrl = (url: string, options: IImageOptions) => {
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

  const onInvite = async (payload: IInviteuser) => {
    await inviteUser({ url: "user/invite-user", payload });
    toggle();
  };

  const markPremium = async (formData: IPremiumuser) => {
    const payload = {
      ...formData,
      user_id: userId,
      is_premium: isPremium,
      expire_at_unix: (expireAtUnix * 1000).toString(),
    };
    await markAsPremium({ url: "user/mark-premium", payload });
    setPremiumOpen(false);
  };

  
 



  const compareDate = useCallback((date?: any) => {
    if (date?.expire_at_unix) {
      const expireDate = date?.expire_at_unix;
      if (moment().valueOf() > expireDate) {
        return false;
      } else {
        return true;
      }
    } else if (date?.expire_at) {
      const today = moment(moment(new Date()).format("YYYY-MM-DD")).unix();
      const expireAt = moment(
        moment(date?.expire_at).format("YYYY-MM-DD")
      ).unix();

      if (today > expireAt && date?.expire_at) {
        return false;
      } else {
        return true;
      }
    }
    // return true;
  }, []);
  const getLanguage = useCallback((lang) => {
    switch (lang) {
      case "es":
        return "Spanish";
      default:
        return "English";
    }
  }, []);

  const getRadioValue = useCallback((event?: string) => {
    //console.log("event new" ,event)
    setFrequency(event);
  }, []);

  const unixDate = (data: any) => {
    setExpireAtUnix(data);
  };

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
                initialValues={inviteInititalState}
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
              placeholder="Search by name, email, username"
            />
          </CustomSuspense>
          <CustomSuspense>
            {
              <MyModal
                heading={isPremium === "1" ? "Mark Premium" : "Unmark Premium"}
                showSubmitBtn={false}
                isOpen={isPremiumModalOpen}
                toggle={() => togglePremium()}
              >
                <Formik
                  enableReinitialize={true}
                  initialValues={premiumInititalState}
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
                              changeHandler={getRadioValue}
                            />
                          </div>
                          <CustomDatePicker
                            value={values?.expire_at_unix}
                            label="Expires on"
                            name="expire_at_unix"
                            props={props}
                            unixDate={unixDate}
                            frequency={frequency}
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
            }
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
                          <td>{toUpperCase(val?.first_name)}</td>
                          <td>{toUpperCase(val?.last_name)}</td>
                          <td>{val?.email || "-"}</td>
                          <td>{val?.username || "-"}</td>
                          <td>
                            {moment(val?.created_at).format("YYYY-MM-DD") ||
                              "-"}
                          </td>
                          <td>
                            {moment(val?.last_seen).format(
                              env?.REACT_APP_TIME_FORMAT
                            ) || "-"}
                          </td>
                          <td>{getLanguage(val?.language)}</td>
                          <td>
                            <div
                              className={
                                val?.is_premium == 1 &&
                                compareDate(val?.membership)
                                  ? "manageStatus manageExpire active"
                                  : "manageStatus  manageExpire inactive"
                              }
                            >
                              {val?.is_premium == 1 &&
                                val?.membership &&
                                compareDate(val?.membership) &&
                                "Yes"}
                              {val?.is_premium == 0 && "No"}
                              {/* {(val?.is_premium == 0 ||
                                Object.hasOwn(val, val?.membership))===false &&
                                "No"} */}
                              {val?.is_premium == 1 &&
                                val?.membership &&
                                !compareDate(val?.membership) &&
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
                            {/* <div className="d-flex">
                              <i
                                title={
                                  val?.is_premium == 1 &&
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
                                  val?.is_premium == 1 &&
                                  compareDate(val?.membership)
                                    ? "Unmark Premium"
                                    : "Mark Premium"
                                }
                                className={`bi bi-star-fill ${
                                  val?.is_premium == 1 &&
                                  compareDate(val?.membership)
                                    ? "success"
                                    : "danger"
                                }`}
                                onClick={() =>
                                  openPremiumModal(
                                    val?._id,
                                    val?.is_premium,
                                    compareDate(val?.membership),
                                    val?.membership?.device
                                  )
                                }
                              />

                              <i
                                title="Delete user"
                                className="bi  bi-trash"
                                onClick={() => manageAction(val?._id, "delete")}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <NoRecord colspan={12} />
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
