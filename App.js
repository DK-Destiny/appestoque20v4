import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProductRegistrationScreen from './ProductRegistrationScreen';
import ProductListScreen from './ProductListScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ProductRegistrationScreen">
        {/* Tela de Cadastro de Produto */}
        <Stack.Screen
          name="ProductRegistrationScreen"
          component={ProductRegistrationScreen}
          options={{ title: 'Concórdia SA - Estoque 20' }} // Título para a tela de cadastro
        />
        {/* Tela de Lista de Produtos */}
        <Stack.Screen
          name="ProductListScreen"
          component={ProductListScreen}
          options={{ title: 'Lista de Ordens de Serviço' }} // Título para a tela de lista
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
