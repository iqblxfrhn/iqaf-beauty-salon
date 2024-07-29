import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BookingsCard({ item }: { item: BookingsType }) {
  const [status, setStatus] = useState(item.status);
  const [isReviewed, setIsReviewed] = useState(item.treatmentId.reviews);

  useEffect(() => {
    setStatus(item.status);
    setIsReviewed(item.treatmentId.reviews);
  }, [item.status, item.treatmentId.reviews]);

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      const response = await axios.put(
        `${SERVER_URI}/update-booking-status/${bookingId}`,
        { status: newStatus },
        {
          headers: {
            'access-token': accessToken,
            'refresh-token': refreshToken,
          },
        },
      );

      if (response.data.success) {
        console.log('Booking status updated successfully:', response.data.booking);
        setStatus(response.data.booking.status);
        setIsReviewed(response.data.booking.reviewed);

        if (response.data.booking.status === 'completed') {
          router.push('/(routes)/treatment-review');
        }
      } else {
        console.error('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const handleStatusUpdate = () => {
    if (status === 'Pending') {
      updateBookingStatus(item._id, 'completed');
    } else if (status === 'completed' && !isReviewed) {
      router.push('/(routes)/treatment-review');
    } else if (status === 'completed' && isReviewed) {
      router.push('/(routes)/treatments');
    }
  };

  const getButtonText = () => {
    if (status === 'Pending') {
      return 'Tandai Selesai';
    } else if (status === 'completed' && !isReviewed) {
      return 'Review Treatment';
    } else if (status === 'completed' && isReviewed) {
      return 'Coba Treatment Lain';
    }
    return 'Tandai Selesai';
  };

  return (
    <View style={styles.cartItem}>
      <TouchableOpacity onPress={() => router.push('/(routes)/treatment-review')}>
        <Image source={{ uri: item.treatmentId.image.url }} style={styles.itemImage} />
      </TouchableOpacity>
      <View style={{ justifyContent: 'space-between', flex: 1 }}>
        <View style={styles.itemDetails}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.itemName}>{item?.treatmentId.name}</Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusIndicator}></View>
              <Text style={styles.statusText}>{status}</Text>
            </View>
          </View>
          <View>
            <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14 }}>
                Jadwal Pemesananmu
              </Text>
              <FontAwesome name="clock-o" size={12} color="#000" />
            </View>
            <View style={{ flexDirection: 'row', gap: 50, alignItems: 'center' }}>
              <View>
                <Text style={{ fontFamily: 'Poppins_400Regular' }}>Jam:</Text>
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 14 }}>
                  {item.bookingTime}
                </Text>
              </View>
              <View>
                <Text style={{ fontFamily: 'Poppins_400Regular' }}>Tanggal:</Text>
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 14 }}>
                  {item.bookingDate}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={handleStatusUpdate} style={styles.itemBottom}>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', padding: 5, color: 'white' }}>
              {getButtonText()}
            </Text>
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Poppins_400Regular', marginTop: 4, fontSize: 12 }}>
            di Booking pada: {new Date(item?.createdAt)?.toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cartItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
    marginBottom: 0,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    height: 160,
    marginHorizontal: 10

  },
  itemImage: {
    width: 110,
    height: 110,
    borderRadius: 10,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#000',
  },
  statusContainer: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ED2b8a',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    padding: 2,
  },
  statusIndicator: {
    width: 5,
    height: 5,
    borderRadius: 100,
    backgroundColor: '#ED2b8a',
  },
  statusText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },
  itemBottom: {
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: '#ED2B8A',
    borderRadius: 4,
  },
});
