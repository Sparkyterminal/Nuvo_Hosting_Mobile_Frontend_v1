import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import CustomText from '../../components/CustomText';
import { AppColors } from '../../theme/colors';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import AppButton from '../../components/AppButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width, height } = Dimensions.get('window');

type OnboardingSlide = {
  id: string;
  title: string;
  subtitle: string;
  image: any;
};

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Celebrate Your Way',
    subtitle: 'Themes for every celebration, your way.',
    image: require('../../assets/images/onboarding1.jpg'),
  },
  {
    id: '2',
    title: 'Make every event yours',
    subtitle: 'Tailored to your taste, from decor to style.',
    image: require('../../assets/images/onboarding2.jpg'),
  },
  {
    id: '3',
    title: 'Relax, We’ll Handle the Rest',
    subtitle: 'Celebrate freely — we’ll do the rest.',
    image: require('../../assets/images/onboarding3.jpg'),
  },
];

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<OnboardingSlide>>(null);

  const renderItem: ListRenderItem<OnboardingSlide> = ({ item }) => {
    return (
      <ImageBackground
        source={item.image}
        style={styles.imageBackground}
      >
        {/* Bottom card */}
        <View style={styles.cardWrapper}>
          <View style={styles.card}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/novo.jpg')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Title */}
            <CustomText
              variant="title"
              weight="bold"
              style={styles.title}
            >
              {item.title}
            </CustomText>

            {/* Subtitle */}
            <CustomText
              variant="body"
              style={styles.subtitle}
              color={AppColors.textPrimary}
            >
              {item.subtitle}
            </CustomText>

            {/* Dots indicator */}
            <View style={styles.dotsRow}>
              {SLIDES.map((slide, index) => {
                const isActive = index === currentIndex;
                return (
                  <View
                    key={slide.id}
                    style={[styles.dot, isActive && styles.dotActive]}
                  />
                );
              })}
            </View>

            {/* Register button */}
            <AppButton
              label="Register"
              onPress={() => navigation.navigate('Register')}
              containerStyle={styles.primaryButton}
            />

            {/* Footer: Login link */}
            <View style={styles.footerRow}>
              <CustomText
                variant="caption"
                color={AppColors.textGrey}
              >
                Already have account?{' '}
              </CustomText>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <CustomText
                  variant="caption"
                  weight="bold"
                  color={AppColors.primary}
                >
                  Login
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />
    </View>
  );
};

// make card height slightly adaptive – taller on short screens

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  imageBackground: {
    width,
    height,
    justifyContent: 'flex-end',
  },
  cardWrapper: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(24),
  },
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: moderateScale(24),
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(40),
    paddingBottom: verticalScale(20),
    minHeight: scale(120),
    shadowColor: AppColors.textDark,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: verticalScale(4) },
    // elevation (Android)
    elevation: 6,
  },
  logoContainer: {
    position: 'absolute',
    top: -verticalScale(32),
    alignSelf: 'center',
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    backgroundColor: AppColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: scale(72),
    height: scale(52),
  },
  title: {
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: verticalScale(16),
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: verticalScale(16),
  },
  dot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: AppColors.border,
    marginHorizontal: scale(4),
  },
  dotActive: {
    width: scale(16),
    backgroundColor: AppColors.primary,
  },
  primaryButton: {
    marginBottom: verticalScale(12),
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default OnboardingScreen;
