import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { BaseContainer } from '../../components/BaseContainer';
import CustomText from '../../components/CustomText';
import AppButton from '../../components/AppButton';
import { AppColors } from '../../theme/colors';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import ScreenHeader from '../../components/ScreenHeader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Fonts } from '../../theme/fonts';
import { completeClientProfile } from '../../services/api/userService';
import { handleApiError } from '../../utils/apiErrorHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phnNumber, setPhnNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);

      const res = await completeClientProfile({
        full_name: name,
        phone_number: phnNumber,
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        subscription_plan: 'SILVER',
      });

      Alert.alert('Success', res.message || 'Profile completed');

      // Now user is fully onboarded
      await AsyncStorage.setItem('isLoggedIn', 'true');

      const storedUser = await AsyncStorage.getItem('user');

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        parsedUser.profile_completed = true;
        await AsyncStorage.setItem('user', JSON.stringify(parsedUser));
      }

      navigation.replace('Splash');
    } catch (error) {
      const message = handleApiError(error);
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseContainer>
      {/* Header stays fixed */}
      <ScreenHeader
        title="Registration"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      {/* Scrollable + keyboard-aware content */}
      <KeyboardAwareScrollView
        contentContainerStyle={styles.keyboardView}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode={'never'}
        keyboardDismissMode="on-drag"
      >
        {/* Section title */}
        <CustomText
          variant="title"
          weight="bold"
          style={styles.sectionTitle}
          color={AppColors.primary}
        >
          Personal Details
        </CustomText>

        <CustomText
          variant="body"
          color={AppColors.textPrimary}
          style={styles.sectionSubtitle}
        >
          Enter your name and email to sign up
        </CustomText>

        {/* Inputs */}
        <View style={styles.fieldsWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor={AppColors.textGrey}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Mobile number"
            placeholderTextColor={AppColors.textGrey}
            keyboardType="phone-pad"
            value={phnNumber}
            onChangeText={setPhnNumber}
          />
        </View>

        {/* Button (will move up with keyboard, still scrollable) */}
        <AppButton
          label={loading ? 'Saving...' : 'Save'}
          onPress={handleRegister}
          containerStyle={styles.sendOtpButton}
        />
      </KeyboardAwareScrollView>
    </BaseContainer>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flexGrow: 1,
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(16),
    gap: verticalScale(4),
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: verticalScale(4),
  },
  sectionSubtitle: {
    textAlign: 'center',
    marginBottom: verticalScale(24),
  },
  fieldsWrapper: {
    marginBottom: verticalScale(14),
  },
  input: {
    borderWidth: moderateScale(1),
    borderColor: AppColors.border,
    borderRadius: moderateScale(6),
    paddingHorizontal: scale(12),
    height: verticalScale(38),
    fontSize: 16,
    marginBottom: verticalScale(12),
    backgroundColor: AppColors.surface,
    fontFamily: Fonts.regular,
    color: AppColors.textPrimary,
  },
  sendOtpButton: {
    marginTop: verticalScale(8),
  },
});

export default RegisterScreen;
