import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveUserData = async (data: any) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(data));
  } catch (e) {
    console.log('Storage save error', e);
  }
};

export const getUserData = async () => {
  try {
    const data = await AsyncStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.log('Storage get error', e);
    return null;
  }
};

export const clearUserData = async () => {
  await AsyncStorage.removeItem('userData');
};
