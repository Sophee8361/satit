export interface ClassStructure {
  COURSEID: string;
  COURSENAME: string;
  ID: string;
  CLASS: string;
  UNIT: string;
  UNITSEAT: string;
  ROOM: string;
  ACADYEAR: string;
  SEMESTER: string;
  SEMESTERINDEX: string;
  STAFF1_ID: string;
  STAFF1_NAME: string;
  STAFF2_ID: string | null;
  STAFF2_NAME: string | null;
}

export interface Schedule {
  CLASS: string;
  ROOM: string;
  SEMESTERINDEX: string;
  ACADYEAR: string;
  SEMESTER: string;
  COURSEID: string;
  UNITSEAT: string;
  UNIT: string;
  DAY: string;
  TIMESLOTID: string;
  CREATEDBY: string;
}


export interface TeachingSchedule {
  CLASSID: string;
  ACADYEAR: string;
  SEMESTER: string;
  SEMESTERINDEX: string;
  COURCODE: string;
  COURSENAME: string;
  STAFFID: string;
  STAFFID_HRM: string;
  PREFIXID: string;
  STAFFNAME: string;
  STAFFSERNAME: string;
  DAYID: string;
  DAYNAME: string;
  TIMESLOTID: string;
  SLOTFROM: string;
  SLOTTO: string;
  COURSEID: string;
  CLASS: string;
  ROOM: string;
  // ✅ เพิ่มตรงนี้
  TEACHERNAME?: string;
  TIME_LABEL?: string;    // เช่น 1 (08.10 - 09.00)
}

