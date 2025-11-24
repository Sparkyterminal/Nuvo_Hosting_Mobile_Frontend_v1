import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import CustomText from './CustomText';
import { AppColors } from '../theme/colors';

type ButtonVariant = 'primary' | 'outline' | 'ghost';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  isLoading?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const AppButton: React.FC<AppButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  isLoading = false,
  containerStyle,
}) => {
  const isDisabled = disabled || isLoading;

  const backgroundColor =
    variant === 'primary' ? AppColors.primary : 'transparent';

  const borderColor = variant === 'outline' ? AppColors.primary : 'transparent';

  const textColor =
    variant === 'primary' ? AppColors.textInverse : AppColors.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        { backgroundColor, borderColor },
        isDisabled && styles.disabled,
        containerStyle,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <CustomText
          variant="body"
          weight="medium"
          color={textColor}
          style={styles.label}
        >
          {label}
        </CustomText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default AppButton;
