export const hbsHelpers = {
  eq: (a: any, b: any) => {
    return a == b; // usa == para evitar problema string vs number
  },
  gte: function (a: number, b: number) {
    return a >= b;
  },
};
