/* eslint-disable eqeqeq */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-var */
export const checkAllFields = (obj) => {
  var isNull = true;
  for (const key in obj) {
    if (obj[key] === null || obj[key] === '') {
      isNull = false;
      return isNull;
    }
  }
  return isNull;
};
