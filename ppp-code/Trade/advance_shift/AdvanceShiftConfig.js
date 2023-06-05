import React from 'react';
import { AuthRoles } from "components/auth";

export const AdvanceShiftConfig = {
    auth: AuthRoles.admin,
    routes: [
        {
            path: `${process.env.PUBLIC_URL}/advance_shift`,
            component: React.lazy(() => import('./AdvanceShift'))
        }
    ]
};