export interface Member {
  id: string;
  name: string;
  position: string;
  department: "dpd" | "dpc" | "dprt" | "sayap" | "kader";
  subDepartment?: string;
  region?: string;
  photo: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  status: "active" | "inactive";
  description: string;
  achievements?: string[];
  lastActivity?: string;
  nik?: string;
  ktaNumber?: string;
  ktpPhotoUrl?: string;
  familyCount?: number;
  maritalStatus?: string;
  benefits?: string[];
}
