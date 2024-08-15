import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import { AntDesign, Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TreatmentReviewCard from '@/components/cards/treatment.review.card';
import moment from 'moment';
import 'moment/locale/id';

export default function TreatmentDetailScreen() {
  let [fontsLoaded, fontError] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  const [next7Days, setNext7Days] = useState<DayInfo[]>([]);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBookingButtonEnabled, setIsBookingButtonEnabled] = useState(false);

  useEffect(() => {
    moment.locale('id');
    getDays();
    getTimes();
  }, []);

  useEffect(() => {
    // Update button status based on date and time selection
    if (selectedDate && selectedTime) {
      setIsBookingButtonEnabled(true);
    } else {
      setIsBookingButtonEnabled(false);
    }
  }, [selectedDate, selectedTime]);

  const getDays = () => {
    const today = moment();
    const nextSevenDays: DayInfo[] = [];
    for (let i = 1; i <= 7; i++) {
      const date = moment().add(i, 'days');
      nextSevenDays.push({
        date: date.format('DD-MM-YYYY'),
        day: date.format('dddd'),
        formattedDate: date.format('MMMM YYYY'),
        dayNumber: date.date(),
      });
    }
    setNext7Days(nextSevenDays);
  };

  const getTimes = () => {
    const times = [];
    const startHour = 9;
    const endHour = 18;

    for (let hour = startHour; hour <= endHour; hour++) {
      const time = moment().hour(hour).minute(0).format('HH:mm');
      times.push(time);
    }
    return times;
  };

  const availableTimes = getTimes();

  const formatRupiah = (number: number) => {
    return 'Rp.' + number.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  };

  const { item } = useLocalSearchParams();

  const treatmentDetail: TreatmentsType = JSON.parse(item as string);

  const ratings = treatmentDetail?.ratings ?? 0;
  const maxStars = 5;

  const [modalVisible, setModalVisible] = useState(false);

  const handleAddAppointment = async () => {
    const existingBookingData = await AsyncStorage.getItem('booking');
    let bookingData = existingBookingData ? JSON.parse(existingBookingData) : [];

    if (!Array.isArray(bookingData)) {
      console.error('Data booking tidak valid, harus berupa array.');
      bookingData = [];
    }

    const existingTreatmentIndex = bookingData.findIndex(
      (treatment: TreatmentsType) => treatment._id === treatmentDetail._id,
    );

    if (existingTreatmentIndex >= 0) {
      alert('Treatment Sudah Ada di Pemesanan');
    } else {
      setModalVisible(true);
    }
  };

  const handleAddBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Silakan pilih tanggal dan waktu terlebih dahulu.');
      return;
    }

    try {
      const existingBookingData = await AsyncStorage.getItem('booking');
      const bookingData = existingBookingData ? JSON.parse(existingBookingData) : [];

      if (!Array.isArray(bookingData)) {
        console.error('Data booking tidak valid, harus berupa array.');
      }

      const updatedTreatmentDetail = {
        ...treatmentDetail,
        selectedDate: selectedDate,
        selectedTime: selectedTime,
      };

      bookingData.push(updatedTreatmentDetail);
      await AsyncStorage.setItem('booking', JSON.stringify(bookingData));

      alert('Reservasi berhasil dibuat!');
      setModalVisible(false);
    } catch (error) {
      console.error('Failed to save booking', error);
      alert('Terjadi kesalahan saat menyimpan reservasi.');
    }
  };

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <LinearGradient colors={['#FCEDF0', '#F6F7F9']} style={{ flex: 1 }}>
      <View style={{ marginTop: 40, paddingHorizontal: 10 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 5,
          }}>
          <TouchableWithoutFeedback onPress={() => router.back()}>
            <Entypo name="chevron-thin-left" size={20} color="black" style={{}} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => router.push('/(routes)/booking')}>
            <AntDesign name="book" size={24} color="black" style={{}} />
          </TouchableWithoutFeedback>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}>
          <View style={{ marginTop: 15 }}>
            <Image
              source={{ uri: treatmentDetail?.image.url! }}
              style={{ width: '100%', height: 213, borderRadius: 16 }}
            />
            <Text
              style={{
                fontFamily: 'Poppins_700Bold',
                fontSize: 20,
                textAlign: 'left',
                marginTop: 8,
                color: '#ED2B8A',
              }}>
              {treatmentDetail?.name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                gap: 4,
                marginBottom: 4,
              }}>
              {Array.from({ length: maxStars }).map((_, index) => {
                let iconName: 'star' | 'star-half' | 'star-o' = 'star';
                if (index > ratings && index < ratings + 0.5) {
                  iconName = 'star-half';
                } else if (index >= ratings) {
                  iconName = 'star-o';
                }
                return (
                  <FontAwesome
                    key={index}
                    name={iconName}
                    size={16}
                    color={index < ratings ? '#ffb800' : '#transparent'}
                  />
                );
              })}
              <Text
                style={{
                  color: '#575757',
                  fontSize: 16,
                  fontFamily: 'Poppins_600SemiBold',
                  top: -2,
                  marginLeft: 4,
                }}>
                {treatmentDetail?.ratings}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <FontAwesome name="clock-o" size={12} color="#575757" />
              <Text
                style={{
                  fontFamily: 'Poppins_600SemiBold',
                  fontSize: 12,
                  color: '#575757',
                  top: 2,
                }}>
                {treatmentDetail?.duration} Menit
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: -4,
            }}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  fontFamily: 'Poppins_700Bold',
                  fontSize: 24,
                  color: '#ED2B8A',
                }}>
                {formatRupiah(treatmentDetail?.price)}
              </Text>
              <Text
                style={{
                  paddingLeft: 5,
                  textDecorationLine: 'line-through',
                  fontSize: 12,
                  fontFamily: 'Poppins_400Regular',
                }}>
                {formatRupiah(treatmentDetail?.estimatedPrice)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <MaterialIcons name="menu-book" size={12} color="#575757" />
              <Text
                style={{
                  fontFamily: 'Poppins_600SemiBold',
                  fontSize: 12,
                  color: '#575757',
                  top: -1,
                }}>
                {treatmentDetail?.booked} di Pesan
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 4 }}>
            <Text
              style={{
                fontFamily: 'Poppins_700Bold',
                fontSize: 20,
                textAlign: 'left',
                color: '#000',
              }}>
              Deskripsi Treatment
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 14,
                textAlign: 'justify',
                color: '#575757',
              }}>
              {treatmentDetail?.description}
            </Text>
          </View>
          <View style={{ marginTop: 8 }}>
            <Text
              style={{
                fontFamily: 'Poppins_700Bold',
                fontSize: 20,
                textAlign: 'left',
                color: '#000',
                marginTop: 10,
              }}>
              Reviews
            </Text>
            <View style={{ marginTop: 4 }}>
              {treatmentDetail?.reviews.map((item: ReviewType, index: number) => (
                <TreatmentReviewCard item={item} key={index} />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
      <TouchableOpacity
        onPress={() => handleAddAppointment()}
        style={{
          backgroundColor: '#ED2B8A',
          height: 45,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'Poppins_600SemiBold',
            fontSize: 16,
            color: '#fff',
          }}>
          Pesan Sekarang
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        statusBarTranslucent
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: 'Poppins_700Bold',
                fontSize: 20,
              }}>
              Tentukan Jadwal
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins_700Bold',
                fontSize: 20,
                marginLeft: 10,
                marginBottom: 10,
              }}>
              Hari
            </Text>
            <FlatList
              style={{}}
              data={next7Days}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.date}
              renderItem={({ item }) => (
                <View style={{ paddingHorizontal: 10 }}>
                  <TouchableOpacity
                    onPress={() => setSelectedDate(item.date)}
                    style={{
                      borderWidth: 1,
                      borderRadius: 18,
                      padding: 5,
                      alignItems: 'center',
                      borderColor: selectedDate === item.date ? '#ED2B8A' : '#dde2ec',
                      backgroundColor: selectedDate === item.date ? '#ED2B8A' : 'white',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 14,
                        color: selectedDate === item.date ? '#fff' : '#575757',
                      }}>
                      {item.day}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Poppins_700Bold',
                        fontSize: 20,
                        color: selectedDate === item.date ? '#fff' : '#575757',
                      }}>
                      {item.dayNumber}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 14,
                        color: selectedDate === item.date ? '#fff' : '#575757',
                      }}>
                      {item.formattedDate}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
            <Text
              style={{
                fontFamily: 'Poppins_700Bold',
                fontSize: 20,
                marginLeft: 10,
                marginVertical: 10,
              }}>
              Ketersediaan Waktu
            </Text>
            <FlatList
              style={{ paddingLeft: 10 }}
              data={availableTimes}
              keyExtractor={(item) => item}
              numColumns={5}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedTime(item)}
                  style={{
                    width: 60,
                    paddingVertical: 5,
                    borderWidth: 1,
                    borderRadius: 10,
                    marginBottom: 10,
                    marginRight: 10,
                    alignItems: 'center',
                    borderColor: selectedTime === item ? '#ED2B8A' : '#dde2ec',
                    backgroundColor: selectedTime === item ? '#ED2B8A' : 'white',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins_600SemiBold',
                      fontSize: 18,
                      color: selectedTime === item ? '#fff' : '#575757',
                    }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              disabled={!isBookingButtonEnabled}
              onPress={handleAddBooking}
              style={{
                backgroundColor: isBookingButtonEnabled ? '#ED2B8A' : '#ccc', 
                height: 45,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
                borderRadius: 5, 
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins_600SemiBold',
                  fontSize: 16,
                  color: '#fff', 
                }}>
                Buat Reservasi
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 36,
    borderTopLeftRadius: 36,
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 10,
  },
});
