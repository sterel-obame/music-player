export type BottomTabParamList = {
    'favorites': undefined;
    'playlists': undefined;
    'music': {
        screen?: string;
        params?: {
            trackId: string;
        };
    };
    'artist': undefined;
};

export type MusicStackParamList = {
    MusicList: undefined;
    TrackDetail: { trackId: string };
};