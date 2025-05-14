export const createSlug = (str: string) => {
  return str
    ?.replace(/[،ًٌٍَُِّ؛ء«,ـ«<>:؟"{}|?!@#$%^&*()_+=~`'/\.\+]+/g, "")
    ?.replace(/[\s]+/g, " ");
};
