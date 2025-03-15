// validationSchema.js
import * as yup from 'yup';

export const passwordValidationSchema = yup.object({
  password: yup
    .string()
    .min(8, 'Minimum 8 characters')
    .matches(/[a-z]/, 'A lowercase letter is required')
    .matches(/[A-Z]/, 'An uppercase letter is required')
    .matches(/[0-9]/, 'A number is required')
    .required('Password is required'),
});

export const signUpSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Minimum 8 characters')
    .matches(/[a-z]/, 'A lowercase letter is required')
    .matches(/[A-Z]/, 'An uppercase letter is required')
    .matches(/[0-9]/, 'A number is required')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export const signInSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});
