export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  occupation: string;
  gender: string;
  dateOfBirth: string; 
  photo?: string;
  age?: number; 
  createdDate?: Date;
}
