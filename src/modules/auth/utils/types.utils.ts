export interface UserSignupData {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}
export interface UserLoginData {
  email: string;
  password: string;
}
