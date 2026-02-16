import React from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import CustomText from '../../../components/CustomText';

type Props = {
  image: any;
  title: string;
  price?: string;
  selected: boolean;
  onPress: () => void;
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

      <CustomText style={styles.title}>{title}</CustomText>

      {price && <CustomText style={styles.price}>{price}</CustomText>}

      <View style={[styles.button, { backgroundColor: primaryColor }]}>
        <CustomText style={styles.buttonText}>View</CustomText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    borderWidth: 1,
    borderRadius: moderateScale(12),
    padding: scale(10),
  },
  image: {
    width: '100%',
    height: verticalScale(90),
    borderRadius: moderateScale(10),
    backgroundColor: '#EEE',
    marginBottom: verticalScale(8),
  },
  title: {
    fontWeight: '800',
    color: '#111827',
  },
  price: {
    marginTop: 2,
    color: '#6B7280',
    fontWeight: '700',
  },
  button: {
    marginTop: verticalScale(10),
    height: verticalScale(36),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
