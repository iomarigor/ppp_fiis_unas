//generar String randon
const generateRandomString = (num) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result1 = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result1;
};
//generar X
const generateX = (lenght) => {
  let res = "";
  for (let i = 0; i < lenght; i++) {
    res += "x";
  }
  return res;
};
//obtener fecha hoy
const getNowDate = () => {
  var today = new Date();
  const date =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1 < 10
      ? `0${today.getMonth() + 1}`
      : today.getMonth() + 1) +
    "-" +
    (today.getDate() < 10 ? `0${today.getDate()}` : today.getDate());
  return date;
};
export { generateRandomString, generateX, getNowDate };
