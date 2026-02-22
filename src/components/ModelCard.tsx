import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import CustomText from './CustomText';
import { AppColors } from '../theme/colors';
// import CustomText from '../CustomText';

type Props = {
  image: string;
  name: string;
  height: string;
  selected: boolean;
  onPress: () => void;
  primaryColor: string;
  borderColor: string;
  textColor: string;
  mutedColor: string;
};

const ModelCard = ({
  image,
  name,
  height,
  selected,
  onPress,
  primaryColor,
  borderColor,
  textColor,
  mutedColor,
}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        {
          borderColor: selected ? primaryColor : borderColor,
        },
      ]}
    >
      <Image
        source={{ uri: image }}
        style={styles.image}
      />

      <View style={styles.content}>
        <CustomText
          weight="extraBold"
          style={{
            color: textColor,
          }}
          numberOfLines={1}
        >
          {name}
        </CustomText>

        <CustomText
          style={{
            marginTop: 4,
            color: mutedColor,
            fontSize: 12,
          }}
        >
          Height: {height}
        </CustomText>
      </View>

      {/* Optional Selected Badge */}
      {selected && (
        <View style={[styles.badge, { backgroundColor: primaryColor }]}>
          <CustomText
            weight="extraBold"
            style={{
              color: AppColors.textInverse,
              fontSize: 10,
            }}
          >
            Selected
          </CustomText>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ModelCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.card,
    borderRadius: moderateScale(16),
    borderWidth: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: verticalScale(140),
  },
  content: {
    padding: scale(8),
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
});
