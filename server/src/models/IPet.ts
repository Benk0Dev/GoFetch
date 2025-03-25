export interface IPet {
  id: number;
  name: string;
  dob: Date;
  gender: EGender;
  breed: string;
  size: ESize;
  neutered: boolean;
  behaviour?: string;
  allergies?: string;
  picture?: string;
}

export enum EGender {
  MALE = 'male',
  FEMALE = 'female'
}

export enum ESize {
  SMALL = "Small (0-15kg)",
  MEDIUM = "Medium (15-30kg)",
  LARGE = "Large (30kg+)",
}