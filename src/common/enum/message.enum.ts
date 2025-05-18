export enum BadRequestMessage {
  InValidLoginData = "اصلاعات ارسال شده برای ورود صحیح نمیباشد",
  InValidRegisterData = "اصلاعات ارسال شده برای ثبت نام صحیح نمیباشد",
  SometingWrong = "خطایی پیش آمده. دوباره تلاش کنید.",
  InvalidCategory = "دسته بندی را به درستی وارد کنید.",
  AlreadyAccepted = "نظر انتخاب شده قبلا تایید شده است.",
  AlreadyRejected = "نظر انتخاب شده قبلا رد شده است.",
}

export enum AuthMessage {
  NotFoundAccount = "حساب کاربری یافت نشد",
  AlreadyExistAccount = "حساب کاربری با این مشخصات قبلا ثبت شده",
  ExpiredCode = "کد تایید منقضی شده لطفا مجدد تلاش کنید.",
  TryAgain = "لطفا دوباره تلاش کنید.",
  LoginAgain = "مجدد وارد حساب کاربری خود شوید.",
  LoginRequired = "وارد حساب کاربری خود شوید.",
  Blocked = "حساب کاربری شما مسدود شده است.",
}

export enum NotFoundMessage {
  NotFound = "موردی یافت نشد.",
  NotFoundCategory = "دسته بندی یافت نشد.",
  NotFoundPost = "مقاله ای یافت نشد.",
  NotFoundUser = "کاربری یافت نشد.",
}

export enum ValidationMessage {
  IvalidImageFormat = "فرمت عکس ارسال شده صحیح نمیباشد.",
  InvalidEmailFormat = "ایمیل وارد شده صحیح نمیباشد.",
  InvalidPhoneFormat = "شماره موبایل وارد شده صحیح نمیباشد.",
}

export enum PublicMessage {
  SendOtp = "کد یکبار مصرف با موفقیت ارسال شد.",
  LoggedIn = "با موفقیت وارد حساب کاربری خود شدید.",
  Created = "با موفقت ایجاد شد.",
  Deleted = "با موفقت حذف شد.",
  Updated = "با موفقت به روز رسانی شد.",
  Inserted = "با موفقت درج شد.",
  Like = "لایک شد.",
  DissLike = "دیس لایک شد.",
  Bookmark = "ذخیره شد.",
  UnBookmark = "از لیست ذخیره شده ها خارج شد.",
  CreateComment = "نظر شما ثبت شد.",
  Follow = "فالو شد.",
  UnFollow = "آنفالو شد",
  Blocked = "حساب کاربری مسدود شد.",
  UnBlocked = "حساب کاربری از مسدودی درآمد.",
}

export enum ConflictMessage {
  CategoryTitle = "عنوان دسته بندی قبلا ایجاد شده.",
  Email = "ایمیل وارد شده از قبل وجود دارد.",
  Phone = "شمار موبایل وارد شده از قبل وجود دارد.",
  Username = "نام کاربری وارد شده از قبل وجود دارد.",
}