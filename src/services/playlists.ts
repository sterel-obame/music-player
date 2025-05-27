import * as SecureStore from 'expo-secure-store';
import { Playlist } from 'src/types';

const PLAYLISTS_KEY = 'customPlaylists';

export const getPlaylists = async (): Promise<Playlist[]> => {
    const data = await SecureStore.getItemAsync(PLAYLISTS_KEY);
    return data ? JSON.parse(data) : [];
};

export const savePlaylists = async (playlists: Playlist[]) => {
    await SecureStore.setItemAsync(PLAYLISTS_KEY, JSON.stringify(playlists));
};

export const createPlaylist = async (name: string): Promise<Playlist[]> => {
    const playlists = await getPlaylists();
    const newPlaylist: Playlist = {
        id: Date.now().toString(),
        name,
        tracks: [],
    };
    const updated = [...playlists, newPlaylist];
    await savePlaylists(updated);
    return updated;
};

export const addTrackToPlaylist = async (playlistId: string, track: any): Promise<Playlist[]> => {
    const playlists = await getPlaylists();
    const updated = playlists.map((pl) =>
        pl.id === playlistId && !pl.tracks.find((t) => t.id === track.id)
        ? { ...pl, tracks: [...pl.tracks, track] }
        : pl
    );
    await savePlaylists(updated);
    return updated;
};
