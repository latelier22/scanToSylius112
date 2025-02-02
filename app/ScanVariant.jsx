import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TextInput, Button, View, Text, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Audio } from 'expo-av'; // ✅ Pour le bip sonore
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Collapsible } from '@/components/Collapsible';

export default function ScanVariantScreen() {
  const [flag, setFlag] = useState('');
  const [productVariant, setProductVariant] = useState(null);
  const [variantsWithoutFlag, setVariantsWithoutFlag] = useState([]);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const sound = useRef(new Audio.Sound()); // ✅ Référence pour le bip sonore

  useEffect(() => {
    (async () => {
      if (!permission) {
        await requestPermission();
      }
    })();
  }, []);

  // ✅ Charger le bip au lancement
  useEffect(() => {
    async function loadBeep() {
      try {
        await sound.current.loadAsync(require('@/assets/sounds/beep.mp3'));
      } catch (error) {
        console.error('Erreur chargement du bip:', error);
      }
    }
    loadBeep();
    return () => sound.current.unloadAsync(); // Nettoyage
  }, []);

  // ✅ Émettre un bip sonore
  async function playBeep() {
    try {
      await sound.current.replayAsync();
    } catch (error) {
      console.error('Erreur lecture du bip:', error);
    }
  }

  const handleScan = async (scannedCode = null) => {
    let codeToSend = flag;

    if (scannedCode) {
      playBeep(); // 🔊 Émettre un bip au scan
      setFlag(scannedCode);
      codeToSend = scannedCode;
      setScanning(false);
    }

    if (codeToSend.trim() === '') {
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ flag: codeToSend }),
      });

      if (!response.ok) {
        throw new Error('Produit non trouvé ou erreur serveur.');
      }

      const data = await response.json();
      console.log("Réponse API :", data);

      if (data.product_variant) {
        setProductVariant(data.product_variant);
        setVariantsWithoutFlag([]);
      } else {
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
      <Button title="Rechercher" onPress={() => handleScan()} />
      <Button title="📷 Scanner un code-barres" onPress={() => setScanning(true)} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {productVariant && (
        <ThemedView style={styles.resultContainer}>
          <ThemedText type="subtitle">Produit trouvé :</ThemedText>
          <Text>ID: {productVariant.id}</Text>
          <Text>Nom: {productVariant.name}</Text>
          <Text>Code: {productVariant.code}</Text>
          <Text>Stock: {productVariant.Stock}</Text>
        </ThemedView>
      )}

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

      {/* 📸 Scanner en plein écran avec mire rouge */}
      <Modal visible={scanning} animationType="slide">
        <View style={styles.scannerContainer}>
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFillObject}
            barcodeScannerSettings={{
              barCodeTypes: ['qr', 'ean13', 'ean8', 'upc_a', 'upc_e', 'code39', 'code93', 'code128'],
            }}
            onBarcodeScanned={({ data }) => handleScan(data)}
          >
            {/* 🔴 Mire rouge horizontale */}
            <View style={styles.overlay}>
              <View style={styles.redLine} />
            </View>
          </CameraView>
          <Button title="Fermer" onPress={() => setScanning(false)} />
        </View>
      </Modal>
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
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  redLine: {
    width: '80%',
    height: 4,
    backgroundColor: 'red',
    borderRadius: 2,
  },
});
