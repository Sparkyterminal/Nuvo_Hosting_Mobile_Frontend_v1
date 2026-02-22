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

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const { height } = Dimensions.get('window');

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const isLoggedIn = true;
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        navigation.replace('Home');
      } else {
        navigation.replace('Onboarding');
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/novoLogo.png')}
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
    width: height * 0.35,
    height: height * 0.35,
  },
  loader: {
    position: 'absolute',
    bottom: height * 0.12,
  },
});

export default SplashScreen;
