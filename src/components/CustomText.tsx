import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { Fonts, HeadingFonts } from '../theme/fonts';
import { moderateScale } from 'react-native-size-matters';

interface CustomTextProps extends TextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption';
  weight?: 'thin' | 'light' | 'regular' | 'medium' | 'bold' | 'extraBold';
  color?: string;
  children: React.ReactNode;
}

// App-wide uppercase. We transform the actual string content rather than using
// CSS `textTransform: 'uppercase'`, because RN measures the original-cased text
// but renders the wider uppercased text — which clips the trailing glyph
// (e.g. the "O" in "LET'S GO"). Transforming the string keeps measurement and
// rendering in sync. String elements nested in `children` (e.g. inline links)
// are their own <CustomText> and get uppercased by their own instance.
const toUpper = (node: React.ReactNode): React.ReactNode => {
  if (typeof node === 'string') return node.toUpperCase();
  if (Array.isArray(node)) return node.map(toUpper);
  return node;
};

const CustomText: React.FC<CustomTextProps> = ({
  variant = 'body',
  weight = 'regular',
  color,
  style,
  children,
  ...rest
}) => {
  const colors = useThemeColors();

  // Headings use Didot; body/caption use Helvetica Now.
  const isHeading = variant === 'title' || variant === 'subtitle';
  const fontFamily = isHeading
    ? weight === 'bold' || weight === 'extraBold'
      ? HeadingFonts.bold
      : HeadingFonts.regular
    : Fonts[weight];

  return (
    <RNText
      style={[
        styles.base,
        variantStyles[variant],
        { fontFamily },
        { color: color || colors.textPrimary },
        style,
      ]}
      {...rest}
    >
      {toUpper(children)}
    </RNText>
  );
};

// Font variants
// Type scale. Line-heights are a touch roomier and a small positive
// letter-spacing (tracking) is applied because the app renders text in all-caps,
// which reads more comfortably with extra spacing between letters and lines.
const variantStyles = StyleSheet.create({
  title: {
    fontSize: moderateScale(24),
    lineHeight: moderateScale(32),
    letterSpacing: 0.3,
  },

  subtitle: {
    fontSize: moderateScale(18),
    lineHeight: moderateScale(26),
    letterSpacing: 0.3,
  },
  body: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
    letterSpacing: 0.3,
  },
  caption: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(17),
    letterSpacing: 0.2,
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
