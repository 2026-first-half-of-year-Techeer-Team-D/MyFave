export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const isValidEmail = (value: string): boolean => EMAIL_REGEX.test(value.trim())

export const PHONE_REGEX = /^01[0-9]-\d{4}-\d{4}$/

export const isValidPhone = (value: string): boolean => PHONE_REGEX.test(value.trim())
