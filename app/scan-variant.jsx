import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, View, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Collapsible } from '@/components/Collapsible';

export default function ScanVariantScreen() {
  const [flag, setFlag] = useState('');
  const [productVariant, setProductVariant] = useState(null);
  const [variantsWithoutFlag, setVariantsWithoutFlag] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleScan = async () => {
    if (flag.trim() === '') {
      Alert.alert('Erreur', 'Veuillez entrer un code produit.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Erreur', 'Vous devez être connecté pour scanner un produit.');
        return;
      }

      const response = await fetch(`https://sylius.latelier22.fr/api/v2/admin/product-variants/flag`, {
        method: 'POST',  // ✅ Correction: utilisation de POST
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ flag: flag }), // ✅ Formatage correct du body en JSON
      });
      

      if (!response.ok) {
        throw new Error('Produit non trouvé ou erreur serveur.');
      }

      const data = await response.json();
      console.log("Réponse API :", data);

      // Si le produit avec le flag est trouvé, on l'affiche
      if (data.product_variant) {
        setProductVariant(data.product_variant);
        setVariantsWithoutFlag([]); // Réinitialiser la liste des variants sans flag
      } else {
        // Si aucun variant avec flag, on affiche les variants sans flag
        setProductVariant(null);
        setVariantsWithoutFlag(data.variants_without_flag || []);
      }

      setError('');

    } catch (err) {
      setError(err.message);
      setProductVariant(null);
      setVariantsWithoutFlag([]);
    }
  };

  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Rechercher un produit</ThemedText>
      </ThemedView>

      <TextInput
        style={styles.input}
        placeholder="Entrer le code produit"
        value={flag}
        onChangeText={setFlag}
      />
      <Button title="Rechercher" onPress={handleScan} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Affichage du produit trouvé avec flag */}
      {productVariant && (
        <ThemedView style={styles.resultContainer}>
          <ThemedText type="subtitle">Produit trouvé :</ThemedText>
          <Text>ID: {productVariant.id}</Text>
          <Text>Nom: {productVariant.name}</Text>
          <Text>Code: {productVariant.code}</Text>
          <Text>Stock: {productVariant.Stock}</Text>
        </ThemedView>
      )}

      {/* Affichage des variants sans flag si aucun produit avec flag trouvé */}
      {variantsWithoutFlag.length > 0 && (
        <Collapsible title="Variants sans flag disponibles">
          {variantsWithoutFlag.map((variant) => (
            <Collapsible key={variant.id} title={variant.name}>
              <Text>ID: {variant.id}</Text>
              <Text>Code: {variant.code}</Text>
              <Text>Nom: {variant.name}</Text>
            </Collapsible>
          ))}
        </Collapsible>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
    width: '100%',
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});
