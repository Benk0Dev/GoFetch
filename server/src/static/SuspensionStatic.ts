import { INewSuspension } from '@gofetch/models/ISuspension';
import { addSuspensionCached } from '@server/services/SuspensionCached';
import { cache } from '@server/utils/Cache';

export function getSuspensionByID(suspensionId: number) {
    const suspension = cache.suspensions.find(suspension => suspension.id === suspensionId);
    if (suspension) {
        return { success: true, suspension };
    }
    return { success: false, message: 'Suspension not found' };
}

export function addSuspension(suspension: INewSuspension) {
    return addSuspensionCached(suspension);
}
