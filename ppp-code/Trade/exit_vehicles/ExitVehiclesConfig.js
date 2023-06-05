import React from 'react';
import { AuthRoles } from "components/auth";

export const ExitVehiclesConfig = {
    auth: AuthRoles.admin,
    routes: [
        {
            path: `${process.env.PUBLIC_URL}/exit_vehicles`,
            component: React.lazy(() => import('./ExitVehicles'))
        }
    ]
};