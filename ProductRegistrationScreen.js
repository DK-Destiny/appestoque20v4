import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProductRegistrationScreen({ navigation }) {
  const [ordemDeServico, setOrdemDeServico] = useState('');
  const [codigo, setCodigo] = useState('');
  const [modelo, setModelo] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Função para formatar a data atual
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR'); // Formato: DD/MM/YYYY
    setCurrentDate(formattedDate);
  }, []);

  const saveProduct = async () => {
    if (!ordemDeServico || !codigo || !modelo || !quantidade) {
      Alert.alert('Erro', 'Todos os campos devem ser preenchidos!');
      return;
    }

    // Adicionando a data atual automaticamente
    const newProduct = {
      ordemDeServico,
      codigo,
      modelo,
      quantidade,
      dataCadastro: currentDate, // Data atual
    };

    try {
      const storedProducts = await AsyncStorage.getItem('products');
      const productsList = storedProducts ? JSON.parse(storedProducts) : [];
      productsList.push(newProduct);
      await AsyncStorage.setItem('products', JSON.stringify(productsList));

      Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
      setOrdemDeServico('');
      setCodigo('');
      setModelo('');
      setQuantidade('');
    } catch (error) {
      console.error('Erro ao salvar o produto:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o produto.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Produto</Text>

      {/* Exibe a data de hoje */}
      <Text style={styles.dateText}>Data de hoje: {currentDate}</Text>

      <TextInput
        style={styles.input}
        placeholder="Ordem de Serviço"
        keyboardType="numeric"
        value={ordemDeServico}
        onChangeText={setOrdemDeServico}
      />
      <TextInput
        style={styles.input}
        placeholder="Código do Produto"
        keyboardType="numeric"
        value={codigo}
        onChangeText={setCodigo}
      />
      <TextInput
        style={styles.input}
        placeholder="Modelo do Equipamento"
        value={modelo}
        onChangeText={setModelo}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        keyboardType="numeric"
        value={quantidade}
        onChangeText={setQuantidade}
      />

      <TouchableOpacity style={styles.button} onPress={saveProduct}>
        <Text style={styles.buttonText}>Salvar Produto</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ProductListScreen')}>
        <Text style={styles.buttonText}>Visualizar Itens Cadastrados</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'normal',
    marginBottom: 20,
    color: '#555',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
