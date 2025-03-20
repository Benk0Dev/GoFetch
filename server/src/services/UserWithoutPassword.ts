import { ILoginDetails, IUser } from "../models/IUser";

export function getUserWithoutPassword(user: IUser): Omit<IUser, "userDetails"> & { userDetails: Omit<IUser["userDetails"], "loginDetails"> & { loginDetails: Omit<ILoginDetails, "password"> } } {
    const { userDetails: { loginDetails: { password, ...loginDetailsWithoutPassword }, ...otherUserDetails }, ...restUser } = user;

    return {
        ...restUser,
        userDetails: {
            ...otherUserDetails,
            loginDetails: loginDetailsWithoutPassword
        }
    };
}
