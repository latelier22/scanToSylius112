import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, View } from 'react-native';
import  fetchProductVariantByBarcode  from '@/lib/fetchApi';
import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabScanScreen() {
  const [inputText, setInputText] = useState('');
  const [submittedText, setSubmittedText] = useState('');

  const handleValidation = async () => {
    if (inputText.trim() !== '') {
      const variant = await fetchProductVariantByBarcode(inputText);
  
      if (variant) {
        // Variante trouvée, vous pouvez stocker ou afficher les détails
        console.log("Variant trouvé:", variant);
        setSubmittedText(JSON.stringify(variant, null, 2)); // Affiche le JSON en bas
      } else {
        // Aucun variant trouvé
        console.log("Aucun product variant trouvé pour ce code-barres.");
        setSubmittedText("Aucun produit correspondant trouvé.");
      }
  
      setInputText(''); // Efface l'input après validation
    } else {
      alert("Veuillez entrer un texte.");
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">SCAN</ThemedText>
      </ThemedView>
      <ThemedText>This app includes example code to help you get started.</ThemedText>

      <Collapsible title="Test saisi code">
        {/* Champ Input */}
        <TextInput
          style={styles.input}
          placeholder="Entrez un texte..."
          value={inputText}
          onChangeText={setInputText}
        />
        
        {/* Bouton Valider */}
        <Button title="Valider" onPress={handleValidation} />

        {/* Affichage du texte soumis */}
        {submittedText ? (
          <ThemedText style={styles.resultText}>Texte saisi: {submittedText}</ThemedText>
        ) : null}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
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
    padding: 10,
    marginVertical: 10,
    width: '100%',
  },
  resultText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
