import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EmployeeProfileScreen = () => {
  // ⭐ simple function
  const loadProfile = () => {
    console.log('Employee Profile Loaded');
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee Profile Screen</Text>
      <Text>Employee Profile Details Here 👤</Text>
    </View>
  );
};

export default EmployeeProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
});
