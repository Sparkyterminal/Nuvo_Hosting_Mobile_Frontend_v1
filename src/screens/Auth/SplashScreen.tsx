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
import { getCurrentUser } from '../../services/api/userService';
import { useAppDispatch } from '../../store/hooks';
import { setUser } from '../../features/auth/authSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const { height } = Dimensions.get('window');
const LOGO = require('../../assets/images/novoLogo.png');

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();

 

  const checkAuth = async () => {
    try {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

      setTimeout(async () => {
        if (isLoggedIn !== 'true') {
          navigation.replace('Onboarding');
          return;
        }

        try {
          const user = await getCurrentUser();

          console.log('SPLASH USER:', user);

          // 🔥 THIS WAS MISSING
          dispatch(setUser(user));

          if (!user?.profile_completed) {
            navigation.replace('Register');
            return;
          }

          navigation.replace('Home');
        } catch (error) {
          console.log('User fetch failed:', error);
          navigation.replace('Onboarding');
        }
      }, 1500);
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
