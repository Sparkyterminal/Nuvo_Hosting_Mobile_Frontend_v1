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
import { Ionicons, Feather } from '@expo/vector-icons';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

type Props = BottomTabScreenProps<HomeTabParamList, 'Profile'>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const user = {
    name: 'Stark',
    location: 'CPT',
    email: 'stark@gmail.com',
    userId: '9999',
    zipCode: '562108',
  };

  const handleEditField = (field: string) => {
    console.log('Edit field:', field);
  };

  return (
    <BaseContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover */}
        <View style={styles.coverWrapper}>
          <ImageBackground
            source={require('../../assets/images/Tony_Stark.jpg')}
            style={styles.coverImage}
            imageStyle={styles.coverImageStyle}
          >
            <View style={styles.coverOverlay}>
              <View style={styles.coverTopRow}>
                <TouchableOpacity
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather
                    name="camera"
                    size={22}
                    color={AppColors.textInverse}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>

          {/* avatar */}
          <View style={styles.avatarWrapper}>
            <Image
              source={require('../../assets/images/Tony_Stark.jpg')}
              style={styles.avatar}
            />
          </View>
        </View>

        {/* Name + location */}
        <View style={styles.nameBlock}>
          <CustomText
            variant="subtitle"
            weight="extraBold"
            color={AppColors.primary}
          >
            {user.name.toUpperCase()}
          </CustomText>
          <CustomText
            variant="caption"
            color={AppColors.textGrey}
            style={{ marginTop: verticalScale(2) }}
          >
            {user.location.toUpperCase()}
          </CustomText>
        </View>

        {/* Fields */}
        <View style={styles.fieldsCard}>
          <ProfileFieldRow
            label="Name"
            value={user.name}
            onEdit={() => handleEditField('name')}
          />
          <ProfileFieldRow
            label="Email"
            value={user.email}
            onEdit={() => handleEditField('email')}
          />
          <ProfileFieldRow
            label="Password"
            value="********"
            onEdit={() => handleEditField('password')}
          />
          <ProfileFieldRow
            label="User ID"
            value={user.userId}
            onEdit={() => handleEditField('userId')}
          />
          <ProfileFieldRow
            label="Zip Code"
            value={user.zipCode}
            onEdit={() => handleEditField('zipCode')}
            isLast
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

      <TouchableOpacity
        onPress={onEdit}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name="pencil-outline"
          size={20}
          color={AppColors.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: verticalScale(24),
    backgroundColor: AppColors.background,
  },

  coverWrapper: {
    height: verticalScale(180),
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
  avatar: {
    width: '100%',
    height: '100%',
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
});

export default ProfileScreen;
