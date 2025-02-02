import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CameraScreen() {
  const [facing, setFacing] = useState('back');
  const [photoUri, setPhotoUri] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Nous avons besoin de la permission pour accéder à la caméra.</Text>
        <Button onPress={requestPermission} title="Accorder la permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.2, // 🔥 Compression à 50% pour réduire la taille
        base64: true, // Permet de convertir en blob
      });
  
      setPhotoUri(photo.uri);
    }
  }
  

  async function uploadToSylius() {
    if (!photoUri) {
      Alert.alert('Erreur', 'Veuillez prendre une photo avant de l’envoyer.');
      return;
    }
  
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      Alert.alert('Erreur', 'Vous devez être connecté pour envoyer une image.');
      return;
    }
  
    try {
      // 🔥 Convertir l'URI de l'image en blob
      const responseImage = await fetch(photoUri);
      const blob = await responseImage.blob();
  
      // 📤 Préparer le formData
      const formData = new FormData();
      formData.append('image', {
        uri: photoUri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });
  
      console.log("FormData envoyé :", formData);
  
      // ✅ Envoyer l'image compressée
      const response = await fetch('https://sylius.latelier22.fr/api/v2/admin/images/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
  
      console.log("Réponse serveur :", response);
  
      // 🔥 Lire la réponse comme texte pour éviter JSON Parse Error
      const responseText = await response.text();
      console.log("Réponse texte Sylius :", responseText);
  
      try {
        const data = JSON.parse(responseText);
        Alert.alert('Succès', `Image envoyée : ${data.image_url}`);
      } catch (error) {
        console.error("Erreur JSON :", error);
        Alert.alert('Erreur', 'Réponse inattendue du serveur.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Échec de l’envoi de l’image.');
    }
  }
  

  return (
    <View style={styles.container}>
      {photoUri ? (
        <>
          <Image source={{ uri: photoUri }} style={styles.preview} />
          <Button title="📤 Envoyer à Sylius" onPress={uploadToSylius} />
          <Button title="🔄 Reprendre une photo" onPress={() => setPhotoUri(null)} />
        </>
      ) : (
        <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>📸</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  preview: {
    width: 300,
    height: 400,
    marginBottom: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
