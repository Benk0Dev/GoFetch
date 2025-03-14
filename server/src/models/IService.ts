export interface IService {
    id: number;
    type: IType;
    duration: number;
    price: number;
}

export enum IType {
    WALK = "walk",
    SIT = "sit",
    BOARD = "board",
    GROOM = "groom",
    TRAIN = "train",
    OTHER = "other",
}