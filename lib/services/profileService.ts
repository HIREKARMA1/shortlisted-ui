import { api } from '@/lib/api';

export type StudentProfile = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  status: string;
  email_verified: boolean;
  phone_verified: boolean;
  created_at: string;
  updated_at?: string;
  last_login?: string;
  profile_picture?: string;
  bio?: string;
  institution?: string;
  degree?: string;
  branch?: string;
  graduation_year?: number;
  major?: string;
  dob?: string;
  gender?: string;
  country?: string;
  state?: string;
  city?: string;
  tenth_grade_percentage?: number;
  twelfth_grade_percentage?: number;
  btech_cgpa?: number;
  total_percentage?: number;
  technical_skills?: string;
  soft_skills?: string;
  certifications?: string;
  preferred_industry?: string;
  job_roles_of_interest?: string;
  location_preferences?: string;
  language_proficiency?: string;
  extracurricular_activities?: string;
  internship_experience?: string;
  project_details?: string;
  linkedin_profile?: string;
  github_profile?: string;
  personal_website?: string;
  resume?: string;
  tenth_certificate?: string;
  twelfth_certificate?: string;
  internship_certificates?: string;
  twelfth_institution?: string;
  twelfth_stream?: string;
  twelfth_year?: string;
  tenth_institution?: string;
  tenth_stream?: string;
  tenth_year?: string;
  profile_completion_percentage: number;
};

export type ProfileUpdateData = Partial<
  Pick<
    StudentProfile,
    | 'name'
    | 'phone'
    | 'bio'
    | 'institution'
    | 'degree'
    | 'branch'
    | 'graduation_year'
    | 'major'
    | 'dob'
    | 'gender'
    | 'country'
    | 'state'
    | 'city'
    | 'tenth_grade_percentage'
    | 'twelfth_grade_percentage'
    | 'btech_cgpa'
    | 'total_percentage'
    | 'technical_skills'
    | 'soft_skills'
    | 'certifications'
    | 'preferred_industry'
    | 'job_roles_of_interest'
    | 'location_preferences'
    | 'language_proficiency'
    | 'extracurricular_activities'
    | 'internship_experience'
    | 'project_details'
    | 'linkedin_profile'
    | 'github_profile'
    | 'personal_website'
    | 'twelfth_institution'
    | 'twelfth_stream'
    | 'twelfth_year'
    | 'tenth_institution'
    | 'tenth_stream'
    | 'tenth_year'
  >
>;

export type ProfileCompletionResponse = {
  completion_percentage: number;
  completed_fields: string[];
  missing_fields: string[];
  total_fields: number;
  completed_count: number;
  core_percentage?: number;
  extended_percentage?: number;
  core_completed_count?: number;
  core_total?: number;
  extended_completed_count?: number;
  extended_total?: number;
  core_missing_fields?: string[];
  can_apply_for_jobs?: boolean;
};

export const profileService = {
  getProfile: () => api.getStudentProfile() as Promise<StudentProfile>,
  updateProfile: (data: ProfileUpdateData) => api.updateStudentProfile(data) as Promise<StudentProfile>,
  getProfileCompletion: () => api.getStudentProfileCompletion() as Promise<ProfileCompletionResponse>,
  uploadResume: (file: File) => api.uploadStudentResume(file),
  uploadProfilePicture: (file: File) => api.uploadStudentProfilePicture(file),
  uploadCertificate: (file: File, type: string) => api.uploadStudentCertificate(file, type),
};
