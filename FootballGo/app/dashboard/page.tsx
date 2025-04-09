import React from "react";
import { AdminMiddlewareClient } from "../(middleware)/AdminMiddlewareClient";
import DashboardPage from "./components/Dashboardpage";

const DashboardServer = async () => {
 
  await AdminMiddlewareClient()

  return (
    <> <DashboardPage/> </>
  );
};

export default DashboardServer;
