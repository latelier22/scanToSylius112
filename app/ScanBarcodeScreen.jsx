import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera } from 'expo-camera';

export default function ScanBarcodeScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    if (!scanned) {
      setScanned(true);
      Alert.alert("Code-barres détecté", `Type: ${type}\nCode: ${data}`);
      router.push(`/scan-variant?flag=${data}`);
    }
  };

  if (hasPermission === null) {
    return <Text>Vérification des permissions...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Permission caméra refusée.</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        type={Camera.Constants.Type.back}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      <View style={styles.overlay}>
        <Text style={styles.scanText}>Scannez un code-barres</Text>
        {scanned && <Button title="Scanner à nouveau" onPress={() => setScanned(false)} />}
        <Button title="Retour" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    borderRadius: 10,
  },
  scanText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
});
