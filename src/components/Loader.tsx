import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AppColors } from '../theme/colors';

const Loader = ({ visible = false }: { visible?: boolean }) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={AppColors.primary}
      />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // full screen overlay
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)', // optional dim background
    zIndex: 999,
  },
});
