import { Audio, AVPlaybackStatusSuccess } from 'expo-av';

let sound: Audio.Sound | null = null;
let onPlaybackUpdate: ((status: AVPlaybackStatusSuccess) => void) | null = null;
let activeReaderId: string | null = null;

export const setActiveReader = (id: string) => {
    activeReaderId = id;
};

export const audioPlayer = {
    async play(track: { uri: string }, onUpdate?: (status: AVPlaybackStatusSuccess) => void) {
        await this.stop();
        const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: track.uri },
            { shouldPlay: true },
            (status) => {
                if (status.isLoaded && onUpdate) onUpdate(status as AVPlaybackStatusSuccess);
            }
        );
        sound = newSound;
        onPlaybackUpdate = onUpdate || null;
    },

    async pause(readerId?: string) {
        if (!sound || (readerId && readerId !== activeReaderId)) return;
        const status = await sound.getStatusAsync();
        if ((status as AVPlaybackStatusSuccess).isPlaying) {
            await sound.pauseAsync();
        }
    },

    async resume(readerId?: string) {
        if (!sound || (readerId && readerId !== activeReaderId)) return;
        const status = await sound.getStatusAsync();
        if (!(status as AVPlaybackStatusSuccess).isPlaying) {
            await sound.playAsync();
        }
    },

    async stop() {
        if (sound) {
            await sound.unloadAsync();
            sound = null;
            onPlaybackUpdate = null;
        }
    },

    async seekTo(positionMillis: number, readerId?: string) {
        if (!sound || (readerId && readerId !== activeReaderId)) return;
        await sound.setPositionAsync(positionMillis);
    },

    async getStatus() {
        if (!sound) return null;
        return (await sound.getStatusAsync()) as AVPlaybackStatusSuccess;
    },
};
