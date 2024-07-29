import React from "react";
import { Tabs } from "expo-router";
import { Image } from "react-native";
import useUser from "@/hooks/auth/useUser";

export default function TabsLayout() {
  const { user } = useUser();
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          let iconName;
          let customColor = color;
          if (focused) {
            customColor = "#ED2B8A";
          } else {
            customColor = "#8e8e93";
          }

          if (route.name === "index") {
            iconName = require("@/assets/icons/home.png");
          } else if (route.name === "search/index") {
            iconName = require("@/assets/icons/search.png");
          } else if (route.name === "notification/index") {
            iconName = require("@/assets/icons/notification.png");
          } else if (route.name === "transaction/index") {
            iconName = require("@/assets/icons/transaction.png");
          } else if (route.name === "profile/index") {
            iconName = require("@/assets/icons/user.png");
          }

          return (
            <Image
              style={{ tintColor: customColor, width: 25, height: 25 }}
              source={iconName}
            />
          );
        },
        headerShown: false,
        tabBarShowLabel: false,
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="search/index" />
      <Tabs.Screen name="notification/index" />
      <Tabs.Screen name="transaction/index" />
      <Tabs.Screen name="profile/index" />
    </Tabs>
  );
}
