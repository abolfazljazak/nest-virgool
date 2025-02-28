export enum BadRequestMessage {
  InValidLoginData = "اصلاعات ارسال شده برای ورود صحیح نمیباشد",
  InValidRegisterData = "اصلاعات ارسال شده برای ثبت نام صحیح نمیباشد",
}

export enum AuthMessage {
  NotFoundAccount = "حساب کاربری یافت نشد",
  AlreadyExistAccount = "حساب کاربری با این مشخصات قبلا ثبت شده",
  ExpiredCode = "کد تایید منقضی شده لطفا مجدد تلاش کنید.",
  TryAgain = "لطفا دوباره تلاش کنید.",
  LoginAgain = "مجدد وارد حساب کاربری خود شوید.",
  LoginRequired = "وارد حساب کاربری خود شوید.",
}

export enum NotFoundMessage {}

export enum ValidationMessage {}

export enum PublicMessage {
  sendOtp = "کد یکبار مصرف با موفقیت ارسال شد.",
  LoggedIn = "با موفقیت وارد حساب کاربری خود شدید.",
  Created = "با موفقت ایجاد شد.",
}