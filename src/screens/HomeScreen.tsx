import React from 'react';
import { StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { BaseContainer } from '../components/BaseContainer';
import CustomText from '../components/CustomText';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <BaseContainer>
      {/* Header stays fixed */}
      <CustomText>hello</CustomText>
    </BaseContainer>
  );
};

const styles = StyleSheet.create({});

export default HomeScreen;
