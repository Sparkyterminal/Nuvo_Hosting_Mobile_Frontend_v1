import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BaseContainer } from '../../components/BaseContainer';
import CustomText from '../../components/CustomText';
import { HomeTabParamList } from '../../navigation/HomeTabsNavigator';
import { AppColors } from '../../theme/colors';
import { Feather } from '@expo/vector-icons';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

import { useAppSelector } from '../../store/hooks';
import ScreenHeader from '../../components/ScreenHeader';

type Props = BottomTabScreenProps<HomeTabParamList, 'Profile'>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const users = useAppSelector((state) => state.auth.user);

  const handleEditField = (field: string) => {
    console.log('Edit field:', field);
  };

  const firstLetter = users?.full_name
    ? users.full_name.charAt(0).toUpperCase()
    : '?';

  return (
    <BaseContainer>
      <ScreenHeader
        title="Profile"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover */}
        <View style={styles.coverWrapper}>
          <View style={styles.coverTopRow}>
            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            ></TouchableOpacity>
          </View>

          {/* avatar */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <CustomText
                variant="title"
                weight="bold"
                style={styles.avatarText}
                color={AppColors.primary}
              >
                {firstLetter}
              </CustomText>
            </View>
          </View>
        </View>

        {/* Name + location */}
        <View style={styles.nameBlock}>
          <CustomText
            variant="subtitle"
            weight="extraBold"
            color={AppColors.primary}
          >
            {users?.full_name?.toUpperCase() || ''}
          </CustomText>
        </View>

        {/* Fields */}
        <View style={styles.fieldsCard}>
          <ProfileFieldRow
            label="Name"
            value={users?.full_name || ''}
            onEdit={() => handleEditField('name')}
          />
          <ProfileFieldRow
            label="Email"
            value={users?.email || ''}
            onEdit={() => handleEditField('email')}
          />
          <ProfileFieldRow
            label="Phone Number"
            value={users?.phone_number || ''}
            onEdit={() => handleEditField('email')}
          />
        </View>
      </ScrollView>
    </BaseContainer>
  );
};

/** Single field row with label, value and edit icon */
interface ProfileFieldRowProps {
  label: string;
  value: string;
  onEdit: () => void;
  isLast?: boolean;
}

const ProfileFieldRow: React.FC<ProfileFieldRowProps> = ({
  label,
  value,
  onEdit,
  isLast,
}) => {
  return (
    <View style={[styles.fieldRow, !isLast && styles.fieldRowBorder]}>
      <View style={{ flex: 1 }}>
        <CustomText
          variant="caption"
          color={AppColors.primary}
          weight="medium"
          style={{ marginBottom: verticalScale(4) }}
        >
          {label}
        </CustomText>
        <CustomText
          variant="body"
          color={AppColors.surface}
        >
          {value}
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: verticalScale(24),
    backgroundColor: AppColors.background,
  },

  coverWrapper: {
    height: verticalScale(80),
    marginBottom: verticalScale(50),
  },
  coverImage: {
    flex: 1,
  },
  coverImageStyle: {
    resizeMode: 'cover',
  },
  coverOverlay: {
    flex: 1,
    backgroundColor: AppColors.overlayPrimary,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(16),
    justifyContent: 'flex-end',
  },
  coverTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  coverTitle: {
    letterSpacing: verticalScale(1.2),
  },

  avatarWrapper: {
    position: 'absolute',
    bottom: -verticalScale(40),
    alignSelf: 'center',
    width: scale(90),
    height: scale(90),
    borderRadius: scale(45),
    borderWidth: moderateScale(3),
    borderColor: AppColors.border,
    overflow: 'hidden',
    backgroundColor: AppColors.textInverse,
  },

  nameBlock: {
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },

  fieldsCard: {
    marginHorizontal: scale(16),
    borderRadius: moderateScale(12),
    backgroundColor: AppColors.textInverse,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    shadowColor: AppColors.textDark,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: verticalScale(2) },
    elevation: 3,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
  },
  fieldRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.border,
  },
  avatar: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.border, // or any soft color
  },

  avatarText: {
    fontSize: moderateScale(28),
  },
});

export default ProfileScreen;
