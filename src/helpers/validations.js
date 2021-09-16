import { numbersFormatter } from './general-helper'

export function isEmailValid(mail) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(mail);
  }

export const isValidMobilePhone = (phone) => {
    return phone.length === 11 && (phone[0] === '0' || phone[0] === '۰') && (phone[1] === '9' || phone[1] === '۹') && (/^\d+$/.test(phone) || /^\d+$/.test(numbersFormatter( phone, 'en')))
} 

export const isValidPostalCode = (code) => {
    return code.length === 10  && (/^\d+$/.test(code) || /^\d+$/.test(numbersFormatter( code, 'en')))
}

export const isValidPhone = (phone) => {
    return phone.length === 8 && /^\d+$/.test(phone)
} 

export const AddressFormValidation = ({
    postalCode,
    address,
    mobilePhone,
    phone
}) => {
    let message = ''
    let isValid = true

    const postalCodeValid = postalCode && isValidPostalCode(postalCode)
    const addressValid = address && typeof(address) === 'string' && 1 < address.length < 130
    const mobilePhoneValid = mobilePhone && isValidMobilePhone(mobilePhone)
    const phoneValid = phone ?  typeof(phone) === 'string' && 5<= phone.length <=11 && /^\d+$/.test(phone) : true
    if (!postalCodeValid) {
        isValid = false
        message = 'کدپستی باید ده رقم باشد.'
    } else if (!addressValid) {
        isValid = false
        message = 'آدرس باید تکمیل شود. حداکثر ۱۳۰ کاراکتر قابل استفاده می باشد.'
    } else if (!mobilePhoneValid) {
        isValid = false
        message = 'شماره موبایل خود را به درستی وارد نمایید. شماره باید با ۰۹ آغاز شود و ۱۱ رقم داشته باشد.'
    } else if (!phoneValid) {
        isValid = false
        message = 'شماره تلفن خود را به درستی وارد نمایید. شماره تلفن باید حداقل ۵ و حداکثر ۱۱ رقم داشته باشد.'
    }
    return { message, isValid }
}

export const EditMobileFormValidation = ({
    mobilePhone   
}) => {
    let message = ''
    let isValid = true

    const mobilePhoneValid = mobilePhone && isValidMobilePhone(mobilePhone)
    if (!mobilePhoneValid) {
        isValid = false
        message = 'شماره موبایل خود را به درستی وارد نمایید. شماره باید با ۰۹ آغاز شود و ۱۱ رقم داشته باشد.'
    } 
    return { message, isValid }
}

export function isUsernameValid (username) {
  return username && (isEmailValid(username) || isValidMobilePhone(username))
}

export function registerFormValidation({
  name,
  lastname,
  username,
  password,
  passwordAgain,
  terms,
}) {
  let usernameValid = isUsernameValid(username);
  let passwordValid = password === passwordAgain;
  let isValid = name && lastname && usernameValid && passwordValid && terms;

  let message = "";
  if (!usernameValid) {
    message = "ایمیل یا شماره تلفن خود را به طور صحیح وارد نمایید.";
  } else if (!passwordValid) {
    message = "گذرواژه یکسان نیست.";
  } else if (!isValid) {
    message = "لطفا فرم را با دقت پر کنید.";
  }

  return { isValid, message };
}

export function loginFormValidation({ username, password }) {
  let usernameValid = isUsernameValid(username)
  let passwordValid = !!password;
  let isValid = usernameValid && passwordValid;

  let message = "";
  if (!usernameValid) {
    message = "رایانامه معتبر نیست.";
  } else if (!passwordValid) {
    return "گذرواژه معتبر نیست.";
  }

  return { isValid, message };
}

