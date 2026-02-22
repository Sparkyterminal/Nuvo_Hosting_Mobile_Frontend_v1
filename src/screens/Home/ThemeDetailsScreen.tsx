import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { BaseContainer } from '../../components/BaseContainer';
import CustomText from '../../components/CustomText';
import { AppColors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale } from 'react-native-size-matters';
import FooterButton from '../../components/FooterButton';

type Props = NativeStackScreenProps<RootStackParamList, 'ThemeDetails'>;

const ThemeDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  // const { theme } = route.params;
  const { data } = route.params;

  return (
    <BaseContainer>
      <ImageBackground
        source={data.image}
        style={styles.hero}
        imageStyle={styles.heroImg}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={AppColors.textInverse}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomBlock}>
            <View
              style={[
                styles.badge,
                { backgroundColor: data.color || AppColors.primary },
              ]}
            >
              <CustomText
                variant="caption"
                weight="bold"
                color={AppColors.textInverse}
              >
                THEME
              </CustomText>
            </View>

            <CustomText
              variant="title"
              weight="bold"
              color={AppColors.textInverse}
              style={{ marginTop: 8 }}
            >
              {data.title}
            </CustomText>

            <CustomText
              variant="body"
              color={AppColors.textInverse}
              style={{ marginTop: 8, lineHeight: 20 }}
            >
              {data.description}
            </CustomText>
          </View>
        </View>
      </ImageBackground>

      {/* You can add more sections below: gallery, pricing, hosts, book button, etc */}
      <View style={styles.content}>
        <CustomText
          variant="subtitle"
          weight="extraBold"
          color={AppColors.textPrimary}
        >
          About this theme
        </CustomText>

        <CustomText
          variant="body"
          color={AppColors.textGrey}
          style={{ marginTop: 8 }}
        >
          Add your complete theme details here (timeline, decor, food, services,
          packages, etc).
        </CustomText>

        <FooterButton
          label="Book Now"
          onPress={() => {
            console.log('Book Now pressed');
          }}
          containerStyle={{ backgroundColor: AppColors.background }}
        />
      </View>
    </BaseContainer>
  );
};

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    height: verticalScale(360),
  },
  heroImg: {
    borderBottomLeftRadius: scale(18),
    borderBottomRightRadius: scale(18),
  },
  overlay: {
    flex: 1,
    backgroundColor: AppColors.overlay,
    borderBottomLeftRadius: scale(18),
    borderBottomRightRadius: scale(18),
    overflow: 'hidden',
  },
  header: {
    paddingTop: verticalScale(14),
    paddingHorizontal: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(19),
    backgroundColor: AppColors.overlayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBlock: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(16),
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    borderRadius: scale(999),
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
  },
  primaryBtn: {
    marginTop: verticalScale(16),
    height: verticalScale(48),
    borderRadius: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ThemeDetailsScreen;
