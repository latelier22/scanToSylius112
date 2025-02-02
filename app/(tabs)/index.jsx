import { Image, StyleSheet, Button, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const router = useRouter();
  const macIp = "192.168.1.119"; // 🔥 Mets l'IP locale de ton Mac

  // 🛒 Ouvrir Sylius
  const openSyliusOnMac = async () => {
    try {
      await fetch(`http://${macIp}:3000/open-sylius`);
      
    } catch (error) {
      Alert.alert("❌ Erreur", "Impossible d'ouvrir Sylius sur Mac.");
    }
  };

  // ❌ Fermer le dernier onglet
  const closeLastTabOnMac = async () => {
    try {
      await fetch(`http://${macIp}:3000/close-tab`);
     
    } catch (error) {
      console.log("❌ Erreur : Impossible de fermer l'onglet.");
    }
  };

  // 🛑 Mettre en veille l'écran
  const sleepScreen = async () => {
    try {
      await fetch(`http://${macIp}:3000/sleep`);
     
    } catch (error) {
      Alert.alert("❌ Erreur : Impossible de mettre en veille.");
    }
  };

  // ⚡ Rallumer l'écran
  const wakeScreen = async () => {
    try {
      await fetch(`http://${macIp}:3000/wake`);
      
    } catch (error) {
      Alert.alert("❌ Erreur : Impossible de rallumer.");
    }
  };

  // 🔉 Diminuer le volume
  const volumeDown = async () => {
    try {
      await fetch(`http://${macIp}:3000/volume-down`);
    
    } catch (error) {
      Alert.alert("❌ Erreur : Impossible de changer le volume.");
    }
  };

  // 🔊 Augmenter le volume
  const volumeUp = async () => {
    try {
      await fetch(`http://${macIp}:3000/volume-up`);
      
    } catch (error) {
      Alert.alert("❌ Erreur : Impossible de changer le volume.");
    }
  };

  // 🔇 Muter le son
  const muteSound = async () => {
    try {
      await fetch(`http://${macIp}:3000/mute`);
      
    } catch (error) {
      Alert.alert("❌ Erreur : Impossible de couper le son.");
    }
  };

  // 🔈 Remettre le son (même niveau qu'avant)
  const unmuteSound = async () => {
    try {
      await fetch(`http://${macIp}:3000/unmute`);
      
    } catch (error) {
      Alert.alert("❌ Erreur : Impossible de réactiver le son.");
    }
  };

  // 🌙 Mettre en veille le Mac
  const sleepMac = async () => {
    try {
      await fetch(`http://${macIp}:3000/mac-sleep`);
     
    } catch (error) {
      Alert.alert("❌ Erreur : Impossible de mettre le Mac en veille.");
    }
  };

  // 🚀 Réveiller le Mac
  const wakeMac = async () => {
    try {
      await fetch(`http://${macIp}:3000/mac-wake`);
      
    } catch (error) {
      Alert.alert("❌ Erreur : Impossible de réveiller le Mac.");
    }
  };

  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">🔧 Contrôle du Mac</ThemedText>
      </ThemedView>

      {/* 📌 Boutons d'actions en colonnes */}
      <View style={styles.buttonRow}>
        <View style={styles.buttonContainer}>
          <Button title="💤 Veille écran" onPress={sleepScreen} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="🌞 Rallumer écran" onPress={wakeScreen} />
        </View>
      </View>

      <View style={styles.buttonRow}>
        <View style={styles.buttonContainer}>
          <Button title="🔉 Volume -" onPress={volumeDown} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="🔊 Volume +" onPress={volumeUp} />
        </View>
      </View>

      <View style={styles.buttonRow}>
        <View style={styles.buttonContainer}>
          <Button title="🔇 Mute" onPress={muteSound} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="🔈 Unmute" onPress={unmuteSound} />
        </View>
      </View>

      <View style={styles.buttonRow}>
        <View style={styles.buttonContainer}>
          <Button title="🌙 Veille Mac" onPress={sleepMac} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="🚀 Réveil Mac" onPress={wakeMac} />
        </View>
      </View>

      <View style={styles.buttonRow}>
        <View style={styles.buttonContainer}>
          <Button title="🛒 Vente" onPress={openSyliusOnMac} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="❌ Fermer l'onglet" onPress={closeLastTabOnMac} />
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
});

