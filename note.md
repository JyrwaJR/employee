# RPC Response Requirements

## RPC Method: `get_employee_details`

### Required Response

```ts
{
  data: {
    emp_cd: string;
    emp_fname: string;
    emp_mname: string;
    emp_lname: string;
    emp_birth_dt: string;
    emp_sex: 'M' | 'F' | 'O';

    // New Fields
    // emp_status: string;
    emp_available_leaves_days: number;
    emp_designation: Designation;
    emp_dept: string;
    emp_email: string;
    emp_address: string;
    emp_phone: string;
    emp_city_class: 'X' | 'Y' | 'Z';
    emp_pay_level: number;
    emp_pay_cell: number;
    emp_date_of_joining: string;

    // Bank Details
    emp_pan_number: string | null;
    emp_pran_number: string | null;
    emp_cghs_card_no: string | null;
    emp_uan_number: string | null;
    emp_bank_account_no: string | null;
    emp_bank_ifsc: string | null;
  }
}
```

## RPC Method: `get_salary_statement_details` // new API

### Required Response

```ts
{
  data: {
    id: string;
    employee_id: string;
    month: MonthT;
    year: number;
    status: 'PENDING' | 'PROCESSED' | 'PAID' | 'FAILED' | 'HELD';
    payment_date: string | null;

    basic_pay: string;
    da: string;
    hra: string;
    transport_allow: string;
    da_on_ta: string;
    npa: string;
    sba: string;
    arrears: string;
    bonus: string;
    total_earnings: string;

    nps_tier_1: string;
    cghs: string;
    cgegis: string;
    license_fee: string;
    income_tax: string;
    prof_tax: string;
    gpf: string;
    recovery: string;
    total_deductions: string;

    net_payable: string;
    remarks: string;
    generated_by: string | null;
    created_at: string;
  }
}
```

## RPC Method: `get_salary_statements` // new api

### Required Response

```ts
{
  data: Array<{
    id: string;
    employee_id: string;
    month: MonthT;
    year: number;
    status: 'PENDING' | 'PROCESSED' | 'PAID' | 'FAILED' | 'HELD';
    payment_date: string | null;

    basic_pay: string;
    da: string;
    hra: string;
    transport_allow: string;
    da_on_ta: string;
    npa: string;
    sba: string;
    arrears: string;
    bonus: string;
    total_earnings: string;

    nps_tier_1: string;
    cghs: string;
    cgegis: string;
    license_fee: string;
    income_tax: string;
    prof_tax: string;
    gpf: string;
    recovery: string;
    total_deductions: string;

    net_payable: string;
    remarks: string;
    generated_by: string | null;
    created_at: string;

    structure: {
      id: string;
      employee_id: string;
      basic_pay: string;
      da_rate: string;
      hra_fixed: string | null;
      transport_allow: string;
      npa: string;
      is_nps_active: boolean;
      cghs_tier_amount: string;
      cgegis_amount: string;
      license_fee: string;
      effective_date: string;
      updated_at: string;
    };
  }>;
}
```

## RPC Method: `get_announcements`// new api

### Required Response

```ts
{
  data: Array<{
    id: string;
    title: string;
    description: string;
    category: 'HOLIDAY' | 'NOTICE' | 'PERSONAL' | 'GLOBAL';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    isRead: boolean;
    createdAt: string;
    metadata?: Record<string, string>;
  }>;
}
```

---

## RPC Method: `get_announcement_details` // new api

### Required Response

```ts
{
  data: {
    id: string;
    title: string;
    description: string;
    category: 'HOLIDAY' | 'NOTICE' | 'PERSONAL' | 'GLOBAL';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    isRead: boolean;
    createdAt: string;
    metadata?: Record<string, string>;
  };
}
```
