import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Fontisto } from "@expo/vector-icons";

export default function ForgotPassword() {
  let [fontsLoaded, fontError] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <LinearGradient colors={["#FCEDF0", "#F6F7F9"]} style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: "Poppins_600SemiBold",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Reset Email Password
        </Text>
        <TextInput
          style={{
            height: 55,
            width: "100%",
            borderRadius: 8,
            fontSize: 16,
            paddingLeft: 20,
            backgroundColor: "white",
            fontFamily: "Poppins_600SemiBold",
          }}
          keyboardType="email-address"
          placeholder="Email"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={{
            paddingVertical: 15,
            borderRadius: 4,
            marginTop: 20,
            backgroundColor: "#ED2B8A",
            width: 317,
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontFamily: "Poppins_600SemiBold",
              fontSize: 20,
            }}
          >
            Kirim
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 20,
            marginTop: 20,
          }}
        >
          <Text style={{ fontSize: 18, fontFamily: "Poppins_600SemiBold" }}>
            Kembali
          </Text>
          <TouchableOpacity onPress={() => router.push("/(routes)/login")}>
            <Text
              style={{
                color: "#ED2B8A",
                fontSize: 18,
                fontFamily: "Poppins_600SemiBold",
                marginLeft: 5,
              }}
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}
