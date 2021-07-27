export const ST_REGEX = {
  FName: '^[a-zA-Z]{2,15}$',
  LName: '^[a-zA-Z]{2,15}$',
  FullName: '^[a-zA-Z]{2,30}(\\s){0,1}[a-zA-Z]{0,30}$',
  Email:
    '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,4})$',
  Mobile: '^[6789]{1}[0-9]{9}$',
  Password: '^[a-zA-Z0-9]{6}$',
  Address: '^[0-9a-zA-Z\s,-]+$',
  BankAccount: '^\d{5,10}$',
  BranchCode: '^\d{5,8}$',
};

export const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
export const TIME_OPTIONS = ['FIRST TIME', '2020', '2019', '2018', '2017'];
export const YES_NO = [{id:1, value:'Yes'}, {id:0, value:'No'}];
export const RELATIONS = ['Father', 'Mother', 'Wife', 'Son', 'Daughter'];


export const ErrorStrings = {
  InvalidFName:'Please enter valid first name.',
  InvalidLName:'Please enter valid last name.',
  InvalidLName:'Please enter valid last name.',

};