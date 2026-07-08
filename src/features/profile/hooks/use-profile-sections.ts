import type { UserT } from '@sharedTypes/auth';
import { formatDate } from '@utils/formatters';

type ProfileSection = {
  title: string;
  fields: { label: string; value?: string | null }[];
};

export const useProfileSections = (user: UserT | null | undefined): ProfileSection[] => [
  {
    title: 'Employee Details',
    fields: [
      {
        label: 'Employee Name',
        value: `${user?.emp_fname ?? ''} ${user?.emp_mname ?? ''} ${user?.emp_lname ?? ''}`.trim(),
      },
      { label: 'Gender', value: user?.emp_sex },
      { label: 'Birth Date', value: formatDate(user?.emp_birth_dt) },
      { label: 'Phone', value: user?.emp_phone },
      { label: 'Email', value: user?.emp_email },
      { label: 'Status', value: user?.emp_status },
    ],
  },

  {
    title: 'Employment',
    fields: [
      { label: 'Department', value: user?.emp_dept },
      { label: 'Parent Department', value: user?.parent_dept },
      { label: 'Designation', value: user?.emp_designation },
      { label: 'State Service', value: user?.state_service },
      { label: 'Office Name', value: `${user?.office_id} - ${user?.office_name}` },
      { label: 'DDO Code', value: user?.ddo_code },
      { label: 'DDO Name', value: user?.ddo_name },
      { label: 'Joining Date', value: formatDate(user?.emp_date_of_joining) },
      { label: 'Increment Date', value: formatDate(user?.inc_dt) },
      { label: 'Superannuation', value: formatDate(user?.emp_supan_dt) },
      { label: 'City Class', value: user?.emp_city_class },
      { label: 'Employee Type', value: user?.emp_type },
    ],
  },

  {
    title: 'Pay Details',
    fields: [
      { label: 'Pay Commission', value: user?.pay_comm },
      { label: 'Pay Scale', value: user?.pay_scale },
      { label: 'Basic Pay', value: user?.basic_pay },
      { label: 'W.E.F Date', value: formatDate(user?.wef_dt) },
    ],
  },

  {
    title: 'PF Details',
    fields: [
      { label: 'PF Type', value: user?.pf_type },
      { label: 'PF Agency', value: user?.pf_agency },
      { label: 'PF Series', value: user?.pf_series },
    ],
  },

  {
    title: 'GIS Details',
    fields: [
      { label: 'GIS Applicable', value: user?.gis_applicable },
      { label: 'Current GIS Group', value: user?.current_gis_group },
    ],
  },

  {
    title: 'Bank Details',
    fields: [
      { label: 'Account Number', value: user?.emp_bank_account_no },
      { label: 'IFSC', value: user?.emp_bank_ifsc },
    ],
  },
];
