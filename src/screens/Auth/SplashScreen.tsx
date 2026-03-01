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

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const { height } = Dimensions.get('window');
const LOGO = require('../../assets/images/novoLogo.png');

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const isLoggedIn = false; // TODO: replace with real auth check

    const timer = setTimeout(() => {
      navigation.replace(isLoggedIn ? 'Home' : 'Onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

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
