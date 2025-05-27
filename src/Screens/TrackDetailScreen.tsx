import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, FlatList, Pressable, Dimensions, Platform } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { AVPlaybackStatusSuccess } from 'expo-av';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { isTrackFavorite, toggleFavorite } from 'services/favorites';
import { appEvents } from 'utils/events';
import { Playlist } from 'src/types';
import { getPlaylists } from 'services/playlists';
import QueueBottomSheet from 'Components/QueueBottomSheet';
import { audioPlayer, setActiveReader } from 'context/audioPlayer';
import { loadPreference, savePreference } from 'services/preferences';
import AutoScrollingText from 'Components/AutoScrollingText';
import RotatingImage from 'Components/RotatingImage';
import Colors from 'src/Constants/Colors';


type RepeatMode = 'off' | 'all' | 'one';
const TrackDetailScreen = () => {
    const {width} = Dimensions.get('screen')
    const route = useRoute();
    const { playlist, currentIndex, from } = route.params as { playlist: any[]; currentIndex: number; from?: string };
    const navigation = useNavigation<any>();

    const [index, setIndex] = useState(currentIndex);
    const [track, setTrack] = useState(playlist[currentIndex]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
    const [isShuffle, setIsShuffle] = useState(false);
    const [duration, setDuration] = useState(1);
    const [position, setPosition] = useState(0);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [showQueue, setShowQueue] = useState(false);
    
    const [isRotating, setIsRotating] = useState(true);

    // @ts-ignore
    const soundRef = useRef<audioPlayer | null>(null);
    const readerId = useRef(`${Date.now()}-${Math.random()}`).current;

    const isFromFavorites = route?.name === 'TrackDetail' && from === 'Favorites';
    useEffect(() => {
        loadTrackByIndex(index);
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, [index]);

    useEffect(() => {
        const checkFavorite = async () => {
            const fav = await isTrackFavorite(track);
            setIsFavorite(fav);
        };
        checkFavorite();
    
        const listener = appEvents.addListener('favoriteUpdated', async () => {
            const fav = await isTrackFavorite(track);
            setIsFavorite(fav);
        });
    
        return () => {
            listener.remove();
        };
    }, [track]);

    useEffect(() => {
        const sub = appEvents.addListener('playlistsUpdated', () => {
            // recharger les playlists depuis getPlaylists()
        });
        return () => sub.remove();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            appEvents.emit('readerActivated', readerId);
            setActiveReader(readerId);

            const sub = appEvents.addListener('readerActivated', async (incomingId: string) => {
                if (incomingId !== readerId && soundRef.current) {
                    await soundRef.current.pauseAsync();
                    setIsPlaying(false);
                }
            });

            return () => sub.remove();
        }, [])
    );

    useEffect(() => {
        const loadPrefs = async () => {
            const savedShuffle = await loadPreference('shuffle', 'false');
            const savedRepeat = await loadPreference('repeatMode', 'off');
            setIsShuffle(savedShuffle === 'true');
            setRepeatMode(savedRepeat as any);
        };
        loadPrefs();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <AutoScrollingText
                    fontSize={20} // Taille de la police
                    color={Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary}
                    // duration={70000} // Durée de l'animation (ms)
                    style={{ fontWeight: 'bold', width:'100%' }} // Style supplémentaire   
                >
                    🎵 {track.title || 'Titre inconnu'} 🎶
                </AutoScrollingText>
            ),
            headerLeft: () => (
                <Ionicons 
                    name="chevron-back-circle" 
                    size={34} 
                    color={Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary} 
                    style={{ marginHorizontal: 15 }}
                    onPress={() => navigation.goBack()}
                />
            ),
        });
    }, [track.title]);


    const loadTrackByIndex = async (i: number) => {
        const selectedTrack = playlist[i];
        setTrack(selectedTrack);
        setPosition(0);
        setDuration(1);
        setIsPlaying(true);

        await audioPlayer.play(selectedTrack, (status) => {
            setPosition(status.positionMillis);
            if (status.durationMillis) setDuration(status.durationMillis);
            if (status.didJustFinish) {
                if (repeatMode === 'one') {
                    audioPlayer.seekTo(0);
                    audioPlayer.resume();
                } else {
                    handleNext();
                }
            }
        });
    };

    const handlePlayPause = async () => {
        const status = await audioPlayer.getStatus();
        if (!status) return;

        if (status.isPlaying) {
            await audioPlayer.pause();
            setIsPlaying(false);
            setIsRotating(false);
        } else {
            await audioPlayer.resume();
            setIsPlaying(true);
            setIsRotating(true);
        }
    };


    const handleNext = () => {
        let nextIndex = isShuffle
        ? Math.floor(Math.random() * playlist.length)
        : index + 1;

        if (nextIndex >= playlist.length) {
            if (repeatMode === 'all') nextIndex = 0;
            else return;
        }

        setIndex(nextIndex);
    };

    const handlePrevious = async () => {
        const status = await audioPlayer.getStatus();
        if ((status?.positionMillis ?? 0) > 3000) {
            await audioPlayer.seekTo(0);
            return;
        }
        let prevIndex = index - 1;
        if (prevIndex < 0) {
            if (repeatMode === 'all') prevIndex = playlist.length - 1;
            else return;
        }
        setIndex(prevIndex);
    };


    const cycleRepeatMode = () => {
        const next = repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off';
        setRepeatMode(next);
        if (soundRef.current) {
        soundRef.current.setIsLoopingAsync(next === 'one');
        }
    };

    const toggleShuffle = () => {
        setIsShuffle(!isShuffle);
    };

    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // on ouvre le modal des Playlists
    const openPlaylistModal = async () => {
        const updated = await getPlaylists();
        setPlaylists(updated);
        setShowPlaylistModal(true);
        setShowQueue(false)//moi-même je l'ai ajouté pour gérer le modal et la playlist 
    };
    
    return (
        <Fragment>
            <View style={styles.container}>
                <View style={{marginHorizontal:width*0.1, marginTop: 32}}>
                    <RotatingImage
                        source={require('../../assets/musiq.jpg')}
                        size={200}
                        borderColor={Platform.OS === 'android' ? Colors.platform.android.primary : Colors.platform.ios.primary}
                        borderRadius={100}
                        speed={10000} 
                        isRotating={isRotating}
                    />
                </View>

                <View style={styles.trackHeader}>
                    <View style={{paddingRight:25, height:58}}>
                        <AutoScrollingText 
                            fontSize={20}
                        >
                            🎵 {track.title || 'Titre inconnu'} 🎶
                        {/* <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>{track.title || 'Titre inconnu'}</Text> */}
                        </AutoScrollingText>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.artist}>{track.artist || 'Artiste inconnu'}</Text>
                    </View>
                </View>

                <View style={styles.optionsRow}>
                    <TouchableOpacity 
                        onPress={() => {
                            const next = repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off';
                            setRepeatMode(next);
                            savePreference('repeatMode', next);
                        }}
                    >
                        <View style={{ position: 'relative' }}>
                            <Ionicons name="repeat" size={24} color={repeatMode !== 'off' ? Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary : '#aaa'} />
                            {repeatMode === 'one' && (
                                <Text style={styles.repeatOne}>1</Text>
                            )}
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={openPlaylistModal}>
                        <Ionicons name="add-circle" size={24} color="#aaa" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => {
                            const next = !isShuffle;
                            setIsShuffle(next);
                            savePreference('shuffle', next.toString());
                        }}
                    >
                        <Ionicons name="shuffle" size={24} color={isShuffle ? Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary : '#aaa'} />
                    </TouchableOpacity>

                    {/* bouton playlist */}
                    <TouchableOpacity onPress={() => setShowQueue(true)}>
                        <Ionicons name="list" size={24} color="#fff" />
                    </TouchableOpacity>

                    {!isFromFavorites && (
                        <TouchableOpacity
                            onPress={async () => {
                            const updated = await toggleFavorite(track);
                            appEvents.emit('favoriteUpdated');
                            setIsFavorite(updated.some((t: any) => t.id === track.id));
                            }}
                        >
                            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color={isFavorite ? Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary : '#aaa'} />
                        </TouchableOpacity>
                    )}
                    </View>

                <View style={{ width: '100%' }}>
                    <Slider
                        minimumValue={0}
                        maximumValue={duration}
                        value={position}
                        onSlidingComplete={(val) => audioPlayer.seekTo(val)}
                        minimumTrackTintColor={Platform.OS === 'android' ? Colors.platform.android.primary : Colors.platform.ios.primary}
                        maximumTrackTintColor="#333"
                        thumbTintColor={Platform.OS === 'android' ? Colors.platform.android.primary : Colors.platform.ios.primary}
                    />
                    <View style={styles.timeRow}>
                        <Text style={styles.timeText}>{formatTime(position)}</Text>
                        <Text style={styles.timeText}>{formatTime(duration)}</Text>
                    </View>
                </View>

                <View style={styles.controls}>
                    <TouchableOpacity onPress={handlePrevious}>
                        <Ionicons name="play-skip-back" size={32} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePlayPause}>
                        <Ionicons
                            name={isPlaying ? 'pause-circle' : 'play-circle'}
                            size={64}
                            color={Platform.OS === 'android' ? Colors.platform.android.primary : Colors.platform.ios.primary}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleNext}>
                        <Ionicons name="play-skip-forward" size={32} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {showQueue && (
                <QueueBottomSheet
                    playlist={playlist}
                    currentIndex={index}
                    onClose={() => setShowQueue(false)}
                    
                />
            )}
            <Modal
                transparent
                visible={showPlaylistModal}
                animationType="slide"
                onRequestClose={() => setShowPlaylistModal(false)}
            >
                <Pressable
                    style={styles.modalContainer}
                    onPress={() => setShowPlaylistModal(false)}
                >
                    <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                        <Text style={styles.modalTitle}>Ajouter à une playlist</Text>
                        <FlatList
                            data={playlists}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={styles.modalItem}
                                    onPress={() => {
                                        console.log(`Ajouté "${track.title}" à "${item.name}"`);
                                        setShowPlaylistModal(false);
                                    }}
                                >
                                    <Text style={styles.modalItemText}>{item.name}</Text>
                                </Pressable>
                            )}
                        />
                    </Pressable>
                </Pressable>
            </Modal>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingHorizontal:25,
        alignItems: 'center',
        zIndex:-1,
    },
    cover: {
        width: 300,
        height: 300,
        borderRadius: 10,
        marginHorizontal:20
    },
    trackHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    title: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    artist: {
        fontSize: 16,
        color: '#aaa',
        marginTop: 4,
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%',
        marginVertical: 20,
    },
    timeRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
        marginBottom: 20,
    },
    timeText: {
        color: '#aaa',
        fontSize: 12,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '70%',
        alignItems: 'center',
        marginTop: 20,
    },
    repeatOne: {
        color: Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary,
        fontSize: 12,
        position: 'absolute',
        right: -6,
        top: -6,
        fontWeight: 'bold',
    },


    // partie du modal
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContent: {
        backgroundColor: '#1e1e1e',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '50%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    modalItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    modalItemText: {
        fontSize: 16,
        color: '#fff',
    },

});

export default TrackDetailScreen;
