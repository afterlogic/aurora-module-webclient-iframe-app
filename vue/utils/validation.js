export const isValidHttpURL = (text) => {
  const regExp = /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?$/
  return regExp.test(text)
}
