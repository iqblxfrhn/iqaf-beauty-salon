import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import useUser from '@/hooks/auth/useUser';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header() {
  const [cartItems, setCartItems] = useState([]);
  const [bookingItems, setBookingItems] = useState([]);
  const { user, setRefetch, loading } = useUser();

  const fetchData = async () => {
    try {
      const cart: any = await AsyncStorage.getItem('cart');
      setCartItems(JSON.parse(cart) || []);
      const booking: any = await AsyncStorage.getItem('booking');
      setBookingItems(JSON.parse(booking) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch data on initial load
  useEffect(() => {
    fetchData();
  }, []);

  // Refetch data
  const handleRefetch = () => {
    fetchData();
    if (setRefetch) {
      setRefetch(true);
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
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
          <Image
            source={{
              uri:
                user?.avatar?.url ||
                'https://res.cloudinary.com/iqbalxfrhn/image/upload/v1721111006/avatars/user_rm4mol.jpg',
            }}
            style={{
              width: 45,
              height: 45,
              borderRadius: 100,
              borderWidth: 1,
            }}
          />
        </TouchableOpacity>
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16 }}>Halo,</Text>
          <Text
            style={{
              fontFamily: 'Poppins_700Bold',
              fontSize: 16,
              color: '#ED2B8A',
            }}>
            {user?.name}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          style={{
            width: 45,
            height: 45,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            router.push('/(routes)/booking');
            handleRefetch();
          }}>
          <View>
            <Feather name="book" size={28} color={'black'} />
            <View
              style={{
                width: 16,
                height: 16,
                backgroundColor: '#ED2B8A',
                position: 'absolute',
                borderRadius: 50,
                right: -5,
                top: -5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 12,
                  fontFamily: 'Poppins_700Bold',
                }}>
                {bookingItems?.length}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: 45,
            height: 45,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            router.push('/(routes)/cart');
            handleRefetch();
          }}>
          <View>
            <Feather name="shopping-bag" size={28} color={'black'} />
            <View
              style={{
                width: 16,
                height: 16,
                backgroundColor: '#ED2B8A',
                position: 'absolute',
                borderRadius: 50,
                right: -5,
                top: -5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 12,
                  fontFamily: 'Poppins_700Bold',
                }}>
                {cartItems?.length}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
