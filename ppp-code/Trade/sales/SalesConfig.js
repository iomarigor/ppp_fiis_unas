import React from 'react';
import { AuthRoles } from "components/auth";

export const SalesConfig = {
    auth: AuthRoles.admin,
    routes: [
        {
            path: `${process.env.PUBLIC_URL}/sales`,
            component: React.lazy(() => import('./Sales'))
        }
    ]
};