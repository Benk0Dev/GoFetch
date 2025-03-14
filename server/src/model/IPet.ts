export default interface IPet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: number;
  weight: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}