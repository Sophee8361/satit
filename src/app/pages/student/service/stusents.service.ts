import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs'
import { Component, OnInit } from '@angular/core';
import countries from './json/countries.json';
import religions from './json/religions.json';



export interface Country {
  code: string;
  name: string;
}
export interface Religion {
  code: string;
  name: string;
}

export interface Student {
  NO: Number,
  APPLICANTID: string;
  STUDENTID: number;
  STUDENTCODE: string;
  NAME: string;
  PREFIXID: string;
  PREFIXNAME: string;
  STUDENTNAME: string;
  STUDENTSURNAME: string;
  STUDENTNAMEENG: string;
  STUDENTSURNAMEENG: string;
  STUDENTSTATUS: string;
  STUDENTYEAR: string;
  LEVELNAME: string;
  PROGRAMNAME: string;
  ST: string;
  FN: string;
  FINANCESTATUS: string;
  GPA: string;
  STUDENTSEX: string;
  BIRTHDAY: string | null;
  BD_THAI: string | null;
  RACE: string | null;
  NATION: string | null;
  RELEGION: string | null;
  BLOOD: string | null;
  ROK: string | null;
  MEDICIN: string | null;
  FOOD: string | null;
  CITIZENID: string | null;
  F_NUM: string | null;
  HOSPITAL: string | null;
  PROVINCE_ID_B: string | null;
  DISTRICT_ID_B: string | null;
  SUB_DISTRICT_ID_B: string | null;
  SCHOOL: string | null;
  PROVINCE_SC: string | null;
  AMPOR_SC: string | null;
  TUMBON_SC: string | null;
  NOADD1: string | null;
  MOO1: string | null;
  SOI1: string | null;
  STREET1: string | null;
  TUMBON1: string | null;
  AMPOR1: string | null;
  PROVINCE1: string | null;
  ZIPCODE1: string | null;
  TEL1: string | null;
  NOADD2: string | null;
  MOO2: string | null;
  SOI2: string | null;
  STREET2: string | null;
  TUMBON2: string | null;
  AMPOR2: string | null;
  PROVINCE2: string | null;
  ZIPCODE2: string | null;
  TEL2: string | null;
  FIRSTNAME_F: string | null;
  LASTNAME_F: string | null;
  JOBNAME_F: string | null;
  F_STATUS: string | null;
  STADY_F: string | null;
  JOB_F: string | null;
  SUB_DISTRICT_F: string | null;
  DISTRICT_F: string | null;
  PROVINCE_F: string | null;
  TEL_F: string | null;
  SALARYFM: string | null;
  PF: string | null;
  ID_PF: string | null;
  FIRSTNAME_M: string | null;
  LASTNAME_M: string | null;
  JOBNAME_M: string | null;
  M_STATUS: string | null;
  STADY_M: string | null;
  JOB_M: string | null;
  SUB_DISTRICT_M: string | null;
  DISTRICT_M: string | null;
  PROVINCE_M: string | null;
  SALARYMM: string | null;
  TEL_M: string | null;
  PM: string | null;
  ID_PM: string | null;
  STATUS_F: string | null;
  FIRSTNAME_P: string | null;
  LASTNAME_P: string | null;
  RACEID_P: string | null;
  NATIONID_P: string | null;
  RELIGIONID_P: string | null;
  P_STATUS: string | null;
  STADY_P: string | null;
  JOB_P: string | null;
  JOBNAME_P: string | null;
  PROVINCE_PAR: string | null;
  DISTRICT_PAR: string | null;
  SUB_DISTRICT_PAR: string | null;
  PA: string | null;
  ID_PA: string | null;
  SALARYPM: string | null;
  PARPHONE: string | null;
  MORE_NAME: string | null;
  MORE_ADDRESS: string | null;
  MORE_TEL: string | null;
  STUDENT_PHOTO: string | null;
}

// export interface Province {
//   id: string;
//   nameTH: string;
//   nameEN: string;
// }

export interface Amphur {
  DISTRICT_ID: string;
  DISTRICT_NAME_TH: string; // เพิ่มเติมถ้า API มี
}

export interface Subdistrict {
  SUB_DISTRICT_ID: string;
  SUB_DISTRICT_NAME_TH: string; // เพิ่มเติมถ้า API มี
  DISTRICT_ID: string;
}


