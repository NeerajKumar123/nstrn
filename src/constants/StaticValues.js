export const ST_REGEX = {
  Name: '^[a-zA-Z]{2,30}$',
  FullName: '^[a-zA-Z]{2,30}(\\s){0,1}[a-zA-Z]{0,30}$',
  Email:
    '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,4})$',
  Mobile: '^[6789]{1}[0-9]{9}$'
};