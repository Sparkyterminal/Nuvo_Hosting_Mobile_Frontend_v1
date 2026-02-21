import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { BaseContainer } from '../../components/BaseContainer';
import CustomText from '../../components/CustomText';
import { AppColors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <BaseContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HERO SECTION 1 */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={require('../../assets/images/home.jpg')}
            style={styles.fullImage}
          >
            <View style={styles.heroOverlay}>
              {/* Your existing hero content */}

              <View style={styles.heroTopRow}>
                <View style={styles.heroUserRow}>
                  <Image
                    source={require('../../assets/images/Tony_Stark.jpg')}
                    style={styles.avatar}
                  />
                  <View style={styles.heroUserText}>
                    <CustomText color={AppColors.textInverse}>
                      Welcome,
                    </CustomText>
                    <CustomText
                      weight="bold"
                      color={AppColors.textInverse}
                    >
                      Stark
                    </CustomText>
                  </View>
                </View>

                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons
                    name="notifications-outline"
                    size={22}
                    color={AppColors.textInverse}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.heroTextContainer}>
                <CustomText
                  variant="title"
                  weight="extraBold"
                  color={AppColors.textInverse}
                  style={styles.heroTitle}
                >
                  Premium Event Hosts & Hostesses
                </CustomText>
                <CustomText
                  color={AppColors.textInverse}
                  style={styles.heroParagraph}
                >
                  Through a solid structure and effective logistics, NUVÓ agency
                  offers hosts and hostesses that are available for events and
                  functions across India and abroad.
                </CustomText>

                <CustomText
                  color={AppColors.textInverse}
                  style={styles.heroParagraph}
                >
                  Our hosts and hostesses stand out because they are
                  meticulously qualified and trained on the basis of key
                  criteria: dynamism to energize any gathering, patience to
                  handle diverse crowds gracefully, initiative to anticipate
                  needs proactively, experience honed from real-world events,
                  efficiency to ensure seamless operations, multilingualism for
                  global audiences, protocol for formal occasions, etiquette to
                  uphold standards, savoir-vivre for refined interactions, and
                  most importantly, a radiant smile that lights up every
                  moment—the true hallmarks of our exceptional staff.
                </CustomText>
                <CustomText
                  color={AppColors.textInverse}
                  style={styles.heroParagraph}
                >
                  With NUVÓ, you receive reliable professionals ready to elevate
                  your occasions with poise and precision, whether in India or
                  abroad.
                </CustomText>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* COFOUNDER SECTION */}
        <View style={styles.cofounderContainer}>
          <CustomText
            variant="subtitle"
            weight="extraBold"
            style={styles.cofounderHeading}
          >
            Founder Spotlight
          </CustomText>

          <ImageBackground
            source={require('../../assets/images/founder.jpeg')}
            style={styles.cofounderBanner}
            imageStyle={styles.cofounderBannerImage}
            resizeMode="contain"
          />

          <View style={styles.cofounderContent}>
            <CustomText style={styles.cofounderDescription}>
              Meet Anika (25) and Rini (29), the dedicated sisters who
              established NUVÓ, Bengaluru’s premier hosting agency specializing
              in elite manpower for luxury events. Anika, with her background in
              content creation during her student years, developed a keen sense
              for curating captivating experiences that resonate deeply. Her
              expertise in visual storytelling now guides our hostesses in
              delivering polished, memorable interactions that elevate every
              occasion.
            </CustomText>
            <CustomText style={styles.cofounderDescription}>
              Rini, at 29, refined her precision and composure in a demanding
              corporate fraud analyst role, excelling in high-stakes
              environments where attention to detail was paramount. This
              foundation ensures our hosts execute with impeccable timing and
              manage discerning VIP guests.
            </CustomText>
            <CustomText style={styles.cofounderDescription}>
              Dissatisfied with luxury events undermined by inconsistent
              staffing and a lack of cultural refinement, we founded NUVÓ to set
              a new standard. We provide sophisticated hosts and hostesses for
              B2B partners, including corporates and hotels for MICE events, and
              B2C clients seeking bespoke luxury weddings, fashion launches,
              brand activations, hospitality collaborations, and private HNI
              gatherings. From Bengaluru’s dynamic landscape, we offer hands-on
              excellence, blending tradition with contemporary elegance. Ready
              to staff your next triumph? Let’s collaborate and create magic
            </CustomText>
          </View>
        </View>
      </ScrollView>
    </BaseContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: verticalScale(40),
  },

  /* ---------------- HERO SECTION ---------------- */

  heroImage: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.8,
    justifyContent: 'space-between',
  },

  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(18),
    paddingBottom: verticalScale(30),
    gap: verticalScale(20),
    // justifyContent: 'space-between',
  },

  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  heroUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  heroUserText: {
    marginLeft: scale(10),
  },

  avatar: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
    borderWidth: 1.5,
    borderColor: '#fff',
  },

  iconButton: {
    padding: scale(6),
  },

  heroTextBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(12),
  },

  heroDescription: {
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.95,
  },

  heroQuote: {
    marginTop: verticalScale(12),
    opacity: 0.9,
  },

  /* ---------------- THEMES SECTION ---------------- */

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(18),
    marginBottom: verticalScale(10),
  },

  themeCard: {
    flexDirection: 'row',
    marginHorizontal: scale(18),
    marginBottom: verticalScale(14),
    borderRadius: moderateScale(18),
    overflow: 'hidden',
    backgroundColor: '#fff',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },

    elevation: 4,
  },

  themeImage: {
    width: '40%',
    height: verticalScale(110),
  },

  themeTextContainer: {
    flex: 1,
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(12),
    justifyContent: 'center',
  },

  themeTitle: {
    marginBottom: verticalScale(6),
  },

  themeDescription: {
    lineHeight: 17,
  },
  /* ---------------- COFOUNDER SECTION ---------------- */

  cofounderContainer: {
    marginTop: verticalScale(30),
    paddingHorizontal: scale(20),
  },

  cofounderHeading: {
    marginBottom: verticalScale(18),
    marginTop: verticalScale(10),
  },

  cofounderCard: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(22),
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },

  cofounderImage: {
    width: scale(100),
    height: scale(100),
  },

  cofounderContent: {
    alignItems: 'flex-start',
    gap: verticalScale(14),
  },

  cofounderName: {
    marginBottom: verticalScale(4),
  },

  cofounderRole: {
    opacity: 0.6,
    marginBottom: verticalScale(10),
  },

  cofounderDescription: {
    textAlign: 'left',
    opacity: 0.85,
    marginBottom: verticalScale(14),
    lineHeight: 22,
  },

  cofounderButton: {
    backgroundColor: '#2E6DA4',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(20),
    borderRadius: scale(20),
  },
  fullImage: {
    width: '100%',
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
  },

  heroContainer: {
    width: '100%',
    margin: 0,
    padding: 0,
  },

  cofounderBanner: {
    width: '100%',
    aspectRatio: 1.8,
    borderRadius: moderateScale(20),
    overflow: 'hidden',
    marginBottom: verticalScale(18),
  },

  cofounderBannerImage: {},

  bannerOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  heroTextScroll: {
    paddingTop: verticalScale(40),
    paddingBottom: verticalScale(40),
  },

  heroTextContainer: {
    maxWidth: '92%',
  },

  heroTitle: {
    lineHeight: 32,
    marginBottom: verticalScale(14),
  },

  heroParagraph: {
    lineHeight: 22,
    opacity: 0.92,
    marginBottom: verticalScale(14),
  },
});

export default HomeScreen;
