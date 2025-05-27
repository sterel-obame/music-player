export type MusicItem = {
    id: string;
    title: string;
    uri: string;
    filename: string;
    duration: number;
    artist?: string;
};

export type Playlist = {
    id: string;
    name: string;
    tracks: any[];
};

export type AudioTrack = {
    id: string;
    title: string;
    artist?: string;
    uri: string;
};
