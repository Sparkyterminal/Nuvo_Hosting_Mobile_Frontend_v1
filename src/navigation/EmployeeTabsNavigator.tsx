import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AppColors } from '../theme/colors';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

import EmployeeHomeScreen from '../screens/EmployeeScreen/EhomeScreen';
import UpcomingEventsScreen from '../screens/EmployeeScreen/UpcomingEventsScreen';
import ProfileScreen from '../screens/Home/ProfileScreen';

export type EmployeeTabParamList = {
  Home: undefined;
  Upcoming: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<EmployeeTabParamList>();

const EmployeeTabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: AppColors.primary,
        tabBarInactiveTintColor: AppColors.textGrey,
        tabBarLabelStyle: {
          fontSize: moderateScale(12),
        },
        tabBarStyle: {
          backgroundColor: AppColors.card,
          borderTopColor: AppColors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: verticalScale(64),
          elevation: 8,
          shadowColor: AppColors.textDark,
          shadowOpacity: 0.05,
          shadowRadius: 6,
        },
        tabBarIcon: ({ color, focused, size }) => {
          let iconName: any = 'home-outline';
          let IconComponent: any = Ionicons;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
            IconComponent = Ionicons;
          } else if (route.name === 'Upcoming') {
            iconName = 'calendar-clock';
            IconComponent = MaterialCommunityIcons;
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
            IconComponent = Ionicons;
          }

          return (
            <View style={styles.tabIconWrapper}>
              {focused && <View style={styles.indicator} />}
              <IconComponent name={iconName} size={size} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={EmployeeHomeScreen} />
      <Tab.Screen name="Upcoming" component={UpcomingEventsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default EmployeeTabsNavigator;

const styles = StyleSheet.create({
  tabIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    position: 'absolute',
    top: verticalScale(-6),
    width: scale(32),
    height: verticalScale(3),
    borderRadius: moderateScale(2),
    backgroundColor: AppColors.primary,
  },
});