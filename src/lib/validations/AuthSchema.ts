import { useMemo } from "react";
import * as Yup from "yup";
import { PASSWORD_REQUIRED, OTP_REQUIRED, EMAIL_REQUIRED, CONFIRM_PASSWORD_MATCH, REENTER_PASSWORD } from '../message';

const useAuthValidation = () => {

  const LoginSchema = useMemo(() => Yup.object({
    email: Yup
      .string()
      .required(EMAIL_REQUIRED),

    password: Yup
      .string()
      .required(PASSWORD_REQUIRED),
  }), []);

  const VerifyOtpSchema = useMemo(() => Yup.object({
    otp: Yup
      .string()
      .required(OTP_REQUIRED),//labelData.frontLabels.welcome_back
  }), []);


  const ForgotPasswordSchema = useMemo(() => Yup.object({
    email: Yup
      .string()
      .required(EMAIL_REQUIRED),
  }), []);


  const ResetPasswordSchema = useMemo(() => Yup.object({
    otp: Yup
      .string()
      .required(OTP_REQUIRED),
    email: Yup
      .string()
      .required(EMAIL_REQUIRED),
    password: Yup
      .string()
      .required(PASSWORD_REQUIRED),
    password_confirmation: Yup
      .string()
      .required(REENTER_PASSWORD)
      .oneOf([Yup.ref('password'), null], CONFIRM_PASSWORD_MATCH)
  }), []);

  return { LoginSchema, VerifyOtpSchema, ForgotPasswordSchema, ResetPasswordSchema };
}

export { useAuthValidation };