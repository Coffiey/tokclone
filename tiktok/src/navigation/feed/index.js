import { View, Text } from "react-native";
import React, { useState, createContext } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import FeedScreen from "../../screens/feed";
import ProfileScreen from "../../screens/profile";

const { Screen, Navigator } = createMaterialTopTabNavigator();
export const CurrentUserProfileItemInViewContext = createContext(null);

const FeedNavigation = () => {
  const [currentUserProfileItemView, setCurrentUserProfileItemView] =
    useState(null);
  return (
    <CurrentUserProfileItemInViewContext.Provider
      value={currentUserProfileItemView}
    >
      <Navigator
        initialRouteName='feedList'
        tabBar={() => {
          <></>;
        }}
      >
        <Screen
          name='feedList'
          component={FeedScreen}
          initialParams={{ setCurrentUserProfileItemView, profile: false }}
        />
        <Screen
          name='feedProfile'
          component={ProfileScreen}
          initialParams={{ initialUserId: null }}
        />
      </Navigator>
    </CurrentUserProfileItemInViewContext.Provider>
  );
};

export default FeedNavigation;
