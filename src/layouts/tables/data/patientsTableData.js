/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

import profilePicPlaceholder from "assets/images/profilePicPlaceholder.png";

const FitnessLevel = {
  0: "Bajo",
  1: "Medio",
  2: "Alto",
};

export default function data(patients) {
  const onDownloadClick = () => {
    alert("On download click!");
  };

  const Patient = ({ id, name, profilePicture }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={profilePicture || profilePicPlaceholder} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        {/* <MDTypography variant="caption">{id}</MDTypography> */}
      </MDBox>
    </MDBox>
  );

  return {
    columns: [
      { Header: "Paciente", accessor: "patient", align: "left" },
      { Header: "Fuerza Muscular", accessor: "muscleStrength", align: "left" },
      { Header: "Capacidad Cardiorrespiratoria", accessor: "cardioCapacity", align: "left" },
      { Header: "Nivel de Fitness", accessor: "fitnessLevel", align: "left" },
      { Header: "Nivel Actual", accessor: "level", align: "left" },
      { Header: "Descargar", accessor: "download", align: "left" },
    ],
    rows: patients.map((patient) => {
      return {
        patient: (
          <Patient id={patient.id} name={patient.name} profilePicture={patient.profilePicture} />
        ),
        muscleStrength: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {patient.muscleStrength}
          </MDTypography>
        ),
        cardioCapacity: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {patient.cardioCapacity}
          </MDTypography>
        ),
        fitnessLevel: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {FitnessLevel[patient.fitnessLevel]}
          </MDTypography>
        ),
        level: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {patient.level}
          </MDTypography>
        ),
        download: (
          <MDTypography
            onClick={onDownloadClick}
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            Descargar Excel
          </MDTypography>
        ),
      };
    }),
  };
}