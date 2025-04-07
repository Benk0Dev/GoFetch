import fs from 'fs';
import { INewSuspension, ISuspension } from '@gofetch/models/ISuspension';
import { cache, DB_PATH } from '@server/utils/Cache';
import { editUser } from '@server/static/UserStatic';

export function getCachedSuspensions(): ISuspension[] {
    try {
        return cache.suspensions;
    }
    catch (error) {
        return [];
    }
}

export function addSuspensionCached(suspension: INewSuspension) {
    const newId = cache.suspensions.length > 0 ? cache.suspensions[cache.suspensions.length - 1].id + 1 : 1;
    const newSuspension: ISuspension = {
        id: newId,
        userId: suspension.userId,
        reason: suspension.reason,
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + suspension.duration * 24 * 60 * 60 * 1000),
    };

    cache.suspensions.push(newSuspension);

    saveSuspensionsToFile(cache.suspensions);

    return { success: true, message: 'Suspensions added successfully!', suspension: newSuspension };
}

export function removeSuspensionCached(id: number) {
    const index = cache.suspensions.findIndex(suspension => suspension.id === id);
    if (index !== -1) {
        const userId = cache.suspensions[index].userId;
        cache.suspensions.splice(index, 1);
        saveSuspensionsToFile(cache.suspensions);
        return { success: true, message: 'Suspension removed successfully!' };
    } else {
        return { success: false, message: 'Suspension not found!' };
    }
}
export function saveSuspensionsToFile(suspensions: ISuspension[]) {
    fs.writeFileSync(`${DB_PATH}/suspensions.json`, JSON.stringify(suspensions, null, 2), 'utf8');
}