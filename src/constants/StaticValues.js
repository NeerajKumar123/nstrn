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

export const stripekey_test = 'pk_test_51I8rlGBHi8nqbGSxAKVuVuxEit58oIMidFfbncCMy5GiAoDPoMIR2v9u87I29FOHcQ0ipuIyje0puIUpOPjSngqK00I7UTmxka'
export const stripekey_live = 'pk_live_51I8rlGBHi8nqbGSxLUoRmQIMdKS2IupbsgiNJertoE7QEB0kHwQnBOepeKaE2Fgp6mSVOAIbPeByVHcK6Q3d8NjR00pN3scqwz'
export const stripeAccountId = 'acct_1I8rlGBHi8nqbGSx'

