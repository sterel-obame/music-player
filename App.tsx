import 'react-native-gesture-handler'
import React from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import BottomTabNavigator from 'Navigation/BottomTabNavigator'
import { StatusBar } from 'expo-status-bar';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Colors from 'src/Constants/Colors'


const App = () => {
    
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <SafeAreaProvider>
                <NavigationContainer>
                    <BottomSheetModalProvider>
                        <StatusBar 
                            style="inverted" 
                            animated={true} 
                            backgroundColor={Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary}
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