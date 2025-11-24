import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { BaseContainer } from '../components/BaseContainer';
import CustomText from '../components/CustomText';
import AppButton from '../components/AppButton';
import ScreenHeader from '../components/ScreenHeader';
import { AppColors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import AppInput from '../components/AppInput';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LooginScreen: React.FC<Props> = ({ navigation }) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  const isValid = mobile.trim().length > 0 && password.trim().length > 0;

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
          // showRightMenu
          // onRightPress={() => {}}
        />

        {/* Content */}
        <View style={styles.content}>
          {/* Screen title */}
          <CustomText
            variant="title"
            weight="bold"
            style={styles.title}
            color={AppColors.primary}
          >
            Login
          </CustomText>

          <CustomText
            variant="body"
            color={AppColors.textGearDark}
            style={styles.subtitle}
          >
            Enter your mobile number and password
          </CustomText>

          {/* Fields */}
          <View style={styles.fieldsWrapper}>
            {/* Mobile number */}
            <AppInput
              placeholder="Mobile Number"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={setMobile}
            />

            {/* Password with eye icon */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor={AppColors.textGrey}
                secureTextEntry={hidePassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setHidePassword((prev) => !prev)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={AppColors.textGrey}
                />
              </TouchableOpacity>
            </View>

            {/* Forgot password */}
            <TouchableOpacity
              style={styles.forgotWrapper}
              onPress={() => console.log('Forgot Password pressed')}
            >
              <CustomText
                variant="caption"
                weight="medium"
                color={AppColors.primary}
              >
                Forgot Password ?
              </CustomText>
            </TouchableOpacity>
          </View>

          {/* Login button */}
          <AppButton
            label="Login"
            onPress={() => navigation.navigate('Onboarding')}
            // disabled={!isValid}
            containerStyle={styles.loginButton}
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
  },
  title: {
    textAlign: 'center',
    marginBottom: verticalScale(4),
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: verticalScale(24),
  },
  fieldsWrapper: {
    marginBottom: verticalScale(24),
  },
  passwordContainer: {
    borderWidth: 1,
    borderColor: AppColors.textGrey,
    borderRadius: moderateScale(6),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    height: verticalScale(38),
    backgroundColor: '#FFFFFF',
    marginTop: verticalScale(4),
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
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
});

export default LooginScreen;
