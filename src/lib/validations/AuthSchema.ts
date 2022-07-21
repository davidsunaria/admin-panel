import { useMemo } from "react";
import * as Yup from "yup";
import { PASSWORD_REQUIRED, OTP_REQUIRED,DATE_REQUIRED, EMAIL_REQUIRED, CONFIRM_PASSWORD_MATCH, REENTER_PASSWORD,RADIO_REQUIRED } from '../message';

const useAuthValidation = () => {

  const LoginSchema = useMemo(() => Yup.object({
    email: Yup
      .string()
      .email()
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
      .email()
      .required(EMAIL_REQUIRED),
  }), []);


  const ResetPasswordSchema = useMemo(() => Yup.object({
    otp: Yup
      .string()
      .required(OTP_REQUIRED),
    email: Yup
      .string()
      .email()
      .required(EMAIL_REQUIRED),
    password: Yup
      .string()
      .required(PASSWORD_REQUIRED),
    password_confirmation: Yup
      .string()
      .required(REENTER_PASSWORD)
      .oneOf([Yup.ref('password'), null], CONFIRM_PASSWORD_MATCH)
  }), []);

  const InviteUserSchema = useMemo(() => Yup.object({
    email: Yup
      .string()
      .email()
      .required(EMAIL_REQUIRED)
  }), []);

  const PremiumSchema = useMemo(() => Yup.object({
    type: Yup
      .string()
      .required(RADIO_REQUIRED),
      expire_at_unix: Yup
      .string()
      .required(DATE_REQUIRED),
  }), []);

  return { LoginSchema, VerifyOtpSchema, ForgotPasswordSchema, ResetPasswordSchema, InviteUserSchema,PremiumSchema };
}

export { useAuthValidation };