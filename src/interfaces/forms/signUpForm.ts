// import { Image } from "next-auth/providers/42-school";

export interface SignUpForm {
  // avatar: Image;
  name: string;
  lastname: string;
  documentTypeId: number;
  document: string;
  email: string;
  password: string;
}
