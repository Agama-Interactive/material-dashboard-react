/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import { getAllUsers, isAuthenticated, signOutUser } from "../../managers/FirebaseManager";

// Data
import patientsTableData from "layouts/tables/data/patientsTableData";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Tables() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      // if (!isAuthenticated()) {
      //   navigate("/authentication/sign-in");
      //   return;
      // }
      const users = await getAllUsers();
      setUsers(users);
    };
    getUsers();
  }, []);

  const onSignOutClick = () => {
    signOutUser();
    navigate("/authentication/sign-in");
  };

  if (!isAuthenticated()) return null;

  return (
    <DashboardLayout>
      {/* <DashboardNavbar /> */}
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox pt={1}>
                <DataTable
                  table={patientsTableData(users)}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <MDButton onClick={onSignOutClick}>Cerrar Sesión</MDButton>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Tables;
