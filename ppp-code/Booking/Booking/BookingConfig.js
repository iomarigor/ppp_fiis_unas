import React from "react";
import { AuthRoles } from "components/auth";
import Booking from "./Booking";
export const BookingConfig = {
  routes: [
    {
      path: `${process.env.PUBLIC_URL}/booking/:reserva_estancia_id`,
      component: Booking,
    },
  ],
};
