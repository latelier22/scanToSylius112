async function fetchProductVariantByBarcode(barcode) {
    const apiUrl='https://sylius.latelier22.fr/debug/product-variant/MUG'
    // const apiUrl = `https://sylius.latelier22.fr/debug/product-variant/${barcode}`;
    const apiToken = "YOUR_API_TOKEN"; // Remplacez par un jeton d’authentification valide
  
    try {
      const response = await fetch(apiUrl, {
        headers: {
        //   "Authorization": `Bearer ${apiToken}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        // Gestion des erreurs (404, 401, 500, etc.)
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data)
  
      // Si la réponse est vide ou ne contient pas le variant, handlez ce cas.
      if (!data ) {
        return null; // Pas de variant trouvé
      }
  
      return data; // On suppose que le premier élément est le bon
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API:", error);
      return null;
    }
  }
  
  export default fetchProductVariantByBarcode