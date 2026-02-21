import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import CustomText from '../../components/CustomText';
import { AppColors } from '../../theme/colors';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { BaseContainer } from '../../components/BaseContainer';
import ScreenHeader from '../../components/ScreenHeader';
import themesData from '../../services/themes.json';
import { Image } from 'expo-image';
import modalData from '../../services/modalData.json';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { TouchableOpacity } from 'react-native';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ThemeDetails'
>;

const { width, height } = Dimensions.get('window');

const ExploreScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const ThemeCard = ({ item }: any) => {
    return (
      <View style={styles.card}>
        <CustomText
          variant="subtitle"
          weight="bold"
        >
          {item.title}
        </CustomText>

        <FlatList
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
        />

        <CustomText
          variant="caption"
          style={styles.description}
        >
          {item.description}
        </CustomText>

        <TouchableOpacity
          style={[styles.viewBtn, { backgroundColor: item.color }]}
          onPress={() =>
            navigation.navigate('ThemeDetails', {
              data: {
                id: item.id,
                title: item.title,
                description: item.description,
                image: { uri: item.images[0]?.url },
                color: '#305B77',
              },
            })
          }
        >
          <CustomText
            variant="caption"
            weight="bold"
            color="#fff"
          >
            View Details
          </CustomText>
        </TouchableOpacity>
      </View>
    );
  };

  const ModalCard = ({ item }: any) => {
    return (
      <View style={styles.modalCard}>
        <Image
          source={{ uri: item.image }}
          style={styles.modalImage}
          contentFit="cover"
        />

        <CustomText
          weight="bold"
          style={styles.modalName}
        >
          {item.name}
        </CustomText>
      </View>
    );
  };

  const TinderModalViewer = () => {
    const [index, setIndex] = useState(0);

    const total = modalData.modalData.length;

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

    const item = modalData.modalData[index];

    return (
      <View style={styles.tinderContainer}>
        <View style={styles.tinderCard}>
          {/* Main Image */}
          <Image
            source={{ uri: item.image }}
            style={styles.fullImage}
            contentFit="cover"
          />

          {/* Dark Gradient Overlay */}
          <View style={styles.overlay} />

          {/* Bottom Info */}
          <View style={styles.bottomInfo}>
            <View style={styles.onlineRow}></View>

            <CustomText
              weight="extraBold"
              style={styles.nameText}
            >
              {item.name}, 25 ✔
            </CustomText>
          </View>

          {/* Invisible Tap Areas */}
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

      <FlatList
        data={themesData.data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ThemeCard item={item} />}
        contentContainerStyle={styles.listContainer}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews
        ListFooterComponent={
          <>
            <CustomText
              weight="bold"
              style={styles.header}
            >
              Our Crew
            </CustomText>
            <TinderModalViewer />
          </>
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
  },

  card: {
    margin: scale(12),
    backgroundColor: '#F9F9F9',
    borderRadius: moderateScale(12),
    padding: scale(10),
  },

  imageContainer: {
    width: width - scale(24),
    marginTop: verticalScale(10),
  },

  image: {
    width: '100%',
    height: verticalScale(200),
    borderRadius: moderateScale(10),
  },

  description: {
    marginTop: verticalScale(8),
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
    backgroundColor: '#F5F5F5',
  },

  modalImage: {
    width: '100%',
    height: '85%',
  },

  modalName: {
    marginTop: verticalScale(10),
    fontSize: scale(16),
    textAlign: 'center',
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
    backgroundColor: '#F5F5F5',
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
    color: '#333',
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
    // backgroundColor: 'rgba(0,0,0,0.45)',
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
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },

  onlineText: {
    color: '#fff',
    fontSize: scale(12),
  },

  nameText: {
    color: '#fff',
    fontSize: scale(20),
  },

  locationText: {
    color: '#fff',
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

// 👉 Add autoplay to carousel
// 👉 Full screen image preview
// 👉 Lazy loading for images
// 👉 Performance optimization
