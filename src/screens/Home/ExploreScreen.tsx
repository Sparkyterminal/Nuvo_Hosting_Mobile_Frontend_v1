import { useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import CustomText from '../../components/CustomText';
import { AppColors } from '../../theme/colors';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { BaseContainer } from '../../components/BaseContainer';
import ScreenHeader from '../../components/ScreenHeader';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import AppButton from '../../components/AppButton';
import Loader from '../../components/Loader';
import { useAppSelector } from '../../store/hooks';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ThemeDetails'
>;
const { width, height } = Dimensions.get('window');

const ExploreScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const {
    themes,
    modals: modalsList,
    loading,
  } = useAppSelector((state) => state.explore);

  const ThemeCard = ({ item }: any) => {
    return (
      <View style={styles.card}>
        <CustomText
          variant="subtitle"
          weight="bold"
          color={AppColors.textPrimary}
        >
          {item.theme_name}
        </CustomText>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.cover_image + '?w=800&q=60' }}
            style={styles.image}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        </View>

        {/* <FlatList
          data={item.images}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(img) => img.id.toString()}
          snapToInterval={width - scale(24)}
          decelerationRate="fast"
          snapToAlignment="center"
          renderItem={({ item: img }) => (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: img.url + '?w=800&q=60' }}
                style={styles.image}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
            </View>
          )}
        /> */}

        <CustomText
          variant="caption"
          style={styles.description}
        >
          {item.description}
        </CustomText>

        <AppButton
          label="View Details"
          containerStyle={styles.viewBtn}
          onPress={() =>
            navigation.navigate('ThemeDetails', {
              data: {
                id: item.id,
                title: item.theme_name,
                description: item.description,
                image: { uri: item.cover_image },
                color: AppColors.primary,
              },
              from: 'explore',
            })
          }
        />
      </View>
    );
  };

  const TinderModalViewer = () => {
    const [index, setIndex] = useState(0);

    const total = modalsList.length;

    const next = () => {
      if (index < total - 1) {
        setIndex(index + 1);
      }
    };

    const prev = () => {
      if (index > 0) {
        setIndex(index - 1);
      }
    };

    const item = modalsList[index];

    // Prevent crash when API not loaded yet
    if (!item) return null;

    return (
      <View style={styles.tinderContainer}>
        <View style={styles.tinderCard}>
          {/* Image */}
          <Image
            source={{
              uri:
                item.profile_picture ||
                item.gallery_images?.[0] ||
                'https://via.placeholder.com/300',
            }}
            style={styles.fullImage}
            contentFit="cover"
          />

          {/* Overlay */}
          <View style={styles.overlay} />

          {/* Info */}
          <View style={styles.bottomInfo}>
            <CustomText
              weight="extraBold"
              style={styles.nameText}
            >
              {item.full_name}
            </CustomText>
          </View>

          {/* Tap Areas */}
          <View style={styles.touchRow}>
            <View
              style={styles.leftTap}
              onTouchEnd={prev}
            />
            <View
              style={styles.rightTap}
              onTouchEnd={next}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <BaseContainer>
      <ScreenHeader
        title="Explore"
        showBackButton
      />
      <Loader visible={loading} />

      <FlatList
        data={themes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ThemeCard item={item} />}
        contentContainerStyle={styles.listContainer}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews
        ListFooterComponent={
          !loading && themes.length > 0 ? (
            <>
              <CustomText
                weight="bold"
                style={styles.header}
              >
                Our Crew
              </CustomText>
              <TinderModalViewer />
            </>
          ) : null
        }
      />
    </BaseContainer>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: verticalScale(20),
  },
  header: {
    marginTop: scale(20),
    fontSize: scale(18),
    textAlign: 'center',
    color: AppColors.textPrimary,
  },

  card: {
    margin: scale(12),
    backgroundColor: AppColors.surface,
    borderRadius: moderateScale(12),
    padding: scale(10),
  },

  imageContainer: {
    width: '100%',
    marginTop: verticalScale(10),
  },

  image: {
    width: '100%',
    height: verticalScale(200),
    borderRadius: moderateScale(12),
  },

  description: {
    marginTop: verticalScale(8),
    color: AppColors.textGrey,
  },

  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: verticalScale(8),
  },

  // modal card

  modalCard: {
    width: width,
    height: height * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
  },

  modalImage: {
    width: '100%',
    height: '85%',
  },

  modalName: {
    marginTop: verticalScale(10),
    fontSize: scale(16),
    textAlign: 'center',
    color: AppColors.textPrimary,
  },

  // modal 2.0
  tinderContainer: {
    width: width,
    height: height * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tinderCard: {
    width: width,
    height: height * 0.75,
    backgroundColor: AppColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  touchRow: {
    position: 'absolute',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },

  leftTap: {
    width: '50%',
    height: '100%',
  },

  rightTap: {
    width: '50%',
    height: '100%',
  },

  counter: {
    position: 'absolute',
    bottom: verticalScale(10),
    fontSize: scale(14),
    color: AppColors.textPrimary,
  },

  // modal 3.0

  fullImage: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(16),
  },

  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%',
    borderBottomLeftRadius: moderateScale(16),
    borderBottomRightRadius: moderateScale(16),
  },

  rightActions: {
    position: 'absolute',
    right: scale(12),
    bottom: verticalScale(80),
    alignItems: 'center',
  },

  actionButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(12),
  },

  bottomInfo: {
    position: 'absolute',
    left: scale(16),
    bottom: verticalScale(20),
  },

  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },

  onlineDot: {
    width: scale(10),
    height: verticalScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: AppColors.success,

    marginRight: scale(6),
  },

  onlineText: {
    color: AppColors.textInverse,
    fontSize: scale(12),
  },

  nameText: {
    color: AppColors.textInverse,
    fontSize: scale(20),
  },

  locationText: {
    color: AppColors.textInverse,
    fontSize: scale(14),
    marginTop: verticalScale(4),
  },
  viewBtn: {
    marginTop: verticalScale(10),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
});

export default ExploreScreen;
