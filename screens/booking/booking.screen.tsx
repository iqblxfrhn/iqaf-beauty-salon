import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  RefreshControl,
  Modal,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Entypo, Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import { router } from 'expo-router';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import { SERVER_URI } from '@/utils/uri';
import axios from 'axios';

type CheckedItems = Record<string, boolean>;

export default function BookingScreen() {
  let [fontsLoaded, fontError] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold,
  });
  const [bookingItems, setBookingItems] = useState<TreatmentsType[]>([]);
  const [checkedItems, setCheckedItems] = useState<CheckedItems>({});
  const [selectedForCheckout, setSelectedForCheckout] = useState<CheckedItems>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectAllActive, setSelectAllActive] = useState(false);
  const [isCheckoutDisabled, setIsCheckoutDisabled] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [coupons, setCoupons] = useState<CouponsType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponsType | null>(null);

  useEffect(() => {
    axios
      .get(`${SERVER_URI}/get-coupons`)
      .then((res: any) => {
        setCoupons(res.data.coupons);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const subscription = async () => {
      const booking: any = await AsyncStorage.getItem('booking');
      const parsedBooking = JSON.parse(booking) || [];
      setBookingItems(parsedBooking);

      const initialCheckedItems = parsedBooking.reduce((acc: any, item: any) => {
        acc[item._id] = false;
        return acc;
      }, {});
      setCheckedItems(initialCheckedItems);
      setSelectedForCheckout(initialCheckedItems);

      const allSelected = Object.values(initialCheckedItems).every((value) => value);
      setSelectAllActive(allSelected);
    };

    subscription();
  }, []);

  useEffect(() => {
    const hasSelectedItems = Object.values(selectedForCheckout).some((value) => value);
    setIsCheckoutDisabled(!hasSelectedItems);
  }, [selectedForCheckout]);

  const formatRupiah = (number: number) => {
    return `Rp ${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };

  const handleCheckboxToggle = (id: string) => {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = {
        ...prevCheckedItems,
        [id]: !prevCheckedItems[id],
      };
      const allSelected = Object.values(newCheckedItems).every((value) => value);
      setSelectAllActive(allSelected);
      return newCheckedItems;
    });
  };

  const handleCheckoutToggle = (id: string) => {
    setSelectedForCheckout((prevSelectedForCheckout) => {
      const newSelectedForCheckout = {
        ...prevSelectedForCheckout,
        [id]: !prevSelectedForCheckout[id],
      };
      const allSelected = Object.values(newSelectedForCheckout).every((value) => value);
      setSelectAllActive(allSelected);
      return newSelectedForCheckout;
    });
  };

  const handleRemoveItem = async (id: any) => {
    const updatedBooking = bookingItems.filter((item) => item._id !== id);
    setBookingItems(updatedBooking);
    await AsyncStorage.setItem('booking', JSON.stringify(updatedBooking));
  };

  const handleRemoveCheckedItems = async () => {
    const updatedBooking = bookingItems.filter((item) => !checkedItems[item._id]);
    setBookingItems(updatedBooking);
    await AsyncStorage.setItem('booking', JSON.stringify(updatedBooking));

    const initialCheckedItems = updatedBooking.reduce((acc: any, item: any) => {
      acc[item._id] = false;
      return acc;
    }, {});
    setCheckedItems(initialCheckedItems);

    setSelectAllActive(false);
  };

  const handleSelectAll = () => {
    if (selectAllActive) {
      setCheckedItems({});
      setSelectedForCheckout({});
    } else {
      const newCheckedState = bookingItems.reduce((acc: any, item: any) => {
        acc[item._id] = true;
        return acc;
      }, {});
      setCheckedItems(newCheckedState);
      setSelectedForCheckout(newCheckedState);
    }
    setSelectAllActive(!selectAllActive);
  };

  const filterValidCoupons = (coupons: CouponsType[]) => {
    const currentDate = new Date();
    return coupons.filter((coupon) => new Date(coupon.expiredDate) > currentDate);
  };

  const validCoupons = filterValidCoupons(coupons);

  const handleSelectCoupon = (coupon: CouponsType) => {
    if (selectedCoupon?._id === coupon._id) {
      setSelectedCoupon(null);
    } else {
      setSelectedCoupon(coupon);
    }

    setModalVisible(false);
  };

  const getTotalPrice = () => {
    const total = bookingItems.reduce((total, item) => {
      if (selectedForCheckout[item._id]) {
        return total + item.price;
      }
      return total;
    }, 0);

    if (selectedCoupon) {
      const discount = (total * selectedCoupon.discount) / 100;
      return total - discount;
    }

    return total;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const booking: any = await AsyncStorage.getItem('booking');
    let parsedBooking;
    try {
      parsedBooking = JSON.parse(booking);
      if (!Array.isArray(parsedBooking)) {
        parsedBooking = [];
      }
    } catch (error) {
      parsedBooking = [];
    }
    setBookingItems(parsedBooking);
    setRefreshing(false);
  };
  const handleTreatmentDetails = (updatedTreatmentDetail: any) => {
    router.push({
      pathname: '/(routes)/treatment-details',
      params: { item: JSON.stringify(updatedTreatmentDetail) },
    });
  };

  const handlePayment = async () => {
    const accessToken = await AsyncStorage.getItem('access_token');
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    const amount = getTotalPrice();
    const orderId = `ORDER-${new Date().getTime()}`;

    if (isCheckoutDisabled || amount <= 0) return;

    try {
      const midtransResponse = await axios.post(
        `${SERVER_URI}/payment`,
        {
          amount,
          orderId,
        },
        {
          headers: {
            'access-token': accessToken,
            'refresh-token': refreshToken,
          },
        },
      );

      const transaction = midtransResponse.data;

      if (transaction && transaction.redirect_url) {
        await createBooking(transaction);
        router.push(`/(routes)/payment?url=${encodeURIComponent(transaction.redirect_url)}`);
      }
    } catch (error) {
      console.error('Error Saat Membayar:', error);
    }
  };

  const createBooking = async (transaction: any) => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const refreshToken = await AsyncStorage.getItem('refresh_token');

      const selectedItems = bookingItems.filter((item) => selectedForCheckout[item._id]);

      if (selectedItems.length === 0) {
        console.error('Tidak ada item yang dipilih untuk booking.');
        return;
      }

      const selectedDates = selectedItems.map((item) => item.selectedDate);
      const selectedTreatment = selectedItems[0]._id;
      const selectedTimes = selectedItems.map((item) => item.selectedTime);

      const bookingDate = selectedDates[0];
      const bookingTime = selectedTimes[0];

      if (!selectedTreatment || !bookingDate || !bookingTime) {
        console.error('Data tidak lengkap untuk booking.');
        return;
      }

      const response = await axios
        .post(
          `${SERVER_URI}/create-mobile-booking`,
          {
            treatmentId: selectedTreatment,
            payment_info: transaction,
            bookingDate,
            bookingTime,
          },
          {
            headers: {
              'access-token': accessToken,
              'refresh-token': refreshToken,
            },
          },
        )
        .then(async (res) => {
          setOrderSuccess(true);
          const updatedBooking = bookingItems.filter((item) => !selectedForCheckout[item._id]);
          await AsyncStorage.setItem('booking', JSON.stringify(updatedBooking));
          setBookingItems(updatedBooking);
        });
    } catch (error: any) {
      console.error('Error saat mengirim booking:', error.response?.data || error.message);
    }
  };

  const handleAddCoupon = async () => {
    setModalVisible(true);
  };

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <LinearGradient colors={['#FCEDF0', '#F6F7F9']} style={{ flex: 1 }}>
      {orderSuccess ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}></View>
      ) : (
        <>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity onPress={() => router.push('/(tabs)')}>
                  <Ionicons name="chevron-back" size={24} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Pemesanan Saya</Text>
              </View>
              {bookingItems.length > 0 && (
                <TouchableOpacity onPress={() => setIsEditMode(!isEditMode)}>
                  <Text style={styles.editButton}>{isEditMode ? 'Selesai' : 'Ubah'}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <FlatList
            data={bookingItems}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Checkbox
                  value={isEditMode ? checkedItems[item._id] : selectedForCheckout[item._id]}
                  onValueChange={() =>
                    isEditMode ? handleCheckboxToggle(item._id) : handleCheckoutToggle(item._id)
                  }
                  color={'#ED2B8A'}
                  style={{ marginRight: 5 }}
                />
                <TouchableOpacity onPress={() => handleTreatmentDetails(item)}>
                  <Image source={{ uri: item.image.url }} style={styles.itemImage} />
                </TouchableOpacity>
                <View style={{ justifyContent: 'space-between', flex: 1 }}>
                  <View style={styles.itemDetails}>
                    <View>
                      <TouchableOpacity onPress={() => handleTreatmentDetails(item)}>
                        <Text style={styles.itemName}>{item?.name}</Text>
                      </TouchableOpacity>
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
                            {item.selectedTime}
                          </Text>
                        </View>
                        <View>
                          <Text style={{ fontFamily: 'Poppins_400Regular' }}>Tanggal:</Text>
                          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 14 }}>
                            {item.selectedDate}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.itemBottom}>
                      <Text style={styles.itemPrice}>{formatRupiah(item.price)}</Text>

                      {isEditMode && (
                        <TouchableOpacity
                          onPress={() => handleRemoveItem(item._id)}
                          style={styles.removeButton}>
                          <FontAwesome name="trash" size={22} color="#ED2B8A" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 60 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  height: 600,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 20,
                }}>
                <Feather name="book" size={80} color={'#ED2B8A'} />

                <Text
                  style={{
                    fontFamily: 'Poppins_700Bold',
                    fontSize: 20,
                    textAlign: 'center',
                    color: '#000',
                    marginTop: 20,
                  }}>
                  Pemesanan Anda Kosong
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/(routes)/treatments')}
                  style={{
                    marginTop: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 15,
                    backgroundColor: '#ED2B8A',
                    borderRadius: 36,
                    paddingHorizontal: 40,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins_400Regular',
                      fontSize: 16,
                      textAlign: 'center',
                      color: '#fff',
                    }}>
                    Jelajahi Treatment
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
          <View style={styles.footer}>
            {bookingItems.length > 0 && isEditMode && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  onPress={handleSelectAll}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: 10,
                    marginRight: 10,
                    position: 'static',
                  }}>
                  <Checkbox value={selectAllActive} color={'#ED2B8A'} />
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Poppins_600SemiBold',
                      color: '#ED2B8A',
                      textAlign: 'right',
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                    }}>
                    {selectAllActive ? 'Semua' : 'Semua'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRemoveCheckedItems} style={styles.removeAllButton}>
                  <Text style={styles.removeAllButtonText}>Hapus</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={{}}>
              {bookingItems.length > 0 && !isEditMode && (
                <TouchableOpacity
                  onPress={handleAddCoupon}
                  disabled={isCheckoutDisabled}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: '#ccc',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={[styles.selectAllText, isCheckoutDisabled && { color: '#ccc' }]}>
                    {selectedCoupon
                      ? `Anda mendapatkan diskon sebesar ${selectedCoupon.discount}%`
                      : 'Gunakan Voucher'}
                  </Text>
                  <Entypo
                    name="chevron-small-up"
                    size={24}
                    color="black"
                    style={[isCheckoutDisabled && { color: '#ccc' }]}
                  />
                </TouchableOpacity>
              )}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {bookingItems.length > 0 && !isEditMode && (
                  <TouchableOpacity
                    onPress={handleSelectAll}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingLeft: 10,
                    }}>
                    <Checkbox value={selectAllActive} color={'#ED2B8A'} />
                    <Text style={styles.selectAllText}>{selectAllActive ? 'Semua' : 'Semua'}</Text>
                  </TouchableOpacity>
                )}
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {bookingItems.length > 0 && !isEditMode && (
                    <View style={styles.totalContainer}>
                      <View style={{ justifyContent: 'space-between' }}>
                        <Text
                          style={{
                            textAlign: 'right',
                            fontFamily: 'Poppins_400Regular',
                          }}>
                          Total
                        </Text>
                        <Text style={styles.totalText}>{formatRupiah(getTotalPrice())}</Text>
                      </View>
                    </View>
                  )}
                  {bookingItems.length > 0 && !isEditMode && (
                    <TouchableOpacity
                      onPress={() => handlePayment()}
                      style={[styles.checkoutButton, isCheckoutDisabled && styles.disabledButton]}
                      disabled={isCheckoutDisabled}>
                      <Text style={styles.checkoutButtonText}>Bayar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
        </>
      )}

      <Modal
        animationType="slide"
        statusBarTranslucent
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <LinearGradient
            colors={['#ED2B8A', '#FEA1BE']}
            style={{
              width: '100%',
              borderTopRightRadius: 28,
              borderTopLeftRadius: 28,
              bottom: 0,
              left: 0,
              right: 0,
              paddingTop: 10,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Poppins_600SemiBold',
                textAlign: 'center',
                color: 'white',
              }}>
              Voucher
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Poppins_700Bold',
                marginLeft: 10,
                color: 'white',
                marginVertical: 10,
              }}>
              Spesial Buat Kamu!
            </Text>
            <FlatList
              data={validCoupons}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectCoupon(item)}
                  style={{ marginBottom: 10 }}>
                  <View
                    style={{
                      padding: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      backgroundColor: 'white',
                      alignItems: 'center',
                      marginHorizontal: 10,
                      borderTopRightRadius: 6,
                      borderTopLeftRadius: 6,
                      borderBottomRightRadius: 8,
                      borderBottomLeftRadius: 8,
                      borderBottomWidth: 1,
                      borderBottomColor: '#ccc',
                    }}>
                    <View>
                      <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>
                        Diskon
                      </Text>
                      <Text
                        style={{ fontFamily: 'Poppins_700Bold', fontSize: 32, color: '#ED2B8A' }}>
                        {item.discount}%
                      </Text>
                    </View>
                    <View>
                      <Image
                        source={require('@/assets/icons/discount.png')}
                        style={{ width: 60, height: 60 }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      marginHorizontal: 10,
                      backgroundColor: '#F6F7F9',
                      padding: 10,
                      borderTopRightRadius: 8,
                      borderTopLeftRadius: 8,
                      borderBottomRightRadius: 6,
                      borderBottomLeftRadius: 6,
                    }}>
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14 }}>
                      Berakhir dalam :{' '}
                      {item.expiredDate
                        ? new Date(item.expiredDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : 'Invalid Date'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </LinearGradient>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backIcon: {
    color: '#000',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#000',
  },
  editButton: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#000',
  },
  selectAllText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#ED2B8A',
    textAlign: 'right',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
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
    height: 120,
  },
  itemImage: {
    width: 95,
    height: 95,
    borderRadius: 10,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTop: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  itemName: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#000',
  },
  itemBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#000',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#000',
    marginHorizontal: 10,
  },
  removeButton: {},

  removeAllButton: {
    backgroundColor: '#ED2B8A',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    flex: 1,
  },
  removeAllButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
  },
  totalContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  totalText: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#000',
    textAlign: 'right',
  },

  checkoutButton: {
    backgroundColor: '#ED2B8A',
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  checkoutButtonText: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#FFFFFF',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    borderTopColor: '#E0E0E0',
    borderTopWidth: 1,
  },
});
