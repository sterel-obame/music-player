import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getFavorites } from 'services/favorites';
import { appEvents } from 'utils/events';
import { AudioTrack } from 'src/types';
import { audioPlayer } from 'context/audioPlayer';

const Favorites = () => {
    const navigation = useNavigation<any>();
    const [favorites, setFavorites] = useState<AudioTrack[]>([]);

    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                const favs = await getFavorites();
                setFavorites(favs);
            };
            const sub = appEvents.addListener('favoriteUpdated', load);
            load();
            return () => sub.remove();
        }, [])
    );

    const handlePlay = async (index: number) => {
        await audioPlayer.stop();
        navigation.navigate('TrackDetail', {
            track: favorites[index],
            playlist: favorites,
            currentIndex: index,
            from: 'Favorites',
        });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={favorites}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => handlePlay(index)} style={styles.trackItem}>
                        <Text style={styles.trackTitle}>{item.title? item.title : 'titre inconnu'}</Text>
                        <Text style={styles.trackArtist}>{item.artist? item.artist : 'artiste inconnu'}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 16,
    },
    trackItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    trackTitle: {
        color: '#fff',
        fontSize: 16,
    },
    trackArtist: {
        color: '#aaa',
        fontSize: 14,
    },
});

export default Favorites;
