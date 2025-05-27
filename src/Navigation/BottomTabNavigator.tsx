import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabParamList } from '../types/navigationTypes';
import { useFonts } from 'expo-font';
import Favorites from 'Screens/Favorites';
import Playlists from 'Screens/Playlists';
import Music from 'Screens/Music';
import Artist from 'Screens/Artist';
import { createStackNavigator } from '@react-navigation/stack';
import TrackDetailScreen from 'Screens/TrackDetailScreen';
import PlaylistDetailScreen from 'Screens/PlaylistDetailScreen';
import AddToPlaylistBottomSheet from 'Screens/AddToPlaylistBottomSheet';
import Colors from 'src/Constants/Colors';
import { Platform } from 'react-native';


const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
    const [fontsLoaded] = useFonts({
        'Roboto-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
        'Roboto-Bold': require('../../assets/fonts/Montserrat-Bold.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'favorites') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    } else if (route.name === 'playlists') {
                        iconName = focused ? 'list' : 'list-outline';
                    } else if (route.name === 'music') {
                        iconName = focused ? 'musical-notes' : 'musical-notes-outline';
                    } else if (route.name === 'artist') {
                        iconName = focused ? 'people' : 'people-outline';
                    }

                    return <Ionicons name={iconName!} size={size} color={color} />;
                },
                tabBarActiveTintColor: Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: '#121212',
                    borderTopWidth: 0,
                    paddingBottom: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontFamily: 'Roboto-Regular',
                    marginBottom: 5,
                },
                headerShown: false,
            })}
        >
        <Tab.Screen name="favorites" component={FavoritesStackScreen} />

        <Tab.Screen name="playlists" component={PlaylistStackScreen} />

        <Tab.Screen name="music" component={MusicStackScreen} />

        <Tab.Screen 
            name="artist" 
            component={Artist}
            options={({ navigation }) => ({
                headerShown: true,
                headerTitle: 'Artist',
                headerTintColor: Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary,
                headerLeft: () => (
                    <Ionicons 
                        name="chevron-back-circle" 
                        size={34} 
                        color={Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary} 
                        style={{ marginHorizontal: 15 }}
                        onPress={() => navigation.goBack()}
                    />
                ),
            })}
        />
        </Tab.Navigator>
    );
};

const MusicStack = createStackNavigator();
const MusicStackScreen = () => (
    <MusicStack.Navigator screenOptions={{ headerShown: false }}>
        <MusicStack.Screen 
            name="MusicList" 
            component={Music} 
            options={({ navigation }) => ({ 
                headerShown: true,
                headerTitle: 'Music',
                headerTintColor: Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary,
                headerLeft: () => (
                    <Ionicons 
                        name="chevron-back-circle" 
                        size={34} 
                        color={Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary} 
                        style={{ marginHorizontal: 15 }}
                        onPress={() => navigation.goBack()}
                    />
                ),
            })}
        />

        <MusicStack.Screen 
            name="TrackDetail" 
            component={TrackDetailScreen} 
            options={({ navigation }) => ({ 
                headerShown: true,
                headerTitle: 'Track Detail',
                headerTintColor: Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary,
                headerLeft: () => (
                    <Ionicons 
                        name="chevron-back-circle" 
                        size={34} 
                        color={Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary}
                        style={{ marginHorizontal: 15 }}
                        onPress={() => navigation.goBack()}
                    />
                ),
            })}
        />{/*c'est le lecteur en cours */}
    </MusicStack.Navigator>
);

const PlaylistStack = createStackNavigator();
const PlaylistStackScreen = () => (
    <PlaylistStack.Navigator screenOptions={{ headerShown: false }}>
        <PlaylistStack.Screen 
            name="Playlists" 
            component={Playlists}
            options={({ navigation }) => ({ 
                headerShown: true,
                headerTitle: 'Playlists',
                headerTintColor: Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary,
                headerLeft: () => (
                    <Ionicons 
                        name="chevron-back-circle" 
                        size={34} 
                        color={Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary} 
                        style={{ marginHorizontal: 15 }}
                        onPress={() => navigation.goBack()}
                    />
                ),
            })}
        />

        <PlaylistStack.Screen 
            name="PlaylistDetail" 
            component={PlaylistDetailScreen} 
            options={({ navigation }) => ({ 
                headerShown: true,
                headerTitle: 'Playlist Detail',
                headerTintColor: Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary,
                headerLeft: () => (
                    <Ionicons 
                        name="chevron-back-circle" 
                        size={34} 
                        color={Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary} 
                        style={{ marginHorizontal: 15 }}
                        onPress={() => navigation.goBack()}
                    />
                ),
            })}
        />
        <PlaylistStack.Screen 
            name="AddToPlaylist" 
            component={AddToPlaylistBottomSheet}
            options={({ navigation }) => ({ 
                headerShown: true,
                headerTitle: 'Add to Playlist',
                headerTintColor: Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary,
                headerLeft: () => (
                    <Ionicons 
                        name="chevron-back-circle" 
                        size={34} 
                        color={Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary} 
                        style={{ marginHorizontal: 15 }}
                        onPress={() => navigation.goBack()}
                    />
                ),
            })}
        />
        <PlaylistStack.Screen 
            name="TrackDetail"
            component={TrackDetailScreen} 
            options={({ navigation }) => ({ 
                headerShown: true,
                headerTitle: 'Track Detail',
                headerTintColor: Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary,
                headerLeft: () => (
                    <Ionicons 
                        name="menu" 
                        size={24} 
                        color="black" 
                        style={{ marginLeft: 15 }}
                        onPress={() => navigation.goBack()}
                    />
                ),
            })}
        />
    </PlaylistStack.Navigator>

);

const FavoritesStack = createStackNavigator();

const FavoritesStackScreen = () => (
    <FavoritesStack.Navigator screenOptions={{ headerShown: false }}>
        <FavoritesStack.Screen 
            name="Favorites" 
            component={Favorites} 
            options={({ navigation }) => ({ 
                headerShown: true,
                headerTitle: 'Favorites',
                headerTintColor: Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary,
            })}
        />
        <FavoritesStack.Screen name="TrackDetail" 
            component={TrackDetailScreen} 
            options={{ headerShown: true }}
        />
        <FavoritesStack.Screen 
            name="AddToPlaylist"
            component={AddToPlaylistBottomSheet} 
            options={({ navigation }) => ({ 
                headerShown: true,
                headerTitle: 'Add to Playlist',
                headerTintColor: Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary,
                headerLeft: () => (
                    <Ionicons 
                        name="chevron-back-circle" 
                        size={34} 
                        color={Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary} 
                        style={{ marginHorizontal: 15 }}
                        onPress={() => navigation.goBack()}
                    />
                ),
            })}
        />
    </FavoritesStack.Navigator>
);


export default BottomTabNavigator;