import React from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { AppColors } from "../theme/colors";
import HomeScreen from "../screens/Home/HomeScreen";
import ProfileScreen from "../screens/Home/ProfileScreen";
import EventsScreen from "../screens/Home/EventsScreen";

export type HomeTabParamList = {
  Home: undefined;
  Events: undefined;
  MyEvents: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<HomeTabParamList>();

const HomeTabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: AppColors.primary,
        tabBarInactiveTintColor: AppColors.textGrey,
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E0E0E0",
          borderTopWidth: StyleSheet.hairlineWidth,
        },
        tabBarIcon: ({ color, focused, size }) => {
          let iconName: any = "home-outline";
          let IconComponent: any = Ionicons;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
            IconComponent = Ionicons;
          } else if (route.name === "Events") {
            iconName = focused ? "party-popper" : "party-popper";
            IconComponent = MaterialCommunityIcons;
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
      {/* <Tab.Screen
        name="MyEvents"
        component={MyEventsScreen}
        options={{ title: "My Events" }}
      /> */}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    position: "absolute",
    top: -6,
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: AppColors.primary,
  },
  screen: {
    flex: 1,
    backgroundColor: AppColors.textInverse,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeTabsNavigator;
