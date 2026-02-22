import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import AppButton from './AppButton';
import { AppColors } from '../theme/colors';

interface FooterButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const FooterButton: React.FC<FooterButtonProps> = ({
  label,
  onPress,
  disabled,
  isLoading,
  containerStyle,
}) => {
  return (
    <View style={[styles.footerContainer, containerStyle]}>
      <AppButton
        label={label}
        onPress={onPress}
        disabled={disabled}
        isLoading={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: AppColors.card,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
});

export default FooterButton;
