import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';

export default function PaymentScreen() {
  const { url } = useLocalSearchParams();

  if (!url) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Server Error</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: 20, backgroundColor: 'white' }}>
      <WebView source={{ uri: url as string }} style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});
