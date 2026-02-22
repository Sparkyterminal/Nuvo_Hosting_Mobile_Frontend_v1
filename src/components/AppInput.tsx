import React, { useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { AppColors } from '../theme/colors';
import CustomText from './CustomText';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Fonts } from '../theme/fonts';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <CustomText
          variant="caption"
          weight="medium"
          color={AppColors.textSecondary}
          style={styles.label}
        >
          {label}
        </CustomText>
      ) : null}

      <TextInput
        style={[
          styles.input,
          { fontFamily: Fonts.regular },
          isFocused && styles.inputFocused,
          !!error && styles.inputError,
          style,
        ]}
        placeholderTextColor={AppColors.textGrey}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />

      {!!error && (
        <CustomText
          variant="caption"
          color={AppColors.error}
          style={styles.errorText}
        >
          {error}
        </CustomText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(12),
  },
  label: {
    marginBottom: verticalScale(4),
  },
  input: {
    borderWidth: scale(1),
    borderColor: AppColors.border,
    borderRadius: moderateScale(6),
    paddingHorizontal: scale(12),
    height: verticalScale(38),
    fontSize: scale(16),
    backgroundColor: AppColors.surface,

    fontFamily: Fonts.regular,
  },
  inputFocused: {
    borderColor: AppColors.primary,
  },
  inputError: {
    borderColor: AppColors.error,
  },
  errorText: {
    marginTop: verticalScale(4),
  },
});

export default AppInput;
