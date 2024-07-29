import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OrdersCard({ item }: { item: OrdersType }) {
  const [status, setStatus] = useState(item.status);
  const [isReviewed, setIsReviewed] = useState(item.productId.reviews);
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState('');

  useEffect(() => {
    setStatus(item.status);
    setIsReviewed(item.productId.reviews);
  }, [item.status, item.productId.reviews]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      const response = await axios.put(
        `${SERVER_URI}/update-order-status/${orderId}`,
        { status: newStatus },
        {
          headers: {
            'access-token': accessToken,
            'refresh-token': refreshToken,
          },
        },
      );

      if (response.data.success) {
        setStatus(response.data.order.status);
        setIsReviewed(response.data.order.reviewed);

        if (response.data.order.status === 'completed') {
          router.push('/(routes)/product-review');
        }
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  

  const handleStatusUpdate = () => {
    if (status === 'Processing') {
      updateOrderStatus(item._id, 'completed');
    } else if (status === 'Delivered' && !isReviewed) {
      router.push('/(routes)/product-review');
    } else if (status === 'completed' && isReviewed) {
      router.push('/(routes)/products');
    }
  };

  const getButtonText = () => {
    if (status === 'Processing') {
      return 'Tandai Selesai';
    } else if (status === 'completed' && !isReviewed) {
      return 'Review Product';
    } else if (status === 'completed' && isReviewed) {
      return 'Coba Product Lain';
    }
    return 'Tandai Selesai';
  };

  return (
    <View style={styles.cartItem}>
      <TouchableOpacity onPress={() => router.push("/(routes)/product-review")}>
        <Image source={{ uri: item.productId.image.url }} style={styles.itemImage} />
      </TouchableOpacity>
      <View style={{ justifyContent: 'space-between', flex: 1 }}>
        <View style={styles.itemDetails}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.itemName}>{item?.productId.name}</Text>
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: '#ED2b8a',
                  flexDirection: 'row',
                  gap: 5,
                  alignItems: 'center',
                  padding: 2,
                }}>
                <View
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: 100,
                    backgroundColor: '#ED2b8a',
                  }}></View>
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12 }}>{status}</Text>
              </View>
              <View
                style={{
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: '#ED2b8a',
                  flexDirection: 'row',
                  gap: 5,
                  alignItems: 'center',
                  padding: 2,
                }}>
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12 }}>Quantity :</Text>
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12 }}>
                  {item.quantity}
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
            di Order pada:{' '}
            {new Date(item?.createdAt)?.toLocaleDateString('id-ID', {
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
    marginHorizontal: 10,
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
  itemBottom: {
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: '#ED2B8A',
    borderRadius: 4,
  },
});
