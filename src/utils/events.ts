// utils/events.ts
import { EventEmitter } from 'expo-modules-core';

type AppEvents = {
    favoriteUpdated: ()=> void; // ← on n'envoie pas de payload
    playlistsUpdated: () => void; // ← nouveau
    playlistUpdated: () => void; // 👈 nouveau
    readerActivated: (id: string) => void; // chaque lecteur s’identifie par un ID
};

export const appEvents = new EventEmitter<AppEvents>();
