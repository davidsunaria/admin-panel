import React from "react";

const Navbar = React.lazy(() => import("../../components/Navbar"));
const CustomSuspense = React.lazy(
  () => import("../../components/CustomSuspense")
);

const ResourceMembers = React.lazy(() => import("../ResourceMembers"));
const EventPerGroup = React.lazy(() => import("../EventPerGroup"));
const SubscriberMemberCount = React.lazy(
  () => import("../SubscriberMemberCount")
);
const PostPerMember = React.lazy(() => import("../PostPerMember"));
const PaypalVsCash = React.lazy(() => import("../PaypalVsCash"));
const GroupEventByLocation = React.lazy(
  () => import("../GroupEventByLocation")
);

const Dashboard: React.FC = (): JSX.Element => {
  return (
    <>
      <div className="Content">
        <CustomSuspense>
          <Navbar text={"Dashboard"} />
        </CustomSuspense>

        <div className="row">
          <SubscriberMemberCount />
          <PaypalVsCash />
          <EventPerGroup />
          <ResourceMembers />
          <PostPerMember />

          <GroupEventByLocation />
        </div>
      </div>
    </>
  );
};
export default Dashboard;
