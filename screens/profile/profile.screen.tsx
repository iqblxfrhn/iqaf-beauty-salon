import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import useUser from '@/hooks/auth/useUser';
import Loader from '@/components/loader/loader';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { user, loading, setRefetch } = useUser();
  const [image, setImage] = useState<any>(null);
  const [loader, setLoader] = useState(false);

  const logoutHandler = async () => {
    await AsyncStorage.setItem('access_token', '');
    await AsyncStorage.setItem('refresh_token', '');
    router.push('/(routes)/login');
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setLoader(true);
      const base64Image = `data:image/jpg;base64,${base64}`;
      setImage(base64Image);

      const accessToken = await AsyncStorage.getItem('access_token');
      const refreshToken = await AsyncStorage.getItem('refresh_token');

      try {
        const response = await axios.put(
          `${SERVER_URI}/update-user-avatar`,
          {
            avatar: base64Image,
          },
          {
            headers: {
              'access-token': accessToken,
              'refresh-token': refreshToken,
            },
          },
        );
        if (response.data) {
          setRefetch(true);
          setLoader(false);
        }
      } catch (error) {
        setLoader(false);

        console.log(error);
      }
    }
  };

  let [fontsLoaded, fontError] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <>
      {loader || loading ? (
        <Loader />
      ) : (
        <LinearGradient colors={['#FCEDF0', '#F6F7F9']} style={{ flex: 1 }}>
          <View style={{ paddingTop: 50 }}>
            <ScrollView>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <View style={{ position: 'relative' }}>
                  <Image
                    source={{
                      uri:
                        image ||
                        user?.avatar?.url ||
                        'https://res.cloudinary.com/iqbalxfrhn/image/upload/v1721111006/avatars/user_rm4mol.jpg',
                    }}
                    style={{ width: 90, height: 90, borderRadius: 100 }}
                  />
                  <TouchableOpacity
                    onPress={pickImage}
                    style={{
                      position: 'absolute',
                      bottom: 5,
                      right: 0,
                      width: 30,
                      height: 30,
                      backgroundColor: '#ED2B8A',
                      borderRadius: 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Ionicons name="camera-outline" size={22} color={'#fff'} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 24,
                  marginTop: 10,
                  fontFamily: 'Poppins_600SemiBold',
                }}>
                {user?.name}
              </Text>
              <View
                style={{
                  marginHorizontal: 10,
                  marginTop: 20,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    marginBottom: 8,
                    fontFamily: 'Poppins_700Bold',
                  }}>
                  Detail Akun
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/(routes)/profile-details')}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      columnGap: 20,
                    }}>
                    <View
                      style={{
                        borderWidth: 2,
                        borderColor: '#dde2ec',
                        padding: 15,
                        borderRadius: 100,
                        width: 55,
                        height: 55,
                      }}>
                      <FontAwesome
                        style={{ alignSelf: 'center' }}
                        name="user-o"
                        size={20}
                        color={'black'}
                      />
                    </View>
                    <View>
                      <Text style={{ fontSize: 16, fontFamily: 'Poppins_700Bold' }}>
                        Detail Profil
                      </Text>
                      <Text
                        style={{
                          color: '#575757',
                          fontFamily: 'Poppins_400Regular',
                        }}>
                        Informasi Akun
                      </Text>
                    </View>
                  </View>
                  <AntDesign name="right" size={26} color={'#cbd5e0'} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                  }}
                  onPress={() => logoutHandler()}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      columnGap: 20,
                    }}>
                    <View
                      style={{
                        borderWidth: 2,
                        borderColor: '#dde2ec',
                        padding: 15,
                        borderRadius: 100,
                        width: 55,
                        height: 55,
                      }}>
                      <Ionicons
                        style={{ alignSelf: 'center' }}
                        name="log-out-outline"
                        size={20}
                        color={'black'}
                      />
                    </View>
                    <View>
                      <Text style={{ fontSize: 16, fontFamily: 'Poppins_700Bold' }}>Log Out</Text>
                    </View>
                  </View>
                  <AntDesign name="right" size={26} color={'#cbd5e0'} />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </LinearGradient>
      )}
    </>
  );
}
