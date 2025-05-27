import RotatingImage from 'Components/RotatingImage';
import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import Colors from 'src/Constants/Colors';

const Artist = () => {
    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f8f8f8' }} contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 25 }}>
                    <RotatingImage
                        source={require('../../assets/logo1.webp')}
                        style={{ width: 200, height: 200 }}
                        borderColor={Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary}
                        borderWidth={5}
                        borderRadius={100}
                        isRotating={true}
                        speed={10000}
                    />
                </View>
                <View style={{borderWidth:1, borderColor:Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary, borderRadius:20, padding:10, marginBottom:16 }}>
                    <Text style={styles.text}>Réalisé par: <Text style={{paddingLeft:15}}>Stérel OBAME</Text></Text>
                    <Text style={styles.text}>Contact: <Text style={{paddingLeft:15}}>+212 624 571 578</Text></Text>
                    <Text style={styles.text}>E-mail: <Text style={{paddingLeft:15}}>obamesterel@yahoo.fr</Text></Text>
                    <Text style={styles.text}>GitHub: <Text style={{paddingLeft:15}}>https://github.com/sterel-obame</Text></Text>
                </View>

                <Text style={[styles.text, {paddingTop:10}]}>Outils utilisés</Text>
                <View style={{borderWidth:1, borderColor:Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary, borderRadius:20, padding:10, marginBottom:16 }}>
                    <Text style={styles.text}>React Native Expo </Text>
                    <Text style={styles.text}>Typescript </Text>
                    <Text style={styles.text}>VS Code</Text>
                </View>

                <Text style={[styles.text, {paddingTop:10}]}>Détail de la librairie musical</Text>
                <View style={{borderWidth:1, borderColor:Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary, borderRadius:20, padding:10, marginBottom:16 }}>
                    <Text style={styles.text}>Track : 294</Text>
                    <Text style={styles.text}>Artist : 94</Text>
                    <Text style={styles.text}>Playlist: 4</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#f8f8f8',
        paddingHorizontal: 20,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Artist;