import writeXlsxFile from "write-excel-file";

const userSheetName = "Datos de usuario";
const sessionsSheetName = "Historial de sesiones";

export const exportExcelFile = async (userId, userName) => {
  const userData = { name: userName };
  await generateExcelFile(userData, null, null);
};

const generateExcelFile = async (userData, userDevices, exerciseSessions) => {
  const fileName = `${userData.name}.xlsx`;
  await writeXlsxFile([[], []], {
    columns: [[], []],
    sheets: [userSheetName, sessionsSheetName],
    fileName: fileName,
  });
};
