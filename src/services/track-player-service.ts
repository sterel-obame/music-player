import { Capability, AppKilledPlaybackBehavior } from 'react-native-track-player'
import TrackPlayer from 'react-native-track-player'

export async function trackPlayerService() {
    await TrackPlayer.updateOptions({
        android: {
            appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
        ],
        compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
        ],
        alwaysPauseOnInterruption: true,
    })
}
