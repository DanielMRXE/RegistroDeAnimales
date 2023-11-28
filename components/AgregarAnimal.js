import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AgregarAnimalScreen = ({ route, navigation }) => {
  const { socio, editar, animal } = route.params || {};
  const [numeroArete, setNumeroArete] = useState('');
  const [precioCompra, setPrecioCompra] = useState('');
  const [pesoInicial, setPesoInicial] = useState('');
  const [fechaCompra, setFechaCompra] = useState('');

  useEffect(() => {
    if (editar && animal) {
      setNumeroArete(animal.arete.toString());
      setPrecioCompra(animal.precioCompra.toString());
      setPesoInicial(animal.pesoInicial.toString());
      setFechaCompra(animal.fechaCompra);
    }
  }, [editar, animal]);

  const guardarAnimal = async () => {
    try {
      const animalesString = await AsyncStorage.getItem(`animales_${socio.nombre}`);
      const animales = animalesString ? JSON.parse(animalesString) : [];

      if (editar && animal) {
        const indiceAnimal = animales.findIndex((a) => a.arete === animal.arete);

        if (indiceAnimal !== -1) {
          animales[indiceAnimal] = {
            arete: numeroArete,
            precioCompra: parseFloat(precioCompra),
            pesoInicial: parseFloat(pesoInicial),
            fechaCompra,
          };
        }
      } else {
        const nuevoAnimal = {
          arete: numeroArete,
          precioCompra: parseFloat(precioCompra),
          pesoInicial: parseFloat(pesoInicial),
          fechaCompra,
        };

        animales.push(nuevoAnimal);
      }

      await AsyncStorage.setItem(`animales_${socio.nombre}`, JSON.stringify(animales));
      navigation.navigate('InventarioAnimales', { socio });
    } catch (error) {
      console.error('Error al guardar el animal:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Número de Arete"
        value={numeroArete}
        onChangeText={(text) => setNumeroArete(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio de Compra"
        keyboardType="numeric"
        value={precioCompra}
        onChangeText={(text) => setPrecioCompra(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Peso Inicial en kg"
        keyboardType="numeric"
        value={pesoInicial}
        onChangeText={(text) => setPesoInicial(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha de Compra ej. : 01/10/2023"
        value={fechaCompra}
        onChangeText={(text) => setFechaCompra(text)}
      />
      <TouchableOpacity style={styles.guardarButton} onPress={guardarAnimal}>
        <Text style={styles.guardarButtonText}>Guardar Animal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
  },
  guardarButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  guardarButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default AgregarAnimalScreen;