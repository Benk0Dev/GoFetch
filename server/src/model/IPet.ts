export default interface IPet {
    id: number;
    ownerId: number;
    name: string;
    type: string;
    breed: string;
    age: number;
    weight: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}