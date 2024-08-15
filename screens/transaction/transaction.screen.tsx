import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import BookingsCard from '@/components/cards/bookings.card';
import useUser from '@/hooks/auth/useUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OrdersCard from '@/components/cards/orders.card';

export default function TransactionScreen() {
  const [activeTab, setActiveTab] = useState('Orders');
  const [bookings, setBookings] = useState<BookingsType[]>([]);
  const [orders, setOrders] = useState<OrdersType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user?._id) {
      const fetchBookings = async () => {
        const accessToken = await AsyncStorage.getItem('access_token');
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        try {
          const res = await axios.get(`${SERVER_URI}/get-bookings-user/${user._id}`, {
            headers: {
              'access-token': accessToken,
              'refresh-token': refreshToken,
            },
          });
          setBookings(res.data.bookings);
        } catch (error: any) {
          console.error(
            'Error fetching bookings:',
            error.response ? error.response.data : error.message,
          );
        } finally {
          setLoading(false);
        }
      };

      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?._id) {
      const fetchOrders = async () => {
        const accessToken = await AsyncStorage.getItem('access_token');
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        try {
          const res = await axios.get(`${SERVER_URI}/get-orders-user/${user._id}`, {
            headers: {
              'access-token': accessToken,
              'refresh-token': refreshToken,
            },
          });
          setOrders(res.data.orders);
        } catch (error: any) {
          console.error(
            'Error fetching Orders:',
            error.response ? error.response.data : error.message,
          );
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <LinearGradient colors={['#FCEDF0', '#F6F7F9']} style={{ flex: 1 }}>
      <View style={{ paddingTop: 40, marginBottom: 10, marginLeft: 10 }}>
        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 20 }}>Riwayat Transaksi</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Orders' && styles.activeTab]}
          onPress={() => setActiveTab('Orders')}>
          <Text style={[styles.tabText, activeTab === 'Orders' && styles.activeTabText]}>
            Orders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Bookings' && styles.activeTab]}
          onPress={() => setActiveTab('Bookings')}>
          <Text style={[styles.tabText, activeTab === 'Bookings' && styles.activeTabText]}>
            Bookings
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, marginTop: 10 }}>
        {activeTab === 'Orders' ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 10 }}
            data={orders}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => <OrdersCard item={item} />}
          />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 10 }}
            data={bookings}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => <BookingsCard item={item} />}
          />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingLeft: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ED2B8A',
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#ED2B8A',
  },
  tabText: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#ED2B8A',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
});
