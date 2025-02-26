import React from "react";
import ComponentPage from "./components/componentspage";

import { AdminMiddlewareClient } from "../(middleware)/AdminMiddlewareClient";

const DashboardServer = async () => {
 
  await AdminMiddlewareClient()

  return (
    <> <ComponentPage></ComponentPage> </>
  );
};

export default DashboardServer;
