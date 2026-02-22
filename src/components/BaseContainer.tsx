import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { AppColors } from '../theme/colors';

export const BaseContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <SafeAreaView
    style={styles.container}
    edges={['top', 'bottom']}
  >
    {children}
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: AppColors.secondary,
    backgroundColor: AppColors.background,
  },
});
