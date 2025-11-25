import React from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { BaseContainer } from "../../components/BaseContainer";
import CustomText from "../../components/CustomText";
import { AppColors } from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

type ThemeCard = {
  id: string;
  title: string;
  description: string;
  image: any;
  color: string;
};

const THEMES: ThemeCard[] = [
  {
    id: "1",
    title: "South Indian wedding",
    description:
      "Book trained hosts, models, and support staff for any occasion.",
    image: require("../../assets/images/home.jpg"),
    color: "#1E6FB3",
  },
  {
    id: "2",
    title: "Corporate Event",
    description:
      "Book trained hosts, models, and support staff for any occasion.",
    image: require("../../assets/images/home.jpg"),
    color: "#11A36D",
  },
  {
    id: "3",
    title: "Haladi",
    description:
      "Book trained hosts, models, and support staff for any occasion.",
    image: require("../../assets/images/home.jpg"),
    color: "#D9921A",
  },
];

const HomeScreen: React.FC<Props> = () => {
  return (
    <BaseContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero / Welcome Card */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={require("../../assets/images/home.jpg")}
            style={styles.heroImage}
            imageStyle={styles.heroImageStyle}
          >
            <View style={styles.heroOverlay}>
              {/* Top row: avatar + welcome + icons */}
              <View style={styles.heroTopRow}>
                <View style={styles.heroUserRow}>
                  <Image
                    source={require("../../assets/images/Tony_Stark.jpg")}
                    style={styles.avatar}
                  />
                  <View style={styles.heroUserText}>
                    <CustomText variant="caption" color={AppColors.textInverse}>
                      Welcome,
                    </CustomText>
                    <CustomText
                      variant="subtitle"
                      weight="bold"
                      color={AppColors.textInverse}
                    >
                      Stark
                    </CustomText>
                  </View>
                </View>

                <View style={styles.heroIconsRow}>
                  <TouchableOpacity style={styles.iconButton}>
                    <Ionicons
                      name="notifications-outline"
                      size={22}
                      color={AppColors.textInverse}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Body text */}
              <View style={styles.heroTextBlock}>
                <CustomText
                  variant="title"
                  weight="bold"
                  color={AppColors.textInverse}
                  style={styles.heroTitle}
                >
                  Designed to Celebrate.
                </CustomText>

                <CustomText
                  variant="body"
                  color={AppColors.textInverse}
                  style={styles.heroDescription}
                >
                  Join 2.7K Event Makers shaping celebrations that stand the
                  test of time. From cozy gatherings to majestic receptions Nuvo
                  ensures every moment feels extraordinary.Our expert planners,
                  stylists, and coordinators work hand in hand to turn dreams
                  into beautifully curated experiences. With Nuvo Hosting, you
                  don’t just host an event — you create lasting memories. We
                  blend innovation with elegance, transforming your ideas into
                  breathtaking realities. Because at Nuvo, every celebration
                  deserves to be nothing short of spectacular. -Nuvo Hosting
                </CustomText>

                <CustomText
                  variant="caption"
                  weight="medium"
                  color={AppColors.textInverse}
                  style={styles.heroQuote}
                >
                  - Nuvo Hosting
                </CustomText>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Themes Section */}
        <View style={styles.sectionHeaderRow}>
          <CustomText
            variant="subtitle"
            weight="bold"
            color={AppColors.textGearDark}
          >
            Themes:
          </CustomText>

          <TouchableOpacity>
            <CustomText
              variant="caption"
              weight="medium"
              color={AppColors.primary}
            >
              View All
            </CustomText>
          </TouchableOpacity>
        </View>

        {/* Theme Cards */}
        {THEMES.map((theme) => (
          <TouchableOpacity
            key={theme.id}
            activeOpacity={0.85}
            style={styles.themeCard}
          >
            <Image
              source={theme.image}
              style={styles.themeImage}
              resizeMode="cover"
            />
            <View
              style={[
                styles.themeTextContainer,
                { backgroundColor: theme.color },
              ]}
            >
              <CustomText
                variant="body"
                weight="bold"
                color={AppColors.textInverse}
                style={styles.themeTitle}
              >
                {theme.title}
              </CustomText>
              <CustomText
                variant="caption"
                color={AppColors.textInverse}
                style={styles.themeDescription}
              >
                {theme.description}
              </CustomText>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </BaseContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: verticalScale(24),
    backgroundColor: AppColors.textInverse,
  },

  /* Hero */
  heroContainer: {
    marginBottom: verticalScale(16),
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20),
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    minHeight: verticalScale(420),
  },
  heroImageStyle: {
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20),
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
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
    marginLeft: scale(8),
  },
  avatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    borderWidth: 1,
    borderColor: AppColors.textInverse,
  },
  heroIconsRow: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: scale(12),
  },
  heroTextBlock: {
    marginTop: verticalScale(16),
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    marginBottom: verticalScale(8),
    alignItems: "center",
  },
  heroDescription: {
    lineHeight: 20,
    textAlign: "center",
  },
  heroQuote: {
    marginTop: verticalScale(8),
  },

  /* Themes */
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(8),
  },

  themeCard: {
    flexDirection: "row",
    marginHorizontal: scale(16),
    marginBottom: verticalScale(12),
    borderRadius: moderateScale(12),
    overflow: "hidden",
    backgroundColor: AppColors.textInverse,
    elevation: 3,
    shadowColor: AppColors.textDark,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  themeImage: {
    width: "40%",
    height: verticalScale(90),
  },
  themeTextContainer: {
    flex: 1,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(8),
    justifyContent: "center",
  },
  themeTitle: {
    marginBottom: verticalScale(4),
  },
  themeDescription: {
    lineHeight: 16,
  },
});

export default HomeScreen;
