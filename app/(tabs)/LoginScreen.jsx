import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, Alert, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; // Utilisation d'Expo Router

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Collapsible } from '@/components/Collapsible';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // Remplace navigation par router

  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Erreur', 'Veuillez renseigner tous les champs.');
      return;
    }

    try {
      const response = await fetch('https://sylius.latelier22.fr/api/v2/admin/authentication-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Token reçu:', data);

      // Stocker le token pour les requêtes futures
      await AsyncStorage.setItem('authToken', data.token);

      Alert.alert('Succès', 'Connexion réussie !');
      
      // 🔥 Remplace navigation.navigate() par router.push()
      router.push('/(tabs)'); // Va vers la page principale
      

    } catch (err) {
      setError(err.message);
      Alert.alert('Erreur', err.message);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={250}
          color="#808080"
          name="lock"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Connexion</ThemedText>
      </ThemedView>

      <ThemedText type="title">Saisissez vos identifiants</ThemedText>
        {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button title="Se connecter" onPress={handleLogin} />
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -80,
    left: -20,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
    width: '100%',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});
