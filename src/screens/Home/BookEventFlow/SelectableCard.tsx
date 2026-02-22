import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import CustomText from '../../../components/CustomText';
import { AppColors } from '../../../theme/colors';

type Props = {
  image: any;
  title: string;
  price?: string;
  selected: boolean;
  onPress: () => void;
  onViewPress?: () => void;
  primaryColor: string;
  borderColor: string;
  backgroundColor: string;
};

const cardWidth =
  (Dimensions.get('window').width - scale(14) * 2 - scale(12)) / 2;

export default function SelectableCard({
  image,
  title,
  price,
  selected,
  onPress,
  primaryColor,
  borderColor,
  backgroundColor,
  onViewPress,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        {
          borderColor: selected ? primaryColor : borderColor,
          backgroundColor,
        },
      ]}
    >
      <Image
        source={image}
        style={styles.image}
      />

      <CustomText
        weight="bold"
        style={styles.title}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </CustomText>

      {price && (
        <CustomText
          weight="medium"
          style={styles.price}
        >
          {price}
        </CustomText>
      )}

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onViewPress}
        style={[styles.button, { backgroundColor: primaryColor }]}
      >
        <CustomText
          weight="bold"
          style={styles.buttonText}
        >
          View
        </CustomText>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(12),
    padding: scale(10),
    minHeight: verticalScale(180),
  },
  image: {
    width: '100%',
    height: verticalScale(90),
    borderRadius: moderateScale(10),
    backgroundColor: AppColors.surface,
    marginBottom: verticalScale(8),
  },
  title: {
    color: AppColors.textPrimary,
  },
  price: {
    marginTop: verticalScale(2),
    color: AppColors.textSecondary,
  },
  button: {
    marginTop: 'auto',
    height: verticalScale(36),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: AppColors.textInverse,
  },
});
