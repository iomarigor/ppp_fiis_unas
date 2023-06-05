import Tracking from "./Tracking";
import { AuthRoles } from "components/auth";

export const TrackingConfig = {
  routes: [
    {
      path: `${process.env.PUBLIC_URL}/tracking`,
      component: Tracking,
    },
  ],
};
