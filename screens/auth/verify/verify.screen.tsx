import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Button from "@/components/button/button";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import { Toast } from "react-native-toast-notifications";

export default function VerifyAccountScreen() {
  const [code, setCode] = useState(new Array(4).fill(""));

  const inputs = useRef<any>([...Array(4)].map(() => React.createRef()));

  const handleInput = (text: any, index: any) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputs.current[index + 1].current.focus();
    }

    if (text === "" && index > 0) {
      inputs.current[index - 1].current.focus();
    }
  };

  const handleSubmit = async () => {
    const otp = code.join("");
    const activation_token = await AsyncStorage.getItem("activation_token");

    await axios
      .post(`${SERVER_URI}/activate-user`, {
        activation_token,
        activation_code: otp,
      })
      .then((res: any) => {
        Toast.show("Aktifasi Akun anda Berhasil", {
          type: "success",
        });
        setCode(new Array(4).fill(""));
        router.push("/(routes)/login");
      })
      .catch((error) => {
        Toast.show("Kode OTP anda tidak Valid atau Kadaluarsa, Silahkan Isi Formulir Kembali", {
          type: "danger",
        });
        router.back();
        setCode(new Array(4).fill(""));
      });
  };
  return (
    <LinearGradient
      colors={["#FCEDF0", "#F6F7F9"]}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <View
        style={{
          paddingHorizontal: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontFamily: "Poppins_700Bold",
            marginBottom: 10,
          }}
        >
          Verifikasi Kode
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins_400Regular",
            textAlign: "center",
            marginBottom: 20,
            color: "#575757",
          }}
        >
          Kami telah mengirimkan kode Verifikasi ke Email anda{" "}
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 20,
          }}
        >
          {code.map((_, index) => (
            <TextInput
              key={index}
              style={{
                width: 60,
                height: 60,
                borderWidth: 1,
                borderColor: "#ED2B8A",
                textAlign: "center",
                borderRadius: 10,
                marginHorizontal: 10,
                fontSize: 24,
                fontFamily: "Poppins_700Bold",
              }}
              keyboardType="number-pad"
              maxLength={1}
              ref={inputs.current[index]}
              onChangeText={(text) => handleInput(text, index)}
              value={code[index]}
              autoFocus={index === 0}
            />
          ))}
        </View>

        <View style={{ marginTop: 20 }}>
          <Button title="Kirim" onPress={handleSubmit} />
        </View>
        <TouchableOpacity onPress={() => router.push("/(routes)/login")}>
          <Text
            style={{
              marginTop: 20,
              color: "#ED2B8A",
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
            }}
          >
            Kembali untuk Login
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
