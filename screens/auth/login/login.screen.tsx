import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { LinearGradient } from "expo-linear-gradient";
import {
  Entypo,
  Fontisto,
  Ionicons,
  SimpleLineIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { router } from "expo-router";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-notifications";

export default function LoginScreen() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const [required, setRequired] = useState("");
  const [error, setError] = useState({
    password: "",
  });

  let [fontsLoaded, fontError] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const handlePasswordValidation = (value: string) => {
    const password = value;
    const passwordOneNumber = /(?=.*[0-9])/;
    const passwordSixValue = /(?=.{6,})/;

    if (!passwordOneNumber.test(password)) {
      setError({
        ...error,
        password: "Password harus mengandung setidaknya satu nomor",
      });
      setUserInfo({
        ...userInfo,
        password: "",
      });
    } else if (!passwordSixValue.test(password)) {
      setError({
        ...error,
        password: "Password harus mengandung setidaknya 6 karakter",
      });
    } else {
      setError({
        ...error,
        password: "",
      });
      setUserInfo({ ...userInfo, password: value });
    }
  };

  const handleSignIn = async () => {
    await axios
      .post(`${SERVER_URI}/login`, {
        email: userInfo.email,
        password: userInfo.password,
      })
      .then(async (res) => {
        await AsyncStorage.setItem("access_token", res.data.accessToken);
        await AsyncStorage.setItem("refresh_token", res.data.refreshToken);
        router.push("/(tabs)");
      })
      .catch((error) => {
        Toast.show("Email atau Password Salah", {
          type: "danger",
        });
      });
  };

  return (
    <LinearGradient colors={["#FCEDF0", "#F6F7F9"]} style={{ flex: 1 }}>
      <ScrollView style={{ paddingHorizontal: 20 }}>
        <Image
          source={require("@/assets/logo.png")}
          style={{
            width: 132,
            height: 143,
            alignSelf: "center",
            marginTop: 70,
          }}
        />
        <Text
          style={{
            textAlign: "center",
            fontSize: 24,
            fontFamily: "Poppins_700Bold",
            marginTop: 10,
          }}
        >
          Selamat Datang
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontSize: 16,
            fontFamily: "Poppins_400Regular",
          }}
        >
          Login untuk dapat mengakses Aplikasi Iqaf Beauty Salon
        </Text>
        <View style={{ marginTop: 30, rowGap: 30 }}>
          <View>
            <TextInput
              style={{
                height: 55,
                borderRadius: 8,
                paddingLeft: 60,
                fontSize: 16,
                backgroundColor: "white",
                fontFamily: "Poppins_600SemiBold",
              }}
              keyboardType="email-address"
              value={userInfo.email}
              placeholder="Email"
              autoCapitalize="none"
              onChangeText={(value) =>
                setUserInfo({ ...userInfo, email: value })
              }
            />
            <Fontisto
              style={{ position: "absolute", left: 26, top: 16.8 }}
              name="email"
              size={20}
              color={"#ED2B8A"}
            />
            {required && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 16,
                  position: "absolute",
                  top: 60,
                }}
              >
                <Entypo name="cross" size={18} color={"red"} />
              </View>
            )}
            <View style={{ marginTop: 15 }}>
              <TextInput
                style={{
                  height: 55,
                  borderRadius: 8,
                  paddingLeft: 60,
                  fontSize: 16,
                  backgroundColor: "white",
                  fontFamily: "Poppins_600SemiBold",
                }}
                keyboardType="default"
                secureTextEntry={!isPasswordVisible}
                placeholder="*******"
                onChangeText={handlePasswordValidation}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={{ position: "absolute", right: 20, top: 15 }}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? (
                  <Ionicons
                    name="eye-off-outline"
                    size={23}
                    color={"#747474"}
                  />
                ) : (
                  <Ionicons name="eye-outline" size={23} color={"#747474"} />
                )}
              </TouchableOpacity>
              <SimpleLineIcons
                style={{
                  position: "absolute",
                  left: 26,
                  top: 17.8,
                  marginTop: -2,
                }}
                name="lock"
                size={20}
                color={"#ED2B8A"}
              />
            </View>
            {error.password && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  position: "absolute",
                  top: 145,
                }}
              >
                <Entypo
                  name="cross"
                  size={18}
                  color={"red"}
                  style={{ marginTop: -15 }}
                />
                <Text
                  style={{
                    color: "red",
                    fontSize: 12,
                    fontFamily: "Poppins_400Regular",
                    marginTop: -15,
                  }}
                >
                  {error.password}
                </Text>
              </View>
            )}
          </View>
          

          <TouchableOpacity
            style={{
              paddingVertical: 15,
              borderRadius: 4,
              backgroundColor: "#ED2B8A",
              width: 317,
            }}
            onPress={handleSignIn}
          >
            {buttonSpinner ? (
              <ActivityIndicator size={"small"} color={"white"} />
            ) : (
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 20,
                }}
              >
                Login
              </Text>
            )}
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: -10,
            }}
          >
            <TouchableOpacity>
              <FontAwesome name="google" size={30} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 20,
              marginTop: -20,
            }}
          >
            <Text style={{ fontSize: 18, fontFamily: "Poppins_600SemiBold" }}>
              Tidak Punya Akun?
            </Text>
            <TouchableOpacity onPress={() => router.push("/(routes)/sign-up")}>
              <Text
                style={{
                  color: "#ED2B8A",
                  fontSize: 18,
                  fontFamily: "Poppins_600SemiBold",
                  marginLeft: 5,
                }}
              >
                Daftar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
