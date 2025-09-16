export interface SlotModel {
  NO: string;
  TIMESLOTID: string;
  SLOTFROM: string;
  SLOTTO: string
}

// Interface สำหรับผู้สอน (ใช้ City เดิมได้)
export interface Staff {
  name: string;
  code: string;
}

// Interface สำหรับระดับการศึกษา (ประถม, มัธยม)
export interface Level {
  name: string;
  code: string;
}

// Interface สำหรับชั้นเรียน
export interface Class {
  name: string;
  code: string;
  levelCode: string; // ใช้เชื่อมโยงกับ Level
}

// Interface สำหรับวิชาเรียน
export interface Subject {
  name: string;
  code: string;
  levelCode: string;   // วิชานี้อยู่ในระดับใด (PRIMARY, SECONDARY)
  gradeCodes: string[]; // วิชานี้สอนในชั้นใดบ้าง (เช่น ['P1', 'P2'] หรือ ['M4', 'M5', 'M6'])
}

// Interface สำหรับตารางเรียน (จากตัวอย่างก่อนหน้า)
export interface ScheduleItem {
  time: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
}

export interface GroupCourse {
  groupId: string;
  groupName: string;
}

export interface ApiSubjectData {
  subject_id: string;
  subject_name: string;
  subject_code: string;
  level_class: string;
  teacher?: string; // เพิ่ม field นี้ให้ตรงกับการใช้งานจริง
}


export interface ApiCourse {
  courseId: string;      // รหัสวิชา
  courseCode: string;      // รหัสวิชาสั้น
  courseName: string;    // ชื่อวิชา
  timeyear: string;      // จำนวนชั่วโมง/ปี
  groupId: string;       // รหัสกลุ่มรายวิชา
  classYear: string;     // ปีการศึกษา/ระดับชั้น
  levelClass: string;    // รหัสชั้นเรียน เช่น P1, M4
  groupName: string;     // ชื่อกลุ่มรายวิชา
}

export interface Room {
  name: string;
  code: string;
}

export interface Day {
  name: string;   // เช่น "วันจันทร์"
  code: string;   // เช่น "MON"
  id: number;
}

export interface Room {
  name: string,
  code: string
}

export interface ClassStructure {
  id: string;
  classCode: string;
  subjectCode: string;
  roomCode: string;
  dayCode: string;
  slotCode: string;
  teacherCode?: string;
}
