import { makeVar } from '@apollo/client';
import type { IUser } from '@gorent/shared';

export const isAuthenticatedVar = makeVar<boolean>(false);
export const userVar = makeVar<IUser | null>(null);
export const isLoadingVar = makeVar<boolean>(true);
