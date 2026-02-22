import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { BaseContainer } from '../../components/BaseContainer';
import CustomText from '../../components/CustomText';
import ScreenHeader from '../../components/ScreenHeader';
import { AppColors } from '../../theme/colors';

import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import AppInput from '../../components/AppInput';
import FooterButton from '../../components/FooterButton';
import Checkbox from 'expo-checkbox';
import AppBottomSheet from '../../components/AppBottomSheet';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LooginScreen: React.FC<Props> = ({ navigation }) => {
  const [mobile, setMobile] = useState('');
  // const [isChecked, setIsChecked] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetTitle, setSheetTitle] = useState('');
  const [sheetContent, setSheetContent] = useState('');
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  const isValid = mobile.trim().length > 0 && privacyChecked && termsChecked;

  console.log('isValid=== ', isValid);

  const handlePrivacyPolicy = () => {
    setSheetTitle('Privacy Policy');
    setSheetContent(
      'This is the Privacy Policy details. Here you can show long text or list related to privacy policy. You can also load this from API.',
    );
    setSheetVisible(true);
  };

  const handleTerms = () => {
    setSheetTitle('Terms of Use');
    setSheetContent(
      'This is the Terms of Use content. You can show all terms and conditions here in a scrollable view.',
    );
    setSheetVisible(true);
  };

  return (
    <BaseContainer>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <ScreenHeader
          title="Login"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />

        {/* Content */}
        <View style={styles.content}>
          {/* Screen title */}
          <View style={{ flex: 3 }}>
            <CustomText
              variant="title"
              weight="bold"
              style={styles.title}
              color={AppColors.primary}
            >
              Your Email Id
            </CustomText>

            <CustomText
              variant="body"
              color={AppColors.textGrey}
              style={styles.subtitle}
            >
              Enter your Email
            </CustomText>

            {/* Fields */}

            <AppInput
              placeholder="Enter Your Email"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={setMobile}
            />
          </View>

          <View style={styles.checkboxContainer}>
            <View style={styles.checkboxWrapper}>
              <Checkbox
                value={privacyChecked}
                onValueChange={setPrivacyChecked}
                color={privacyChecked ? AppColors.primary : AppColors.border}
              />

              <CustomText
                variant="caption"
                style={styles.checkboxText}
              >
                I have read and accept the{' '}
                <CustomText
                  style={styles.linkText}
                  onPress={handlePrivacyPolicy}
                >
                  Privacy Policy
                </CustomText>{' '}
                and agree that my personal data will be processed by you
              </CustomText>
            </View>
            <View style={styles.checkboxWrapper}>
              <Checkbox
                value={termsChecked}
                onValueChange={setTermsChecked}
                color={termsChecked ? AppColors.primary : undefined}
              />

              <CustomText
                variant="caption"
                style={styles.checkboxText}
              >
                I have read and accept the{' '}
                <CustomText
                  style={styles.linkText}
                  onPress={handleTerms}
                >
                  Terms of Use
                </CustomText>
              </CustomText>
            </View>

            {/* Login button */}
            <FooterButton
              label="Send OPT"
              onPress={() => navigation.navigate('Onboarding')}
              disabled={!isValid}
            />
          </View>
          <AppBottomSheet
            visible={sheetVisible}
            title={sheetTitle}
            content={sheetContent}
            onClose={() => setSheetVisible(false)}
          />
        </View>
      </KeyboardAvoidingView>
    </BaseContainer>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(32),
    backgroundColor: AppColors.background,
  },
  title: {
    textAlign: 'center',
    marginBottom: verticalScale(4),
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: verticalScale(24),
  },

  passwordInput: {
    flex: 1,
    fontSize: scale(16),
  },
  eyeButton: {
    marginLeft: scale(8),
  },
  forgotWrapper: {
    alignSelf: 'flex-end',
    marginTop: verticalScale(6),
  },
  loginButton: {
    marginTop: verticalScale(8),
  },
  checkboxWrapper: {
    gap: scale(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    flex: 1,
    paddingHorizontal: scale(10),
    gap: scale(10),
  },

  checkboxText: {
    color: AppColors.textPrimary,
  },
  linkText: {
    color: AppColors.primary,
  },
});

export default LooginScreen;
