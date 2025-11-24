import React, { useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { BaseContainer } from '../components/BaseContainer';
import CustomText from '../components/CustomText';
import AppButton from '../components/AppButton';
import { AppColors } from '../theme/colors';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import ScreenHeader from '../components/ScreenHeader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phnNumber, setPhnNumber] = useState('');

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
        // onTouchStart={() => Keyboard.dismiss()}
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
          color={AppColors.textGearDark}
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
            placeholder="E-mail"
            placeholderTextColor={AppColors.textGrey}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Mobile number"
            placeholderTextColor={AppColors.textGrey}
            keyboardType="phone-pad"
            value={phnNumber}
            onChangeText={setPhnNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={AppColors.textGrey}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={AppColors.textGrey}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {/* Button (will move up with keyboard, still scrollable) */}
        <AppButton
          label="Send OTP"
          onPress={() => console.log(navigation.navigate('OtpVerification'))}
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
    borderWidth: 1,
    borderColor: AppColors.textGrey,
    borderRadius: moderateScale(6),
    paddingHorizontal: scale(12),
    height: verticalScale(38),
    fontSize: 16,
    marginBottom: verticalScale(12),
    backgroundColor: '#FFFFFF',
  },
  sendOtpButton: {
    marginTop: verticalScale(8),
  },
});

export default RegisterScreen;
