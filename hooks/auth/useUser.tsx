import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useUser() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const accessToken = await AsyncStorage.getItem('access_token');
        const refreshToken = await AsyncStorage.getItem('refresh_token');

        if (!accessToken || !refreshToken) {
          throw new Error('Tokens are missing');
        }

        const response = await axios.get(`${SERVER_URI}/me`, {
          headers: {
            'access-token': accessToken,
            'refresh-token': refreshToken,
          },
        });

        setUser(response.data.user);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refetch]);

  return { loading, user, error, refetch, setRefetch };
}
