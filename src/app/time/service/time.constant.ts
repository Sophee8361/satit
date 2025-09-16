
import { Level, Class, Day,Room} from '../service/slot.model';


export const LEVELS: Level[] = [
  { name: 'ระดับประถม', code: 'PRIMARY' },
  { name: 'ระดับมัธยม', code: 'SECONDARY' }
];


export const CLASSES: Class[] = [
  { name: 'ชั้นประถมศึกษาปีที่ 1', code: 'P1', levelCode: 'PRIMARY' },
  { name: 'ชั้นประถมศึกษาปีที่ 2', code: 'P2', levelCode: 'PRIMARY' },
  { name: 'ชั้นประถมศึกษาปีที่ 3', code: 'P3', levelCode: 'PRIMARY' },
  { name: 'ชั้นประถมศึกษาปีที่ 4', code: 'P4', levelCode: 'PRIMARY' },
  { name: 'ชั้นประถมศึกษาปีที่ 5', code: 'P5', levelCode: 'PRIMARY' },
  { name: 'ชั้นประถมศึกษาปีที่ 6', code: 'P6', levelCode: 'PRIMARY' },
  { name: 'ชั้นมัธยมศึกษาปีที่ 1', code: 'M1', levelCode: 'SECONDARY' },
  { name: 'ชั้นมัธยมศึกษาปีที่ 2', code: 'M2', levelCode: 'SECONDARY' },
  { name: 'ชั้นมัธยมศึกษาปีที่ 3', code: 'M3', levelCode: 'SECONDARY' },
  { name: 'ชั้นมัธยมศึกษาปีที่ 4', code: 'M4', levelCode: 'SECONDARY' },
  { name: 'ชั้นมัธยมศึกษาปีที่ 5', code: 'M5', levelCode: 'SECONDARY' },
  { name: 'ชั้นมัธยมศึกษาปีที่ 6', code: 'M6', levelCode: 'SECONDARY' }
];

export const DAYS: Day[] = [
  { name: 'วันจันทร์', code: 'MON', id: 0 },
  { name: 'วันอังคาร', code: 'TUE', id: 1 },
  { name: 'วันพุธ', code: 'WED', id: 2 },
  { name: 'วันพฤหัสบดี', code: 'THU', id: 3 },
  { name: 'วันศุกร์', code: 'FRI', id: 4 },
];

export const ROOMS: Room[] = [
  { name: 'ห้อง 1', code: '1' },
  { name: 'ห้อง 2', code: '2' }
]

