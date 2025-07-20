import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import BottomSheet, { BottomSheetFlatList} from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import Colors from 'src/Constants/Colors';

const QueueBottomSheet = ({ playlist, currentIndex, onClose }: {
    playlist: any[];
    currentIndex: number;
    onClose: () => void;
}) => {
    const navigation = useNavigation<any>();
    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['90%'], []);

    const handleSelectTrack = (index: number) => {
        onClose();
        navigation.navigate('TrackDetail', {
            track: playlist[index],
            playlist,
            currentIndex: index,
        });
    };
    
    return (
        <BottomSheet
            ref={sheetRef}
            snapPoints={snapPoints}
            index={1}
            onClose={onClose}
            backgroundStyle={{ backgroundColor: '#1e1e1e' }}
            handleIndicatorStyle={{ backgroundColor: Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary }}
            topInset={32}
            // enablePanDownToClose={true}
            enablePanDownToClose={true}
        >
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <Text style={styles.header}>File d'attente</Text>
                    {/* <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color="#1DB954" />
                    </TouchableOpacity> */}
                </View>
                <BottomSheetFlatList
                    data={playlist}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => handleSelectTrack(index)}
                            style={[
                                styles.trackItem,
                                index === currentIndex && styles.currentTrack,
                            ]}
                        >
                            <Text style={styles.trackTitle}>{item.title}</Text>
                            <Text style={styles.trackArtist}>{item.artist || 'Inconnu'}</Text>
                        </TouchableOpacity>
                    )}
                    // estimatedFirstItemOffset={1}
                    // estimatedItemSize={500}
                />
            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary,
    },
    trackItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    currentTrack: {
        backgroundColor: '#1DB95433',
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

export default QueueBottomSheet;
