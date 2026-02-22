import React from 'react';
import { StyleSheet } from 'react-native';
import { verticalScale } from 'react-native-size-matters';
import CustomText from './CustomText';
import { AppColors } from '../theme/colors';

type Props = {
  text: string;
  color?: string;
  marginTop?: number;
};

const FieldLabel = ({ text }: Props) => {
  return (
    <CustomText
      weight="bold"
      style={styles.label}
    >
      {text}
    </CustomText>
  );
};

export default FieldLabel;

const styles = StyleSheet.create({
  label: {
    marginTop: verticalScale(10),
    marginBottom: verticalScale(6),
    color: AppColors.textPrimary,
  },
});
