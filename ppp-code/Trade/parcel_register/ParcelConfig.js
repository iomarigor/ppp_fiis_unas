import React from "react";
import { AuthRoles } from "components/auth";

export const ParcelConfig = {
  auth: AuthRoles.admin,
  routes: [
    {
      path: `${process.env.PUBLIC_URL}/parcel_register`,
      component: React.lazy(() => import("./Parcel")),
    },
  ],
};
