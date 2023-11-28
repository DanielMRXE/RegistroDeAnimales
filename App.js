import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import EdicionSocioScreen from './components/EdicionSocioScreen';
import InventarioAnimales from './components/InventarioAnimales';
import AgregarAnimal from './components/AgregarAnimal';
import VentaAnimales from './components/VentaAnimales'
import AnimalesVendidos from './components/AnimalesVendidos'

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="EdicionSocio" component={EdicionSocioScreen} />
        <Stack.Screen name="InventarioAnimales" component={InventarioAnimales} />
        <Stack.Screen name="AgregarAnimal" component={AgregarAnimal} /> 
        <Stack.Screen name="VentaAnimales" component={VentaAnimales} />
        <Stack.Screen name="AnimalesVendidos" component={AnimalesVendidos} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;