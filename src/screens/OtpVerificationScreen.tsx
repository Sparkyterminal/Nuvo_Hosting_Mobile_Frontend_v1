import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { BaseContainer } from '../components/BaseContainer';
import CustomText from '../components/CustomText';
import AppButton from '../components/AppButton';
import ScreenHeader from '../components/ScreenHeader';
import { AppColors } from '../theme/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

type Props = NativeStackScreenProps<RootStackParamList, 'OtpVerification'>;

const OTP_LENGTH = 4;

const OtpVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  // you can pass phone from route.params later; using static one for now
  const phoneNumber = '+91 8762078061';

  const [otpValues, setOtpValues] = useState<string[]>(
    Array(OTP_LENGTH).fill('')
  );
  const [secondsLeft, setSecondsLeft] = useState(50);
  const [isResendEnabled, setIsResendEnabled] = useState(false);

  const inputsRef = useRef<Array<TextInput | null>>([]);

  // countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) {
      setIsResendEnabled(true);
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleChange = (text: string, index: number) => {
    const char = text.slice(-1); // keep only last entered digit
    const newValues = [...otpValues];
    newValues[index] = char;
    setOtpValues(newValues);

    if (char && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newValues.join('').length === OTP_LENGTH) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otpValues[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (!isResendEnabled) return;
    // TODO: call API to resend OTP
    console.log('Resend OTP');
    setSecondsLeft(50);
    setIsResendEnabled(false);
  };

  const handleRegister = () => {
    const otp = otpValues.join('');
    if (otp.length !== OTP_LENGTH) return;
    console.log('Verify OTP', otp);
    // TODO: call verify API, then navigate
    // navigation.replace('SomeNextScreen');
  };

  const isOtpComplete = otpValues.join('').length === OTP_LENGTH;

  return (
    <BaseContainer>
      {/* Header */}
      <ScreenHeader
        title="OTP Verification"
        showBackButton
        onBackPress={() => navigation.goBack()}
        // showRightMenu
      />

      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={40}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title & description */}
        <CustomText
          variant="title"
          weight="bold"
          style={styles.title}
          color={AppColors.primary}
        >
          OTP Verification
        </CustomText>

        <CustomText
          variant="body"
          color={AppColors.textGearDark}
          style={styles.subtitle}
        >
          Enter the 4 digits OTP sent to you at
        </CustomText>

        <CustomText
          variant="body"
          weight="medium"
          style={styles.phone}
          color={AppColors.textGearDark}
        >
          {phoneNumber}
        </CustomText>

        {/* OTP Boxes */}
        <View style={styles.otpRow}>
          {otpValues.map((value, index) => (
            <TextInput
              key={index}
              ref={(ref: any) => (inputsRef.current[index] = ref)}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={value}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, index)
              }
              textAlign="center"
            />
          ))}
        </View>

        {/* Resend row */}
        <TouchableOpacity
          onPress={handleResend}
          disabled={!isResendEnabled}
          style={styles.resendWrapper}
        >
          <CustomText
            variant="caption"
            weight="medium"
            color={AppColors.primary}
          >
            Regenerate OTP
          </CustomText>
          <CustomText
            variant="caption"
            color={isResendEnabled ? AppColors.textGrey : AppColors.textError}
            style={{ marginLeft: 4 }}
          >
            {isResendEnabled ? '' : ` in ${secondsLeft} Seconds`}
          </CustomText>
        </TouchableOpacity>

        {/* Register button */}
        <AppButton
          label="Register"
          onPress={() => navigation.navigate('Home')}
          containerStyle={styles.registerButton}
        />
      </KeyboardAwareScrollView>
    </BaseContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(32),
    paddingBottom: verticalScale(24),
  },
  title: {
    textAlign: 'center',
    marginBottom: verticalScale(4),
  },
  subtitle: {
    textAlign: 'center',
  },
  phone: {
    textAlign: 'center',
    marginTop: verticalScale(4),
    marginBottom: verticalScale(24),
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
  },
  otpInput: {
    width: scale(56),
    height: verticalScale(48),
    borderWidth: 1,
    borderColor: AppColors.textGrey,
    borderRadius: moderateScale(6),
    fontSize: 20,
    backgroundColor: AppColors.textInverse,
  },
  resendWrapper: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginBottom: verticalScale(24),
  },
  registerButton: {
    marginTop: verticalScale(8),
  },
});

export default OtpVerificationScreen;
