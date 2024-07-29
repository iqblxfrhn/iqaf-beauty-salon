import { View, Text, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useUser from '@/hooks/auth/useUser';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import { AntDesign, FontAwesome5, Ionicons } from '@expo/vector-icons';
import Loader from '@/components/loader/loader';

export default function ProfileDetailsScreen() {
  const { user, loading, setRefetch } = useUser();
  const [image, setImage] = useState<any>(null);
  const [loader, setLoader] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.name || '',
        address: user.address || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

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

  const updateUserInfo = async () => {
    setLoader(true)
    const accessToken = await AsyncStorage.getItem('access_token');
    const refreshToken = await AsyncStorage.getItem('refresh_token');

    try {
      const response = await axios.put(
        `${SERVER_URI}/update-user-info`,
        {
          name: userInfo.name,
          address: userInfo.address,
          phone: userInfo.phone,
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
      console.log(error);
      setLoader(false);
    }
  };

  return (
    <>
      {loader || loading ? (
        <Loader />
      ) : (
        <LinearGradient colors={['#FCEDF0', '#F6F7F9']} style={{ flex: 1 }}>
          <View style={{ marginTop: 40 }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Poppins_700Bold',
                textAlign: 'center',
                marginBottom: 10,
              }}>
              Edit Profil
            </Text>
          </View>
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
            <View style={{ marginTop: 20, marginHorizontal: 10 }}>
              <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginBottom: 5 }}>
                Nama Lengkap
              </Text>
              <TextInput
                style={{
                  height: 55,
                  borderRadius: 8,
                  paddingLeft: 60,
                  paddingRight: 10,
                  fontSize: 16,
                  backgroundColor: 'white',
                  fontFamily: 'Poppins_600SemiBold',
                  alignItems: 'center',
                }}
                keyboardType="default"
                value={userInfo.name}
                placeholder= "Nama Lengkap"
                onChangeText={(value) => setUserInfo({ ...userInfo, name: value })}
              />
              <AntDesign
                style={{ position: 'absolute', left: 26, top: 45 }}
                name="user"
                size={20}
                color={'#ED2B8A'}
              />
            </View>
            <View style={{ marginTop: 20, marginHorizontal: 10 }}>
              <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginBottom: 5 }}>
                Alamat
              </Text>
              <TextInput
                style={{
                  height: 55,
                  borderRadius: 8,
                  paddingLeft: 60,
                  paddingRight: 10,
                  fontSize: 16,
                  backgroundColor: 'white',
                  fontFamily: 'Poppins_600SemiBold',
                  alignItems: 'center',
                }}
                keyboardType="default"
                value={userInfo.address}
                placeholder="Alamat"
                onChangeText={(value) => setUserInfo({ ...userInfo, address: value })}
              />
              <FontAwesome5
                style={{ position: 'absolute', left: 26, top: 45 }}
                name="address-book"
                size={20}
                color={'#ED2B8A'}
              />
            </View>
            <View style={{ marginTop: 20, marginHorizontal: 10 }}>
              <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, marginBottom: 5 }}>
                Nomor Telepon
              </Text>
              <TextInput
                style={{
                  height: 55,
                  borderRadius: 8,
                  paddingLeft: 60,
                  fontSize: 16,
                  backgroundColor: 'white',
                  fontFamily: 'Poppins_600SemiBold',
                  alignItems: 'center',
                }}
                keyboardType="number-pad"
                value={userInfo.phone}
                placeholder="Nomor Telepon"
                onChangeText={(value) => setUserInfo({ ...userInfo, phone: value })}
              />
              <AntDesign
                style={{ position: 'absolute', left: 26, top: 45 }}
                name="phone"
                size={20}
                color={'#ED2B8A'}
              />
            </View>
          </ScrollView>
          <View style={{ paddingHorizontal: 10, marginBottom: 20 }}>
            <TouchableOpacity
              style={{
                paddingVertical: 15,
                borderRadius: 10,
                backgroundColor: '#ED2B8A',
                width: '100%',
              }}
              onPress={updateUserInfo}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontFamily: 'Poppins_600SemiBold',
                  fontSize: 20,
                }}>
                Update Profil
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      )}
    </>
  );
}
