import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import { StyleSheet} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import BottomTabNavigator from 'Navigation/BottomTabNavigator'
import { StatusBar } from 'expo-status-bar';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Audio } from 'expo-av'


const configureAudio = async () => {
    await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,

        // ✅ Remplacé par les valeurs numériques officielles
        interruptionModeIOS: 2,        // DUCK_OTHERS
        interruptionModeAndroid: 2,    // DUCK_OTHERS
    });
};

const App = () => {
    
    useEffect(() => {
        configureAudio();
    }, []);
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <SafeAreaProvider>
                <NavigationContainer>
                    <BottomSheetModalProvider>
                        <StatusBar 
                            style="auto"
                            animated={true} 
                            hideTransitionAnimation='slide' 
                            translucent={true}
                            networkActivityIndicatorVisible={true}
                            hidden={false}
                        />
                        <BottomTabNavigator />
                    </BottomSheetModalProvider>
                </NavigationContainer>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    )
}

export default App

const styles = StyleSheet.create({})