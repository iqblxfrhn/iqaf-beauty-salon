import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

export default function Button({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={{
        paddingVertical: 15,
        borderRadius: 4,
        backgroundColor: "#ED2B8A",
        width: 317,
      }}
      onPress={() => onPress()}

    >
      <Text
        style={{
          color: "white",
          textAlign: "center",
          fontFamily: "Poppins_600SemiBold",
          fontSize: 20,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
