import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { Fonts } from '../theme/fonts';

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
  title: { fontSize: 24, lineHeight: 30 },
  subtitle: { fontSize: 18, lineHeight: 24 },
  body: { fontSize: 16, lineHeight: 22 },
  caption: { fontSize: 12, lineHeight: 16 },
});

//  Base styling
const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default CustomText;
