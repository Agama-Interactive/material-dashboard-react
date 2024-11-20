import writeXlsxFile from "write-excel-file";

import { getExerciseSessions, getUserData, getUserDevices, getUserEmail } from "./FirebaseManager";
import { FitnessLevel, Category, CategoryAerobic, Arrow } from "../DiactiveTypes";

import exercisesJson from "./exercises.json";

const userSheetName = "Datos de usuario";
const sessionsSheetName = "Historial de sesiones";

export const exportExcelFile = async (userId, userName) => {
  const userData = await getUserData(userId);
  userData.email = await getUserEmail(userId);
  const userDevices = await getUserDevices(userId);
  const exerciseSessions = await getExerciseSessions(userId);
  await generateExcelFile(userData, userDevices, exerciseSessions);
};

const generateExcelFile = async (userData, userDevices, exerciseSessions) => {
  const { userTable, userColumns } = generateUserSheet(userData, userDevices);
  const { sessionsTable, sessionsColumns } = generateSessionsSheet(exerciseSessions);

  const fileName = `${userData.name}.xlsx`;
  await writeXlsxFile([userTable, sessionsTable], {
    columns: [userColumns, sessionsColumns],
    sheets: [userSheetName, sessionsSheetName],
    fileName: fileName,
  });
};

const getHeartRateCell = (heartRate) => {
  return heartRate === -1 ? null : { value: heartRate, type: Number };
};

const determineFitnessLevel = (sessionNumber) => {
  if (sessionNumber <= 60) return 0;
  else if (sessionNumber <= 120) return 1;
  return 2;
};

const determineRestTimes = (isAerobic, category, fitnessLevel) => {
  if (isAerobic) {
    return { postSetTime: 10, postExerciseTime: 45 };
  }
  // Individual con material / Individual sin material
  else if (category === 0 || category === 1) {
    const restTimes = [
      { postSetTime: 30, postExerciseTime: 60 },
      { postSetTime: 45, postExerciseTime: 60 },
      { postSetTime: 60, postExerciseTime: 75 },
    ];
    return restTimes[fitnessLevel];
  }
  // En pareja
  else if (category === 2) {
    return { postSetTime: 45, postExerciseTime: 60 };
  }
};

const appendExerciseNames = (exercises) => {
  return exercises.map((exerciseNumberString) => {
    const exerciseNumber = parseInt(exerciseNumberString);
    const exerciseName = exercisesJson[exerciseNumber].name;
    return `${exerciseNumberString}: ${exerciseName}`;
  });
};

const calculateAge = (dateOfBirth) => {
  const now = new Date();
  const timeDiffInMillis = now - dateOfBirth;
  const millisecondsInYear = 31556952000; // Approximately 365.25 days in milliseconds (considering leap years)

  const age = Math.floor(timeDiffInMillis / millisecondsInYear);
  return age;
};

const generateUserSheet = (userData, userDevices) => {
  const userTable = getUserTable(userData, userDevices);

  const userColumns = [
    { width: 12 }, //Nickname
    { width: 7 }, //Edad
    { width: 19 }, //Fecha de nacimiento
    { width: 24 }, //Correo electronico
    { width: 7 }, //Peso
    { width: 7 }, //Altura
    { width: 20 }, //Dispositivos
    { width: 12 }, //Plataformas
    { width: 12 }, //Nivel actual
    { width: 16 }, //Fuerza muscular
    { width: 28 }, //Capacidad cardiorrespiratoria
    { width: 15 }, //Nivel de fitness
    { width: 16 }, //Polar obligatorio
  ];

  return { userTable, userColumns };
};

const getUserTable = (userData, userDevices) => {
  const userHeaderRow = [
    { value: "Nickname", fontWeight: "bold" },
    { value: "Edad", fontWeight: "bold" },
    { value: "Fecha de nacimiento", fontWeight: "bold" },
    { value: "Correo electronico", fontWeight: "bold" },
    { value: "Peso", fontWeight: "bold" },
    { value: "Altura", fontWeight: "bold" },
    { value: "Dispositivos", fontWeight: "bold" },
    { value: "Plataformas", fontWeight: "bold" },
    { value: "Nivel actual", fontWeight: "bold" },
    { value: "Fuerza muscular", fontWeight: "bold" },
    { value: "Capacidad cardiorrespiratoria", fontWeight: "bold" },
    { value: "Nivel de fitness", fontWeight: "bold" },
    { value: "Polar obligatorio", fontWeight: "bold" },
  ];

  const dateOfBirth = userData.dateOfBirth.toDate();
  const timezoneOffset = dateOfBirth.getTimezoneOffset() * 60 * 1000;
  const dateOfBirthLocal = new Date(dateOfBirth - timezoneOffset);

  const userValuesRow = [
    { value: userData.name },
    { value: calculateAge(dateOfBirthLocal), type: Number },
    { value: dateOfBirthLocal, type: Date, format: "dd/mm/yyyy" },
    { value: userData.email },
    { value: userData.weight, type: Number, format: "0.0" },
    { value: userData.height, type: Number },
    { value: userDevices.models.join("\n") },
    { value: userDevices.platforms.join("\n") },
    { value: userData.level, type: Number },
    { value: userData.muscleStrength },
    { value: userData.cardioCapacity },
    { value: FitnessLevel[userData.fitnessLevel] },
    { value: userData.polarRequired ? "Si" : "No" },
  ];

  return [userHeaderRow, userValuesRow];
};

