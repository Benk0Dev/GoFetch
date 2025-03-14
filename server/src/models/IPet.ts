export interface IPet {
  id: number;
  name: string;
  dob: Date;
  gender: IGender;
  breed: string;
  weight: number;
  neutered: boolean;
  behaviour: string;
  allergies: string[];
  pictures: string[];
}

export enum IGender {
  MALE = 'male',
  FEMALE = 'female'
}