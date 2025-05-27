import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Pressable, Platform} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import { savePlaylists, getPlaylists } from '../services/playlists';
import { Playlist } from 'src/types';
import { appEvents } from 'utils/events';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TruncatedText from 'Components/TruncatedText';
import Colors from 'src/Constants/Colors';

const PlaylistDetailScreen = () => {
    const insets = useSafeAreaInsets();
    const route = useRoute();
    const navigation = useNavigation<any>();
    const { playlist } = route.params as { playlist: Playlist };

    const [tracks, setTracks] = useState(playlist.tracks);
    const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
    const [confirmModal, setConfirmModal] = useState(false);
    const [deleteMode, setDeleteMode] = useState<'one' | 'multi' | 'all'>('one');
    const [trackToDelete, setTrackToDelete] = useState<any>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [availableTracks, setAvailableTracks] = useState<any[]>([]);
    const [selectedToAdd, setSelectedToAdd] = useState<string[]>([]);

    useEffect(() => {
        const sub = appEvents.addListener('playlistUpdated', async () => {
            const all = await getPlaylists();
            const current = all.find((p) => p.id === playlist.id);
            if (current) setTracks(current.tracks);
        });

        return () => sub.remove();
    }, []);


    const handlePlay = (index: number) => {
        navigation.navigate('TrackDetail', {
            track: tracks[index],
            playlist: tracks,
            currentIndex: index,
        });
    };

    const toggleSelect = (id: string) => {
        setSelectedTracks((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
        );
    };

    const confirmDelete = (mode: 'one' | 'multi' | 'all', track: any = null) => {
        setDeleteMode(mode);
        setTrackToDelete(track);
        setConfirmModal(true);
    };

    const performDelete = async () => {
        let updatedTracks = tracks;
            if (deleteMode === 'one' && trackToDelete) {
            updatedTracks = tracks.filter((t) => t.id !== trackToDelete.id);
        } else if (deleteMode === 'multi') {
            updatedTracks = tracks.filter((t) => !selectedTracks.includes(t.id));
        } else if (deleteMode === 'all') {
            updatedTracks = [];
        }
        const playlists = await getPlaylists();
        const updated = playlists.map((pl) =>
            pl.id === playlist.id ? { ...pl, tracks: updatedTracks } : pl
        );
        await savePlaylists(updated);
        setTracks(updatedTracks);
        setSelectedTracks([]);
        setConfirmModal(false);
    };

    const loadAvailableTracks = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') return;
        const media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio', first: 1000 });
        setAvailableTracks(media.assets);
    };

    const toggleAddSelection = (id: string) => {
        setSelectedToAdd((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleAddTracks = async () => {
        const newTracks = availableTracks.filter((t) => selectedToAdd.includes(t.id));
        const merged = [...tracks];
        newTracks.forEach((t) => {
            if (!merged.find((m) => m.id === t.id)) merged.push(t);
        });
        const playlists = await getPlaylists();
        const updated = playlists.map((pl) =>
            pl.id === playlist.id ? { ...pl, tracks: merged } : pl
        );
        await savePlaylists(updated);
        setTracks(merged);
        setSelectedToAdd([]);
        setShowAddModal(false);
    };

    useEffect(() => {
        if (showAddModal) loadAvailableTracks();
    }, [showAddModal]);

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 24,}}>
                <TruncatedText
                    text={`Playlist: ${playlist.name || 'Playlist Inconnue'}`}
                    maxLength={25}
                    fontWeight="bold"
                    fontSize={20}
                    color={Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                />
                <TouchableOpacity onPress={() => navigation.navigate('AddToPlaylist', { playlistId: playlist.id })}>
                    <Ionicons name="add-circle" size={28} color={Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary} />
                </TouchableOpacity>
            </View>

        <FlatList
            data={tracks}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => handlePlay(index)}
                    onLongPress={() => toggleSelect(item.id)}
                >
                    <View style={{ flex: 1 }}>
                        <TruncatedText
                            text={item.filename || 'Titre inconnu'}
                            maxLength={30}
                            fontWeight="bold"
                            fontSize={16}
                            color="#fff"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        />
                        <TruncatedText
                            text={item.artist || 'Artist Inconnu'}
                            maxLength={15}
                            fontWeight="regular"
                            fontSize={16}
                            color="#aaa"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        />
                    </View>
                    <TouchableOpacity onPress={() => confirmDelete('one', item)}>
                        <Ionicons name="trash" size={20} color="#ff4d4d" />
                    </TouchableOpacity>
                </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.empty}>Aucun morceau.</Text>}
        />

        {selectedTracks.length > 0 && (
            <TouchableOpacity
            style={styles.actionButton}
            onPress={() => confirmDelete('multi')}
            >
            <Text style={styles.actionText}>
                Supprimer {selectedTracks.length} sélectionné(s)
            </Text>
            </TouchableOpacity>
        )}

        {tracks.length > 0 && (
            <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary, height: 50 }]}
                onPress={() => confirmDelete('all')}
            >
            <Text style={styles.actionText}>Tout supprimer</Text>
            </TouchableOpacity>
        )}

        {/* Modal de confirmation */}
        <Modal transparent visible={confirmModal} animationType="fade">
            <Pressable style={styles.modalBackdrop} onPress={() => setConfirmModal(false)}>
            <Pressable style={styles.modalBox} onPress={(e) => e.stopPropagation()}>
                <Text style={styles.modalTitle}>
                {deleteMode === 'one' && trackToDelete?.title}
                {deleteMode === 'multi' && `${selectedTracks.length} morceau(x) à supprimer`}
                {deleteMode === 'all' && 'Voulez-vous tout supprimer ?'}
                </Text>
                <View style={styles.modalButtons}>
                <TouchableOpacity
                    style={[styles.confirmButton, { backgroundColor: '#ff4d4d' }]}
                    onPress={performDelete}
                >
                    <Text style={{ color: '#fff' }}>Supprimer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.confirmButton, { backgroundColor: '#333' }]}
                    onPress={() => setConfirmModal(false)}
                >
                    <Text style={{ color: '#fff' }}>Annuler</Text>
                </TouchableOpacity>
                </View>
            </Pressable>
            </Pressable>
        </Modal>

        {/* Modal d'ajout */}
        <Modal transparent visible={showAddModal} animationType="slide">
            <Pressable style={styles.modalBackdrop} onPress={() => setShowAddModal(false)}>
            <Pressable style={styles.modalBox} onPress={(e) => e.stopPropagation()}>
                <Text style={styles.modalTitle}>Ajouter des morceaux</Text>
                <FlatList
                data={availableTracks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                    onPress={() => toggleAddSelection(item.id)}
                    style={{ padding: 8, backgroundColor: selectedToAdd.includes(item.id) ? Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary : 'transparent' }}
                    >
                    <Text style={{ color: '#fff' }}>{item.filename}</Text>
                    </TouchableOpacity>
                )}
                style={{ maxHeight: 300, marginVertical: 10 }}
                />
                <TouchableOpacity style={styles.createButton} onPress={handleAddTracks}>
                    <Text style={{ color: '#fff', textAlign: 'center' }}>Ajouter</Text>
                </TouchableOpacity>
            </Pressable>
            </Pressable>
        </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingHorizontal:10
    },
    item: {
        backgroundColor: '#1e1e1e',
        padding: 16,
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    empty: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: 40,
    },
    actionButton: {
        backgroundColor: Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary,
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
        marginBottom: 10,
    },
    actionText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        padding: 24,
    },
    modalBox: {
        backgroundColor: '#1e1e1e',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    confirmButton: {
        flex: 1,
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    createButton: {
        backgroundColor: Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary,
        padding: 10,
        alignItems: 'center',
        borderRadius: 6,
        marginTop: 8,
    },

});

export default PlaylistDetailScreen;
