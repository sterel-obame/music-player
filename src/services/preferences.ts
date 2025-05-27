import * as SecureStore from 'expo-secure-store';

export const savePreference = async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
};

export const loadPreference = async (key: string, defaultValue: string): Promise<string> => {
    const result = await SecureStore.getItemAsync(key);
    return result ?? defaultValue;
};