export interface Occupation {
  code: string;         // รหัสอาชีพ เช่น "00", "01"
  description: string;  // คำอธิบายอาชีพ เช่น "ไม่ระบุ", "รับราชการ"
}

export interface IncomeRange {
  code: string;            // รหัส เช่น "00", "01", "90"
  shortDescription: string;  // รายละเอียดสั้น เช่น "< 15,000 บาทต่อเดือน"
  fullDescription: string;   // รายละเอียดเต็ม เช่น "น้อยกว่า 15,000 บาทต่อเดือน"
  duplicateCode: string;    // รหัสซ้ำ เช่น "90"
}
export interface Race {
  id: string;      // รหัสประจำชาติ เช่น "001"
  nameTH: string;  // ชื่อภาษาไทย
}

export interface Country {
  code: string;
  name: string;
  nameTh: string; // ชื่อภาษาไทย
}


@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  private apiUrl = 'https://api-eduservice.yru.ac.th/satit/student/';

  // private apiUrl = 'https://api-eduservice.yru.ac.th/satit/student_api.php';
  private apiUrldistrict = 'https://api-eduservice.yru.ac.th/satit/district.php';
  private apiUrlsub = 'https://api-eduservice.yru.ac.th/satit/subdistrict.php';



  prefixes = [
    { PREFIXID: '5', PREFIXNAME: 'เด็กชาย', PREFIXNAMEENG: 'Mr.', GENDER: 'ชาย' },
    { PREFIXID: '6', PREFIXNAME: 'เด็กหญิง', PREFIXNAMEENG: 'Ms.', GENDER: 'หญิง' },
  ];

  bloodgroups = [
    { id: 'A', name: 'A' },
    { id: 'A+', name: 'A+' },
    { id: 'A-', name: 'A-' },
    { id: 'B', name: 'B' },
    { id: 'B+', name: 'B+' },
    { id: 'B-', name: 'B-' },
    { id: 'AB', name: 'AB' },
    { id: 'AB+', name: 'AB+' },
    { id: 'AB-', name: 'AB-' },
    { id: 'O', name: 'O' },
    { id: 'O+', name: 'O+' },
    { id: 'O-', name: 'O-' }
  ];

  race = [
    { id: '000', nameTH: 'ไม่ระบุ' },
    { id: '001', nameTH: 'อังกฤษ' },
    { id: '002', nameTH: 'ปอร์ตุเกส' },
    { id: '003', nameTH: 'ดัตช์' },
    { id: '004', nameTH: 'เยอรมัน' },
    { id: '005', nameTH: 'ฝรั่งเศส' },
    { id: '006', nameTH: 'เดนมาร์ก' },
    { id: '007', nameTH: 'สวีเดน' },
    { id: '008', nameTH: 'สวิสเซอร์แลนด์' },
    { id: '009', nameTH: 'อิตาลี' },
    { id: '010', nameTH: 'นอร์เวย์' },
    { id: '011', nameTH: 'ออสเตรีย' },
    { id: '012', nameTH: 'ไอริช' },
    { id: '013', nameTH: 'ฟินแลนด์' },
    { id: '014', nameTH: 'เบลเยี่ยม' },
    { id: '015', nameTH: 'เสปญ' },
    { id: '016', nameTH: 'รัสเซีย' },
    { id: '017', nameTH: 'โปแลนด์' },
    { id: '018', nameTH: 'เชคโกสโลวาเกีย' },
    { id: '019', nameTH: 'ฮังการี' },
    { id: '020', nameTH: 'กรีก' },
    { id: '021', nameTH: 'ยูโกสลาฟ' },
    { id: '022', nameTH: 'ลักเซมเบอร์ก' },
    { id: '023', nameTH: 'วาติกัน' },
    { id: '024', nameTH: 'มอลต้า' },
    { id: '025', nameTH: 'ลีซู' },
    { id: '026', nameTH: 'บัลแกเรีย' },
    { id: '027', nameTH: 'โรมาเนีย' },
    { id: '028', nameTH: 'ไซปรัส' },
    { id: '029', nameTH: 'อเมริกา' },
    { id: '030', nameTH: 'แคนาดา' },
    { id: '031', nameTH: 'เม็กซิโก' },
    { id: '032', nameTH: 'คิวบา' },
    { id: '033', nameTH: 'อาร์เจนตินา' },
    { id: '034', nameTH: 'บราซิล' },
    { id: '035', nameTH: 'ชิลี' },
    { id: '036', nameTH: 'อาข่า' },
    { id: '037', nameTH: 'โคลัมเบีย' },
    { id: '038', nameTH: 'ลั๊ว' },
    { id: '039', nameTH: 'เปรู' },
    { id: '040', nameTH: 'ปานามา' },
    { id: '041', nameTH: 'อุรุกวัย' },
    { id: '042', nameTH: 'เวเนสุเอล่า' },
    { id: '043', nameTH: 'เปอร์โตริโก้' },
    { id: '044', nameTH: 'จีน' },
    { id: '045', nameTH: 'อินเดีย' },
    { id: '046', nameTH: 'เวียดนาม' },
    { id: '047', nameTH: 'ญี่ปุ่น' },
    { id: '048', nameTH: 'พม่า' },
    { id: '049', nameTH: 'ฟิลิปปินส์' },
    { id: '050', nameTH: 'มาเลเซีย' },
    { id: '051', nameTH: 'อินโดนีเซีย' },
    { id: '052', nameTH: 'ปากีสถาน' },
    { id: '053', nameTH: 'เกาหลีใต้' },
    { id: '054', nameTH: 'สิงคโปร์' },
    { id: '055', nameTH: 'เนปาล' },
    { id: '056', nameTH: 'ลาว' },
    { id: '057', nameTH: 'กัมพูชา' },
    { id: '058', nameTH: 'ศรีลังกา' },
    { id: '059', nameTH: 'ซาอุดิอารเบีย' },
    { id: '060', nameTH: 'อิสราเอล' },
    { id: '061', nameTH: 'เลบานอน' },
    { id: '062', nameTH: 'อิหร่าน(เปอร์เซีย)' },
    { id: '063', nameTH: 'ตุรกี' },
    { id: '064', nameTH: 'บังคลาเทศ' },
    { id: '065', nameTH: 'ถูกถอนสัญชาติ' },
    { id: '066', nameTH: 'ซิเรีย' },
    { id: '067', nameTH: 'อิรัค' },
    { id: '068', nameTH: 'คูเวต' },
    { id: '069', nameTH: 'บรูไน' },
    { id: '070', nameTH: 'อาฟริกาใต้' },
    { id: '071', nameTH: 'กะเหรี่ยง' },
    { id: '072', nameTH: 'ลาหู่' },
    { id: '073', nameTH: 'เคนยา' },
    { id: '074', nameTH: 'อิยิปต์' },
    { id: '075', nameTH: 'เอธิโอเปีย' },
    { id: '076', nameTH: 'ไนจีเรีย' },
    { id: '077', nameTH: 'สหรัฐอาหรับเอมิเรตส์' },
    { id: '078', nameTH: 'กินี' },
    { id: '079', nameTH: 'ออสเตรเลีย' },
    { id: '080', nameTH: 'นิวซีแลนด์' },
    { id: '081', nameTH: 'ปาปัวนิวกินี' },
    { id: '082', nameTH: 'ม้ง' },
    { id: '083', nameTH: 'เมี่ยน' },
    { id: '084', nameTH: 'ชาวเขาที่ไม่ได้รับสัญชาติไทย' },
    { id: '086', nameTH: 'จีนฮ่อ' },
    { id: '087', nameTH: 'อดีตทหารจีนคณะชาติ' },
    { id: '088', nameTH: 'พม่าพลัดถิ่น' },
    { id: '089', nameTH: 'ผู้อพยพเชื้อสายจากกัมพูชา' },
    { id: '090', nameTH: 'ผู้อพยพอินโดจีนสัญชาติลาว' },
    { id: '091', nameTH: 'ผู้อพยพอินโดจีนสัญชาติกัมพูชา' },
    { id: '092', nameTH: 'ผู้อพยพอินโดจีนสัญชาติเวียดนาม' },
    { id: '093', nameTH: 'รอให้สัญชาติไทย*' },
    { id: '094', nameTH: 'ไทย-อิสลาม, อิสลาม-ไทย' },
    { id: '095', nameTH: 'ไทย-จีน, จีน-ไทย' },
    { id: '096', nameTH: 'ไร้สัญชาติ' },
    { id: '098', nameTH: 'ไม่ได้สัญชาติไทยตาม ปว.337' },
    { id: '099', nameTH: 'ไทย' },
    { id: '100', nameTH: 'อัฟกัน' },
    // ... เพิ่มจนถึง 994
    { id: '994', nameTH: 'อื่นๆ' }
  ];

  educationlevels = [
    { id: '05', name: 'ประกาศนียบัตรวิชาการศึกษา' },
    { id: '06', name: 'มัธยมศึกษาปีที่ 6' },
    { id: '07', name: 'ประกาศนียบัตรวิชาชีพ' },
    { id: '08', name: 'ประกาศนียบัตรวิชาชีพชั้นสูง' },
    { id: '09', name: 'อนุปริญญา' },
    { id: '10', name: 'ปริญญาตรี' },
    { id: '11', name: 'ปริญญาโท' },
    { id: '12', name: 'ปริญญาเอก' }
  ];

  lifeStatuses = [
    { id: '1', name: 'มีชีวิต' },
    { id: '0', name: 'ถึงแก่กรรม' },
    { id: '9', name: 'ไม่ระบุ' }
  ];

  proVince = [
    { id: '00', nameTH: 'ไม่ระบุ', nameEN: '' },
    { id: '09', nameTH: 'ต่างประเทศ', nameEN: 'Foreign' },
    { id: '10', nameTH: 'กรุงเทพมหานคร', nameEN: 'Krung Thep Maha Nakhon' },
    { id: '11', nameTH: 'สมุทรปราการ', nameEN: 'Samut Prakan' },
    { id: '12', nameTH: 'นนทบุรี', nameEN: 'Nonthaburi' },
    { id: '13', nameTH: 'ปทุมธานี', nameEN: 'Pathum Thani' },
    { id: '14', nameTH: 'พระนครศรีอยุธยา', nameEN: 'Phra Nakhon Si Ayutthaya' },
    { id: '15', nameTH: 'อ่างทอง', nameEN: 'Ang Thong' },
    { id: '16', nameTH: 'ลพบุรี', nameEN: 'Lop Buri' },
    { id: '17', nameTH: 'สิงห์บุรี', nameEN: 'Sing Buri' },
    { id: '18', nameTH: 'ชัยนาท', nameEN: 'Chai Nat' },
    { id: '19', nameTH: 'สระบุรี', nameEN: 'Saraburi' },
    { id: '20', nameTH: 'ชลบุรี', nameEN: 'Chon Buri' },
    { id: '21', nameTH: 'ระยอง', nameEN: 'Rayong' },
    { id: '22', nameTH: 'จันทบุรี', nameEN: 'Chanthaburi' },
    { id: '23', nameTH: 'ตราด', nameEN: 'Trat' },
    { id: '24', nameTH: 'ฉะเชิงเทรา', nameEN: 'Chachoengsao' },
    { id: '25', nameTH: 'ปราจีนบุรี', nameEN: 'Prachin Buri' },
    { id: '26', nameTH: 'นครนายก', nameEN: 'Nakhon Nayok' },
    { id: '27', nameTH: 'สระแก้ว', nameEN: 'Sa Kaeo' },
    { id: '30', nameTH: 'นครราชสีมา', nameEN: 'Nakhon Ratchasima' },
    { id: '31', nameTH: 'บุรีรัมย์', nameEN: 'Buri Ram' },
    { id: '32', nameTH: 'สุรินทร์', nameEN: 'Surin' },
    { id: '33', nameTH: 'ศรีสะเกษ', nameEN: 'Si Sa Ket' },
    { id: '34', nameTH: 'อุบลราชธานี', nameEN: 'Ubon Ratchathani' },
    { id: '35', nameTH: 'ยโสธร', nameEN: 'Yasothon' },
    { id: '36', nameTH: 'ชัยภูมิ', nameEN: 'Chaiyaphum' },
    { id: '37', nameTH: 'อำนาจเจริญ', nameEN: 'Amnat Charoen' },
    { id: '38', nameTH: 'บึงกาฬ', nameEN: 'Bueng Kan' },
    { id: '39', nameTH: 'หนองบัวลำภู', nameEN: 'Nong Bua Lam Phu' },
    { id: '40', nameTH: 'ขอนแก่น', nameEN: 'Khon Kaen' },
    { id: '41', nameTH: 'อุดรธานี', nameEN: 'Udon Thani' },
    { id: '42', nameTH: 'เลย', nameEN: 'Loei' },
    { id: '43', nameTH: 'หนองคาย', nameEN: 'Nong Khai' },
    { id: '44', nameTH: 'มหาสารคาม', nameEN: 'Maha Sarakham' },
    { id: '45', nameTH: 'ร้อยเอ็ด', nameEN: 'Roi Et' },
    { id: '46', nameTH: 'กาฬสินธุ์', nameEN: 'Kalasin' },
    { id: '47', nameTH: 'สกลนคร', nameEN: 'Sakon Nakhon' },
    { id: '48', nameTH: 'นครพนม', nameEN: 'Nakhon Phanom' },
    { id: '49', nameTH: 'มุกดาหาร', nameEN: 'Mukdahan' },
    { id: '50', nameTH: 'เชียงใหม่', nameEN: 'Chiang Mai' },
    { id: '51', nameTH: 'ลำพูน', nameEN: 'Lamphun' },
    { id: '52', nameTH: 'ลำปาง', nameEN: 'Lampang' },
    { id: '53', nameTH: 'อุตรดิตถ์', nameEN: 'Uttaradit' },
    { id: '54', nameTH: 'แพร่', nameEN: 'Phrae' },
    { id: '55', nameTH: 'น่าน', nameEN: 'Nan' },
    { id: '56', nameTH: 'พะเยา', nameEN: 'Phayao' },
    { id: '57', nameTH: 'เชียงราย', nameEN: 'Chiang Rai' },
    { id: '58', nameTH: 'แม่ฮ่องสอน', nameEN: 'Mae Hong Son' },
    { id: '60', nameTH: 'นครสวรรค์', nameEN: 'Nakhon Sawan' },
    { id: '61', nameTH: 'อุทัยธานี', nameEN: 'Uthai Thani' },
    { id: '62', nameTH: 'กำแพงเพชร', nameEN: 'Kamphaeng Phet' },
    { id: '63', nameTH: 'ตาก', nameEN: 'Tak' },
    { id: '64', nameTH: 'สุโขทัย', nameEN: 'Sukhothai' },
    { id: '65', nameTH: 'พิษณุโลก', nameEN: 'Phitsanulok' },
    { id: '66', nameTH: 'พิจิตร', nameEN: 'Phichit' },
    { id: '67', nameTH: 'เพชรบูรณ์', nameEN: 'Phetchabun' },
    { id: '70', nameTH: 'ราชบุรี', nameEN: 'Ratchaburi' },
    { id: '71', nameTH: 'กาญจนบุรี', nameEN: 'Kanchanaburi' },
    { id: '72', nameTH: 'สุพรรณบุรี', nameEN: 'Suphan Buri' },
    { id: '73', nameTH: 'นครปฐม', nameEN: 'Nakhon Pathom' },
    { id: '74', nameTH: 'สมุทรสาคร', nameEN: 'Samut Sakhon' },
    { id: '75', nameTH: 'สมุทรสงคราม', nameEN: 'Samut Songkhram' },
    { id: '76', nameTH: 'เพชรบุรี', nameEN: 'Phetchaburi' },
    { id: '77', nameTH: 'ประจวบคีรีขันธ์', nameEN: 'Prachuap Khiri Khan' },
    { id: '80', nameTH: 'นครศรีธรรมราช', nameEN: 'Nakhon Si Thammarat' },
    { id: '81', nameTH: 'กระบี่', nameEN: 'Krabi' },
    { id: '82', nameTH: 'พังงา', nameEN: 'Phangnga' },
    { id: '83', nameTH: 'ภูเก็ต', nameEN: 'Phuket' },
    { id: '84', nameTH: 'สุราษฎร์ธานี', nameEN: 'Surat Thani' },
    { id: '85', nameTH: 'ระนอง', nameEN: 'Ranong' },
    { id: '86', nameTH: 'ชุมพร', nameEN: 'Chumphon' },
    { id: '90', nameTH: 'สงขลา', nameEN: 'Songkhla' },
    { id: '91', nameTH: 'สตูล', nameEN: 'Satun' },
    { id: '92', nameTH: 'ตรัง', nameEN: 'Trang' },
    { id: '93', nameTH: 'พัทลุง', nameEN: 'Phatthalung' },
    { id: '94', nameTH: 'ปัตตานี', nameEN: 'Pattani' },
    { id: '95', nameTH: 'ยะลา', nameEN: 'Yala' },
    { id: '96', nameTH: 'นราธิวาส', nameEN: 'Narathiwat' }
  ];

  occupation =  [
    { code: '00', description: 'ไม่ระบุ' },
    { code: '01', description: 'รับราชการ' },
    { code: '02', description: 'รัฐวิสาหกิจ' },
    { code: '03', description: 'พนักงานหน่วยงานเอกชน/ลูกจ้างหน่วยงานเอกชน' },
    { code: '04', description: 'ค้าขาย,ธุรกิจส่วนตัวและอาชีพอิสระ/รับจ้างอิสระแบบไม่ประจำ' },
    { code: '05', description: 'เกษตร,ประมง' },
    { code: '06', description: 'ไม่มีเงินได้' },
    { code: '07', description: 'อื่นๆ' },
    { code: '08', description: 'พนักงานราชการ/ลูกจ้างหน่วยงานราชการ' },
  ];

  incomeranges = [
    { code: '00', shortDescription: 'ไม่มีรายได้', fullDescription: 'ไม่มีรายได้', duplicateCode: '90' },
    { code: '01', shortDescription: '< 15,000 บาทต่อเดือน', fullDescription: 'น้อยกว่า 15,000 บาทต่อเดือน', duplicateCode: '01' },
    { code: '02', shortDescription: '15,001 - 30,000 บาทต่อเดือน', fullDescription: '15,001 - 30,000 บาทต่อเดือน', duplicateCode: '02' },
    { code: '03', shortDescription: '30,001 - 45,000 บาทต่อเดือน', fullDescription: '30,001 - 45,000 บาทต่อเดือน', duplicateCode: '03' },
    { code: '04', shortDescription: '45,001 - 60,000 บาทต่อเดือน', fullDescription: '45,001 - 60,000 บาทต่อเดือน', duplicateCode: '04' },
    { code: '05', shortDescription: '> 60,000 บาทต่อเดือน', fullDescription: 'มากกว่า 60,000 บาทต่อเดือน', duplicateCode: '05' },
    { code: '90', shortDescription: 'ไม่ระบุ', fullDescription: 'ไม่ระบุ', duplicateCode: '90' },
  ];




  getprovince() {
    return this.proVince;
  }

  getraces() {
    return this.race;
  }

  getoccupations() {
    return this.occupation;
  }

  getPrefixes() {
    return this.prefixes;
  }

  getincomeranges() {
    return this.incomeranges
  }
  bloodGroups() {
    return this.bloodgroups;
  }

  educationLevels(){
    return this.educationlevels;
  }

  lifestatuses() {
    return this.lifeStatuses
  }

  constructor(private http: HttpClient) { }
  getStudents(): Observable<Student[]> {
    console.log('Fetching students from API:', this.apiUrl);
    return this.http.get<Student[]>(this.apiUrl);
  }

  // getStudentById(id: number): Observable<Student> {
  //     return this.http.get<Student[]>(`${this.apiUrl}?id=${id}`)
  //     .pipe(
  //         map((students: any[]) => students[0])  // ดึง object แรกของ array ออกมา
  //     );
  // }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}?id=${id}`);
  }


  updateStudent(student: Student): Observable<any> {
    return this.http.put(`${this.apiUrl}?id=${student.STUDENTID}`, student);
  }

  createStudent(student: Student): Observable<any> {
    return this.http.post(`${this.apiUrl}`, student);
  }

  //เรียกใช้ Api อำเภอ
  getDistricts(provinceId: string): Observable<Amphur[]> {
    return this.http.get<Amphur[]>(`${this.apiUrldistrict}/?code=${provinceId}`);
  }

  getsubDistricts(districtid: string): Observable<Subdistrict[]> {
    return this.http.get<Subdistrict[]>(`${this.apiUrlsub}/?code=${districtid}`);
  }

  getDistrictsh(provinceId: string): Observable<Amphur[]> {
    return this.http.get<Amphur[]>(`${this.apiUrldistrict}/?code=${provinceId}`);
  }

  getsubDistrictsh(districtid: string): Observable<Subdistrict[]> {
    return this.http.get<Subdistrict[]>(`${this.apiUrlsub}/?code=${districtid}`);
  }

  getCountries(): Country[] {
    return countries;
  }

  getReligions(): Religion[] {
    return religions;
  }

  deleteStudent(STUDENTID: number) {

  }
}
