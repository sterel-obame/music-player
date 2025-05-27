import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import { getPlaylists, savePlaylists } from '../services/playlists';
import { appEvents } from 'utils/events';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from 'src/Constants/Colors';

const AddToPlaylistBottomSheet = () => {
    const route = useRoute();
    const navigation = useNavigation<any>();
    const { playlistId } = route.params as { playlistId: string };

    const [allTracks, setAllTracks] = useState<any[]>([]);
    const [filteredTracks, setFilteredTracks] = useState<any[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const loadTracks = async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') return;
            const media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio', first: 1000 });
            setAllTracks(media.assets);
            setFilteredTracks(media.assets);
        };
        loadTracks();
    }, []);

    useEffect(() => {
        if (!search.trim()) {
            setFilteredTracks(allTracks);
        } else {
            setFilteredTracks(
                allTracks.filter((track) =>
                track.filename.toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [search, allTracks]);

    const toggleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleAdd = async () => {
        const newTracks = allTracks.filter((t) => selected.includes(t.id));
        const playlists = await getPlaylists();
        const updated = playlists.map((pl) => {
            if (pl.id !== playlistId) return pl;
            const merged = [...pl.tracks];
            newTracks.forEach((t) => {
                if (!merged.find((m) => m.id === t.id)) merged.push(t);
            });
            return { ...pl, tracks: merged };
        });
        await savePlaylists(updated);
        appEvents.emit('playlistUpdated'); // 🔔 informe les autres écrans
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <Text style={styles.title}>Ajouter à la playlist</Text>
            <TextInput
                placeholder="Rechercher..."
                placeholderTextColor="#888"
                value={search}
                onChangeText={setSearch}
                style={styles.input}
            />
            <FlatList
                data={filteredTracks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.track,
                            selected.includes(item.id) && { backgroundColor: Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary },
                        ]}
                        onPress={() => toggleSelect(item.id)}
                    >
                        <Text style={{ color: '#fff' }}>{item.filename}</Text>
                    </TouchableOpacity>
                )}
                keyboardShouldPersistTaps="handled"
            />
            {selected.length > 0 && (
                <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Ajouter {selected.length}</Text>
                </TouchableOpacity>
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e',
        padding: 16,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 6,
        padding: 10,
        color: '#fff',
        marginBottom: 10,
    },
    track: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    addButton: {
        backgroundColor: Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary,
        padding: 14,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 10,
    },
});

export default AddToPlaylistBottomSheet;