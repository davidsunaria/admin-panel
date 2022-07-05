import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useStoreActions, useStoreState } from "react-app-store";
import { IUsers, IEnableDisable, ILockedGroup ,RadioInputValue,IImageOptions} from "react-app-interfaces";
import InfiniteScroll from "react-infinite-scroll-component";
import ConfirmAlert from "../../components/ConfirmAlert";
import CustomSuspense from "../../components/CustomSuspense";
import { confirmAlert } from "react-confirm-alert";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import env from "../../../config";
import DEFAULT_GROUP_IMG from "react-app-images/default_group.png";
import { truncate, toUpperCase } from "../../../lib/utils/Service";
import { Formik } from "formik";
import _ from "lodash";

const TableHeader = React.lazy(() => import("../../components/TableHeader"));
const NoRecord = React.lazy(() => import("../../components/NoRecord"));
const SearchUser = React.lazy(() => import("../../components/SearchUser"));
const Navbar = React.lazy(() => import("../../components/Navbar"));
const MyModal = React.lazy(() => import("../../components/MyModal"));
const InputRadio = React.lazy(() => import("../../components/InputRadio"));

const Groups: React.FC = (): JSX.Element => {
  const tableHeader = useMemo(() => {
    return [
      { key: "image", value: "Image" },
      { key: "name", value: "Name" },
      { key: "creator", value: "Owner" },
      { key: "category", value: "Purpose" },
      { key: "address", value: "Address" },
      { key: "restrictedMode", value: "Restricted Mode" },
      { key: "status", value: "Status" },
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
  const [currentRestrictedMode, setCurrentRestrictedMode] = useState<string | undefined>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [groupId, setGroupId] = useState<String>("");
  //State
  const isLoading = useStoreState((state) => state.common.isLoading);
  const response = useStoreState((state) => state.group.response);
  const paginationObject = useStoreState(
    (state) => state.group.paginationObject
  );
  //Actions
  //Actions
  const getGroups = useStoreActions((actions) => actions.group.getGroups);
  const enableDisable = useStoreActions(
    (actions) => actions.group.enableDisable
  );
  const lockedUnlocked = useStoreActions(
    (actions) => actions.group.lockedUnlocked
  );
  const deleteGroup = useStoreActions((actions) => actions.group.deleteGroup);

  const toggle = () => setIsOpen(!isOpen);

  const openLockedPostingModal = async (id: string, restriction_mode: string) => {
    toggle();
    setGroupId(id);
    setCurrentRestrictedMode(restriction_mode);
  };

  const getGroupData = useCallback(async (payload: IUsers) => {
    await getGroups({ url: "group/get-all-groups", payload });
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
    getGroupData(formData);
  }, []);

  useEffect(() => {
    if (formData) {
      getGroupData(formData);
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
      type: "group",
      status: status === 1 ? 0 : 1,
    };
    await enableDisable({ url: "common/enable-disable", payload });
  }, []);

  const groupDelete = useCallback(
    async (id: string, status: string | number) => {
      const payload: IEnableDisable = {
        _id: id,
      };
      await deleteGroup({ url: "group/delete-group", payload });
    },
    []
  );

  const manageAction = useCallback((id, status) => {
    let text: string;
    if (status === 1) {
      text = "You want to inactivate group?";
    } else if (status === "delete") {
      text = "You want to delete group?";
    } else {
      text = "You want to activate group?";
    }
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <ConfirmAlert
            onClose={onClose}
            onYes={
              status !== "delete"
                ? () => onYes(id, status)
                : () => groupDelete(id, status)
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

  const radioParameters: RadioInputValue[] = [
    { value: "open", label: "Open", name: "restriction_mode" },
    { value: "subscribed", label: "Subscriber only", name: "restriction_mode" },
    { value: "admin", label: "Admin only", name: "restriction_mode" },
  ];

  const lockedGroupInititalState = useCallback((): ILockedGroup => {
    return {
      restriction_mode: currentRestrictedMode ?? "",
      _id: "",
    };
  }, [currentRestrictedMode]);

  const modal = React.useMemo(() => {
    return (
      <>
        <MyModal
          heading={"Restrict Group"}
          showSubmitBtn={false}
          isOpen={isOpen}
          toggle={toggle}
        >
          <Formik
            enableReinitialize={true}
            initialValues={lockedGroupInititalState()}
            onSubmit={async (values) => {
              restrictedGroup(values);
            }}
            //validationSchema={PremiumSchema}
          >
            {(props) => {
              const { handleSubmit } = props;
              return (
                <form onSubmit={handleSubmit}>
                  <div className="p-3">
                    <div className="mb-3">
                      <InputRadio values={radioParameters} />
                    </div>
                  </div>
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
      </>
    );
  }, [currentRestrictedMode, isOpen]);

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

  const restrictedGroup = async (formData: ILockedGroup) => {
    // setRestrictedMode(formData.restriction_mode)
    let payload = {
      _id: groupId,
      restriction_mode: formData.restriction_mode,
    };
    await lockedUnlocked({ url: "group/lock-posting", payload });
    toggle();
  };

  return (
    <>
      <div className="Content">
        <CustomSuspense>
          <Navbar text={"Manage groups"} />
        </CustomSuspense>
        <div className="cardBox">
          <CustomSuspense>
            <SearchUser
              type={"groups"}
              onSearch={onSearch}
              onReset={onReset}
              exportButton={true}
            />
          </CustomSuspense>
          <CustomSuspense>{modal}</CustomSuspense>
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
                                placeholderSrc={DEFAULT_GROUP_IMG}
                                effect={val?.image ? "blur" : undefined}
                                alt={"image"}
                                height={60}
                                src={
                                  val?.image
                                    ? getImageUrl(val?.image, {
                                        type: "groups",
                                        width: 60,
                                      })
                                    : DEFAULT_GROUP_IMG
                                } // use normal <img> attributes as props
                                width={60}
                              />
                            }
                          </td>
                          <td>{toUpperCase(val?.name)}</td>

                          <td>
                            <div
                              title={` ${val?.creator_of_group?.first_name} ${val?.creator_of_group?.last_name}`}
                            >
                              {truncate(
                                toUpperCase(
                                  `${val?.creator_of_group?.first_name} ${val?.creator_of_group?.last_name}`
                                )
                              )}
                            </div>
                          </td>

                          <td>{toUpperCase(val?.category)}</td>
                          <td>
                            <div title={val?.address}>
                              {truncate(toUpperCase(val?.address))}
                            </div>
                          </td>
                          <td>{toUpperCase(val?.restriction_mode)}</td>
                          <td className={"onHover"}>
                            <div
                              onClick={() =>
                                manageAction(val?._id, val?.status)
                              }
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
                          <td className="tdAction">
                            <div className="d-flex">
                              <i
                                title="Lock for posting"
                                className=" bi bi-lock"
                                onClick={() =>
                                  openLockedPostingModal(
                                    val?._id,
                                    val?.restriction_mode
                                  )
                                }
                              ></i>
                              <i
                                title="Delete group"
                                className="bi  bi-trash"
                                onClick={() => manageAction(val?._id, "delete")}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <NoRecord colspan={9} />
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
export default Groups;
