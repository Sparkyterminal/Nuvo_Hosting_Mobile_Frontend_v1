import React, { useEffect } from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { AppColors } from '../../theme/colors';
import { scale, verticalScale } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const { height } = Dimensions.get('window');
const LOGO = require('../../assets/images/novoLogo.png');

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  // const checkAuth = async () => {
  //   try {
  //     const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
  //     const user = await AsyncStorage.getItem('user');

  //     const parsedUser = user ? JSON.parse(user) : null;

  //     setTimeout(() => {
  //       if (!isLoggedIn) {
  //         navigation.replace('Onboarding');
  //         return;
  //       }

  //       if (!parsedUser?.profile_completed) {
  //         navigation.replace('Register');
  //         return;
  //       }

  //       navigation.replace('Home');
  //     }, 2000);
  //   } catch (error) {
  //     navigation.replace('Onboarding');
  //   }
  // };

  const checkAuth = async () => {
    try {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      const user = await AsyncStorage.getItem('user');

      const parsedUser = user ? JSON.parse(user) : null;

      setTimeout(() => {
        if (!parsedUser) {
          navigation.replace('Onboarding');
          return;
        }

        if (!parsedUser.profile_completed) {
          navigation.replace('Register');
          return;
        }

        if (isLoggedIn === 'true') {
          navigation.replace('Home');
          return;
        }

        navigation.replace('Onboarding');
      }, 2000);
    } catch {
      navigation.replace('Onboarding');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={LOGO}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator
        size="large"
        color={AppColors.textInverse}
        style={styles.loader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: scale(180),
    height: verticalScale(120),
  },
  loader: {
    position: 'absolute',
    bottom: height * 0.12,
  },
});

export default SplashScreen;
