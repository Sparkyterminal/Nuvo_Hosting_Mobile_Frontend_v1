import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { Fonts } from '../theme/fonts';
import { moderateScale } from 'react-native-size-matters';

interface CustomTextProps extends TextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption';
  weight?: 'thin' | 'light' | 'regular' | 'medium' | 'bold' | 'extraBold';
  color?: string;
  children: React.ReactNode;
}

const CustomText: React.FC<CustomTextProps> = ({
  variant = 'body',
  weight = 'regular',
  color,
  style,
  children,
  ...rest
}) => {
  const colors = useThemeColors();

  return (
    <RNText
      style={[
        styles.base,
        variantStyles[variant],
        { fontFamily: Fonts[weight] },
        { color: color || colors.textPrimary },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

// Font variants
const variantStyles = StyleSheet.create({
  title: {
    fontSize: moderateScale(24),
    lineHeight: moderateScale(30),
  },

  subtitle: {
    fontSize: moderateScale(18),
    lineHeight: moderateScale(24),
  },
  body: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
  },
  caption: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
  },
});

//  Base styling
const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default CustomText;
