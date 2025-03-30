export interface IPet {
  id: number;
  name: string;
  dob: Date;
  gender: Gender;
  breed: string;
  size: Size;
  neutered: boolean;
  behaviour?: string;
  allergies?: string;
  picture?: string;
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

export enum Size {
  SMALL = "Small (0-15kg)",
  MEDIUM = "Medium (15-30kg)",
  LARGE = "Large (30kg+)",
}