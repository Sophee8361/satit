export interface OfficerhrmModel {
  STAFFCODE: string;
  PREFIXNAME: string;
  STAFFNAME: string;
  STAFFSURNAME: string;
  STAFFID: string;
}

export interface OfficerModel {
  STAFFID: string;
  STAFFCODE: string;
  PREFIXID: string;
  STAFFNAME: string;
  STAFFSERNAME: string;
  STAFFID_HRM: string;
  ACADYEAR: string;
  SEMESTER: string;
  FULLNAME: string;
}

export interface OfficerreplaceModel {
  STAFFIDMASTER: string;
  STAFFIDREPLACE: string;
  CLASSID: string;
}
