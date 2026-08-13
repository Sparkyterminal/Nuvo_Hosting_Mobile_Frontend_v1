import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomText from './CustomText';
import AppButton from './AppButton';
import { AppColors } from '../theme/colors';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface Props {
  visible: boolean;
  onAllow: () => void;
  onDeny: () => void;
}

// Google Play requires a "prominent in-app disclosure" of background location
// use, shown BEFORE the OS permission prompt — the system permission dialog
// alone does not satisfy this policy requirement.
const LocationDisclosureModal: React.FC<Props> = ({
  visible,
  onAllow,
  onDeny,
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onDeny}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconWrap}>
            <Ionicons name="location" size={moderateScale(28)} color={AppColors.primary} />
          </View>

          <CustomText weight="bold" variant="title" style={styles.title}>
            Nuvo Hosting collects location data to enable live crew tracking
            for admin, even when the app is closed or not in use.
          </CustomText>

          <CustomText style={styles.body}>
            While you are marked Online for an assigned event, we share your
            precise location — including in the background — with the Nuvo
            Hosting admin team so they can coordinate crew arrival, safety,
            and on-duty status during that event.
          </CustomText>

          <CustomText style={styles.body}>
            Location sharing stops as soon as you switch back to Offline.
          </CustomText>

          <AppButton
            label="Allow Location Access"
            onPress={onAllow}
            containerStyle={styles.button}
          />
          <AppButton
            label="Not Now"
            variant="ghost"
            onPress={onDeny}
            containerStyle={styles.button}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: AppColors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  container: {
    width: '100%',
    backgroundColor: AppColors.card,
    borderRadius: moderateScale(16),
    padding: scale(20),
  },
  iconWrap: {
    alignSelf: 'center',
    marginBottom: verticalScale(12),
  },
  title: {
    textAlign: 'center',
    marginBottom: verticalScale(12),
  },
  body: {
    color: AppColors.textSecondary,
    marginBottom: verticalScale(10),
  },
  button: {
    marginTop: verticalScale(8),
  },
});

export default LocationDisclosureModal;
