// services/favorites.ts
import * as SecureStore from 'expo-secure-store';

const FAVORITES_KEY = 'favoriteTracks';

export const getFavorites = async () => {
    const data = await SecureStore.getItemAsync(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveFavorites = async (favorites: any[]) => {
    await SecureStore.setItemAsync(FAVORITES_KEY, JSON.stringify(favorites));
};

export const toggleFavorite = async (track: any) => {
    const favorites = await getFavorites();
    const exists = favorites.find((t: any) => t.id === track.id);
    let updated;

    if (exists) {
        updated = favorites.filter((t: any) => t.id !== track.id);
    } else {
        updated = [...favorites, track];
    }

    await saveFavorites(updated);
    return updated;
};

export const isTrackFavorite = async (track: any) => {
    const favorites = await getFavorites();
    return favorites.some((t: any) => t.id === track.id);
};
