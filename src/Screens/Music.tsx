import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MusicStackParamList } from '../types/navigationTypes'; // Assure-toi que ce fichier contient bien MusicStack types
import { MusicItem } from 'src/types';
import Colors from 'src/Constants/Colors';


type NavigationProp = StackNavigationProp<MusicStackParamList, 'MusicList'>;

const Music = () => {
    const [tracks, setTracks] = useState<MusicItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigation = useNavigation<NavigationProp>();

    useEffect(() => {
        (async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission requise', 'L’accès aux fichiers musicaux est nécessaire.');
                return;
            }

            const media = await MediaLibrary.getAssetsAsync({
                mediaType: 'audio',
                first: 1000,
                sortBy: [MediaLibrary.SortBy.creationTime],

            });

            const assets = media.assets.map((item) => ({
                id: item.id,
                title: item.filename,
                uri: item.uri,
                duration: item.duration,
                filename: item.filename,
            }));

            setTracks(assets);
            setLoading(false);
        })();
    }, []);

    const renderItem = ({ item, index }: { item: MusicItem, index:number }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('TrackDetail', {
                // @ts-ignore
                track: item,
                playlist: tracks, // ← toute la liste
                currentIndex: index
            })}
        >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.sub}>{(item.duration / 60).toFixed(2)} min</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary} />
                <Text style={{ color: 'white' }}>Chargement des musiques...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={tracks}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.empty}>Aucune musique trouvée.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    item: {
        padding: 16,
        backgroundColor: '#1e1e1e',
        borderRadius: 8,
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    sub: {
        fontSize: 14,
        color: '#aaa',
        marginTop: 4,
    },
    empty: {
        textAlign: 'center',
        color: '#888',
        marginTop: 50,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
});

export default Music;
