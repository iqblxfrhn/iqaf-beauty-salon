import { View, Text } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import AnimatedLoader from "react-native-animated-loader";

export default function Loader() {
  return (
    
    <LinearGradient
      colors={["#FCEDF0", "#F6F7F9"]}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      
      <AnimatedLoader
        visible={true}
        overlayColor="RGBA(252,237,240,1)"
        source={require("@/assets/animation/animation-loader.json")}
        animationStyle={{ width: 250, height: 250 }}
        speed={1.5}
      />
    </LinearGradient>
  );
}
