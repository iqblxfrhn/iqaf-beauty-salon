import { View } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchInput from '@/components/common/search.input';

export default function SearchScreen() {
  return (
    <LinearGradient colors={['#FCEDF0', '#F6F7F9']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 10, marginTop: 8 }}>
          <SearchInput />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
