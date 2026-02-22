import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AppColors } from '../theme/colors';
import CustomText from './CustomText';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

interface ScreenHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  showRightMenu?: boolean;
  onRightPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  showBackButton = true,
  onBackPress,
  showRightMenu = false,
  onRightPress,
  containerStyle,
}) => {
  return (
    <View style={[styles.headerRow, containerStyle]}>
      {/* Left icon */}
      {showBackButton ? (
        <TouchableOpacity
          onPress={onBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={AppColors.primary}
          />
        </TouchableOpacity>
      ) : (
        // keep layout balanced when no back button
        <View style={styles.iconPlaceholder} />
      )}

      {/* Title */}
      <CustomText
        variant="title"
        weight="bold"
        style={styles.headerTitle}
        color={AppColors.textPrimary}
      >
        {title}
      </CustomText>

      {/* Right icon (optional menu) */}
      {showRightMenu ? (
        <TouchableOpacity
          onPress={onRightPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons
            name="more-vert"
            size={24}
            color={AppColors.textPrimary}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(4),

    backgroundColor: AppColors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.border,
  },
  headerTitle: {
    flex: 1,

    paddingHorizontal: moderateScale(18),
  },
  iconPlaceholder: {
    width: moderateScale(24),
    height: moderateScale(24),
  },
});

export default ScreenHeader;
