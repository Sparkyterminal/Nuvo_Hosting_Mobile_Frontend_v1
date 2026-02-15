import React from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { BaseContainer } from "../../components/BaseContainer";
import CustomText from "../../components/CustomText";
import { AppColors } from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <BaseContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HERO SECTION */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={require("../../assets/images/home.jpg")} // add hero image
            style={styles.heroImage}
            imageStyle={styles.heroImageStyle}
          >
            <View style={styles.heroOverlay}>
              {/* Top Row */}
              <View style={styles.heroTopRow}>
                <View style={styles.heroUserRow}>
                  <Image
                    source={require("../../assets/images/Tony_Stark.jpg")}
                    style={styles.avatar}
                  />
                  <View style={styles.heroUserText}>
                    <CustomText color={AppColors.textInverse}>
                      Welcome,
                    </CustomText>
                    <CustomText weight="bold" color={AppColors.textInverse}>
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

              {/* Center Text */}
              <View style={styles.heroTextBlock}>
                <CustomText
                  weight="bold"
                  color={AppColors.textInverse}
                  style={styles.heroTitle}
                >
                  Designed to Celebrate.
                </CustomText>

                <CustomText
                  color={AppColors.textInverse}
                  style={styles.heroDescription}
                >
                  Join 2.7K Event Makers shaping celebrations that stand the
                  test of time. From cozy gatherings to majestic receptions Nuvo
                  ensures every moment feels extraordinary.
                </CustomText>

                <CustomText
                  color={AppColors.textInverse}
                  style={styles.heroQuote}
                >
                  - Nuvo Hosting
                </CustomText>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* cofounder section  */}
        {/* COFOUNDER SECTION */}
        <View style={styles.cofounderContainer}>
          <CustomText
            variant="subtitle"
            weight="bold"
            style={styles.cofounderHeading}
          >
            Meet Our Cofounder
          </CustomText>

          <View style={styles.cofounderCard}>
            <Image
              source={require("../../assets/images/Tony_Stark.jpg")}
              style={styles.cofounderImage}
            />

            <View style={styles.cofounderContent}>
              <CustomText weight="bold" style={styles.cofounderName}>
                Tony Stark
              </CustomText>

              <CustomText style={styles.cofounderRole}>
                Visionary & Creative Director
              </CustomText>

              <CustomText style={styles.cofounderDescription}>
                Passionate about crafting unforgettable celebrations. Leading
                Nuvo with innovation, elegance and a bold creative direction.
              </CustomText>
            </View>
          </View>
        </View>
      </ScrollView>
    </BaseContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    // paddingBottom: verticalScale(30),
    paddingBottom: verticalScale(40),

    // backgroundColor: "#F5F7FA",
  },

  /* ---------------- HERO SECTION ---------------- */

  heroContainer: {
    borderBottomLeftRadius: scale(28),
    borderBottomRightRadius: scale(28),
    overflow: "hidden",
  },

  heroImage: {
    width: "100%",
    height: SCREEN_HEIGHT * 0.8,
    justifyContent: "space-between",
  },

  heroImageStyle: {
    borderBottomLeftRadius: scale(28),
    borderBottomRightRadius: scale(28),
  },

  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: scale(18),
    paddingTop: verticalScale(18),
    paddingBottom: verticalScale(28),
  },

  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  heroUserRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  heroUserText: {
    marginLeft: scale(10),
  },

  avatar: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
    borderWidth: 1.5,
    borderColor: "#fff",
  },

  iconButton: {
    padding: scale(6),
  },

  heroTextBlock: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(12),
  },

  heroTitle: {
    textAlign: "center",
    marginBottom: verticalScale(10),
  },

  heroDescription: {
    textAlign: "center",
    lineHeight: 20,
    opacity: 0.95,
  },

  heroQuote: {
    marginTop: verticalScale(12),
    opacity: 0.9,
  },

  /* ---------------- THEMES SECTION ---------------- */

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(18),
    marginBottom: verticalScale(10),
  },

  themeCard: {
    flexDirection: "row",
    marginHorizontal: scale(18),
    marginBottom: verticalScale(14),
    borderRadius: moderateScale(18),
    overflow: "hidden",
    backgroundColor: "#fff",

    // Shadow (iOS)
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },

    // Elevation (Android)
    elevation: 4,
  },

  themeImage: {
    width: "40%",
    height: verticalScale(110),
  },

  themeTextContainer: {
    flex: 1,
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(12),
    justifyContent: "center",
  },

  themeTitle: {
    marginBottom: verticalScale(6),
  },

  themeDescription: {
    lineHeight: 17,
  },
  /* ---------------- COFOUNDER SECTION ---------------- */

  cofounderContainer: {
    paddingHorizontal: scale(20),
    marginTop: verticalScale(30),
  },

  cofounderHeading: {
    marginBottom: verticalScale(16),
  },

  cofounderCard: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(22),
    padding: scale(18),
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },

  cofounderImage: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    marginBottom: verticalScale(14),
  },

  cofounderContent: {
    alignItems: "center",
  },

  cofounderName: {
    marginBottom: verticalScale(4),
  },

  cofounderRole: {
    opacity: 0.6,
    marginBottom: verticalScale(10),
  },

  cofounderDescription: {
    textAlign: "center",
    opacity: 0.85,
    marginBottom: verticalScale(14),
  },

  cofounderButton: {
    backgroundColor: "#2E6DA4",
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(20),
    borderRadius: scale(20),
  },
});

export default HomeScreen;
