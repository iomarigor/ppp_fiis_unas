import { combineReducers } from "redux";

import message from "./message.reducer";
import grid from "./grid.reducer";
import chart from "./chart.reducer";
import products from "./products.reducer";
import room from "./room.reducer";
import touristPackages from "./touristPackages.reducer";
import clientsProviders from "./clients_providers.reducer";
import voucher from "./voucher.reducer";
import establishment from "./establishment.reducer";
import series from "./series.reducer";
import users from "./users.reducer";
import sales from "./sales.reducer";
import orders from "./order.reducer";
import proformas from "./proformas.reducer";
import manageCash from "./manage_cash.reducer";
import incomeReceipt from "./income_receipt.reducer";
import expensesReceipt from "./expenses_receipt.reducer";
import creditNote from "./credit_note.reducer";
import manageCpe from "./manage_cpe.reducer";
import electronicGuide from "./electronic_guide.reducer";
import dashboard from "./dashboard.reducer";
import accessControl from "./access_control.reducer";
import menuControl from "./menu_control.reducer";
import managementDriver from "./management_driver.reducer";
import exitVehicles from "./exit_vehicles.reducer";
import advanceShift from "./advance_shift.reducer";
import parcelRegister from "./parcel_register.reducer";

const appReducers = combineReducers({
    accessControl,
    menuControl,
    message,
    grid,
    chart,
    products,
    room,
    touristPackages,
    clientsProviders,
    voucher,
    establishment,
    series,
    users,
    sales,
    orders,
    proformas,
    manageCash,
    incomeReceipt,
    expensesReceipt,
    creditNote,
    manageCpe,
    electronicGuide,
    dashboard,
    managementDriver,
    exitVehicles,
    advanceShift,
    parcelRegister
});

export default appReducers;