const generateSessionsSheet = (exerciseSessions) => {
  const sessionsHeaderRow = [
    { value: "Fecha", fontWeight: "bold" },
    { value: "Hora", fontWeight: "bold" },
    { value: "Material", fontWeight: "bold" },
    { value: "Ejercicio 1", fontWeight: "bold" },
    { value: "Ejercicio 2", fontWeight: "bold" },
    { value: "Ejercicio 3", fontWeight: "bold" },
    { value: "Ejercicio 4", fontWeight: "bold" },
    { value: "Ejercicio 5", fontWeight: "bold" },
    { value: "Ejercicio 6", fontWeight: "bold" },
    { value: "Nivel de glucemia pre", fontWeight: "bold" },
    { value: "Flecha pre", fontWeight: "bold" },
    { value: "Nivel de glucemia post", fontWeight: "bold" },
    { value: "Flecha post", fontWeight: "bold" },
    { value: "Frecuencia cardíaca media", fontWeight: "bold" },
    { value: "Frecuencia cardíaca mínima", fontWeight: "bold" },
    { value: "Frecuencia cardíaca máxima", fontWeight: "bold" },
    { value: "Nivel de satisfacción", fontWeight: "bold" },
    { value: "Número de ejercicios", fontWeight: "bold" },
    { value: "Tiempo de descanso entre repeticiones", fontWeight: "bold" },
    { value: "Tiempo de descanso entre ejercicios", fontWeight: "bold" },
    { value: "Nivel de fitness", fontWeight: "bold" },
    { value: "Total de sesiones", fontWeight: "bold" },
  ];

  const sessionsRows = exerciseSessions.map((exerciseSession, sessionIndex) =>
    getSessionRow(exerciseSession, sessionIndex + 1)
  );

  const sessionsTable = [sessionsHeaderRow, ...sessionsRows];

  const sessionsColumns = [
    { width: 10 }, //Fecha
    { width: 7 }, //Hora
    { width: 18 }, //Material
    { width: 55 }, //Ejercicio 1
    { width: 55 }, //Ejercicio 2
    { width: 55 }, //Ejercicio 3
    { width: 55 }, //Ejercicio 4
    { width: 55 }, //Ejercicio 5
    { width: 55 }, //Ejercicio 6
    { width: 20 }, //Glucemia pre
    { width: 11 }, //Flecha pre
    { width: 20 }, //Glucemia post
    { width: 11 }, //Flecha post
    { width: 24 }, //Frecuencia cardíaca media
    { width: 26 }, //Frecuencia cardíaca mínima
    { width: 26 }, //Frecuencia cardíaca máxima
    { width: 19 }, //Nivel de satisfacción
    { width: 19 }, //Número de ejercicios
    { width: 34 }, //Tiempo de descanso entre repeticiones
    { width: 32 }, //Tiempo de descanso entre ejercicios
    { width: 14 }, //Nivel de fitness
    { width: 16 }, //Total de sesiones
  ];

  return { sessionsTable, sessionsColumns };
};

const getSessionRow = (exerciseSession, sessionNumber) => {
  const createdAtDate = exerciseSession.createdAt.toDate();
  const timezoneOffset = createdAtDate.getTimezoneOffset() * 60 * 1000;
  const createdAtDateLocal = new Date(createdAtDate - timezoneOffset);

  const categoryString = exerciseSession.isAerobic
    ? CategoryAerobic[exerciseSession.category]
    : Category[exerciseSession.category];

  const exercises = appendExerciseNames(exerciseSession.exercises);
  const arrowPreChar = Arrow[exerciseSession.glucoseArrowPre];
  const arrowPostChar = Arrow[exerciseSession.glucoseArrowPost];
  const heartRateAvgCell = getHeartRateCell(exerciseSession.heartRateAvg);
  const heartRateMinCell = getHeartRateCell(exerciseSession.heartRateMin);
  const heartRateMaxCell = getHeartRateCell(exerciseSession.heartRateMax);
  const fitnessLevel = determineFitnessLevel(sessionNumber);
  const restTimes = determineRestTimes(
    exerciseSession.isAerobic,
    exerciseSession.category,
    fitnessLevel
  );

  return [
    { value: createdAtDateLocal, type: Date, format: "dd/mm/yyyy" },
    { value: createdAtDateLocal, type: Date, format: "HH:MM" },
    { value: categoryString },
    { value: exercises[0] },
    { value: exercises[1] },
    { value: exercises[2] },
    { value: exercises[3] },
    { value: exercises[4] },
    { value: exercises[5] },
    { value: exerciseSession.glucoseLevelPre, type: Number },
    { value: arrowPreChar },
    { value: exerciseSession.glucoseLevelPost, type: Number },
    { value: arrowPostChar },
    heartRateAvgCell,
    heartRateMinCell,
    heartRateMaxCell,
    { value: exerciseSession.rating, type: Number },
    { value: exerciseSession.exercises.length, type: Number },
    { value: restTimes.postSetTime, type: Number },
    { value: restTimes.postExerciseTime, type: Number },
    { value: FitnessLevel[fitnessLevel] },
    { value: sessionNumber, type: Number },
  ];
};
