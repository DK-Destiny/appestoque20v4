import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProductListScreen() {
  const [products, setProducts] = useState([]);
  const [currentDate, setCurrentDate] = useState('');

  // Função para carregar os produtos do AsyncStorage
  const loadProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem('products');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
      console.error('Erro ao carregar os produtos:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao carregar os produtos.');
    }
  };

  // Função para compartilhar os produtos pelo WhatsApp
  const shareViaWhatsApp = () => {
    if (products.length === 0) {
      Alert.alert('Aviso', 'Nenhum produto para compartilhar.');
      return;
    }

    const message = products
      .map(
        (product, index) =>
          `Produto ${index + 1}:\n- Ordem de Serviço: ${product.ordemDeServico}\n- Código: ${product.codigo}\n- Modelo: ${product.modelo}\n- Quantidade: ${product.quantidade}\n- Data de Cadastro: ${product.dataCadastro || 'Não informado'}`
      )
      .join('\n\n');

    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Erro', 'WhatsApp não está instalado ou não é compatível.');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('Erro ao abrir o WhatsApp:', err));
  };

  // Função para limpar os produtos do AsyncStorage
  const clearProducts = async () => {
    try {
      await AsyncStorage.removeItem('products');
      setProducts([]);
      Alert.alert('Sucesso', 'Todos os produtos foram removidos.');
    } catch (error) {
      console.error('Erro ao limpar os produtos:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao limpar os produtos.');
    }
  };

  // Carregar os produtos e data atual ao montar a tela
  useEffect(() => {
    loadProducts();
    
    // Formatar a data atual
    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR'); // Formato: DD/MM/YYYY
    setCurrentDate(formattedDate);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <Text style={styles.productText}>Ordem de Serviço: {item.ordemDeServico}</Text>
      <Text style={styles.productText}>Código: {item.codigo}</Text>
      <Text style={styles.productText}>Modelo: {item.modelo}</Text>
      <Text style={styles.productText}>Quantidade: {item.quantidade}</Text>
      <Text style={styles.productText}>Data de Cadastro: {item.dataCadastro}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Exibe a data do dia atual */}
      <Text style={styles.dateText}>Data: {currentDate}</Text>

      <Text style={styles.title}>Ordens de Serviço Recebidas</Text>
      {products.length === 0 ? (
        <Text style={styles.noProductsText}>Nenhum produto cadastrado.</Text>
      ) : (
        <>
          <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
          {/* Botão para compartilhar via WhatsApp */}
          <TouchableOpacity style={styles.shareButton} onPress={shareViaWhatsApp}>
            <Text style={styles.shareButtonText}>Compartilhar via WhatsApp</Text>
          </TouchableOpacity>
          {/* Botão para limpar produtos */}
          <TouchableOpacity style={styles.clearButton} onPress={clearProducts}>
            <Text style={styles.clearButtonText}>Limpar Produtos</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  noProductsText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 18,
  },
  productItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  productText: {
    fontSize: 16,
    color: '#333',
  },
  shareButton: {
    backgroundColor: '#25D366', // Cor do WhatsApp
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
