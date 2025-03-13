// import Interfaces
import IUser from '../model/IUser';
import IPet from '../model/IPet';

import { getUsersData, getPetsData } from '../utils/data';

export function AllUsersData() {
    const usersFileContent = getUsersData();
    const usersData = JSON.parse(usersFileContent);
    const users = usersData as IUser[];

    const petsFileContent = getPetsData();
    const petsData = JSON.parse(petsFileContent);
    const pets = petsData as IPet[];

    users.forEach(user => {
        const petIds = (user as any).pets || [];
        const userPets = pets.filter(pet => petIds.includes(pet.id));
        user.pets = userPets;
    });

    return users;
}