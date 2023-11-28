import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InventarioAnimalesScreen = ({ route, navigation }) => {
  const { socio } = route.params || {};
  const [animales, setAnimales] = useState([]);

  useEffect(() => {
    const cargarAnimales = async () => {
      try {
        const animalesString = await AsyncStorage.getItem(`animales_${socio.nombre}`);
        const animales = animalesString ? JSON.parse(animalesString) : [];
        setAnimales(animales);
      } catch (error) {
        console.error('Error al cargar animales:', error);
      }
    };

    cargarAnimales();
  }, [route.params]);

  const eliminarAnimal = async (arete) => {
    try {
      const nuevosAnimales = animales.filter((animal) => animal.arete !== arete);
      await AsyncStorage.setItem(`animales_${socio.nombre}`, JSON.stringify(nuevosAnimales));
      setAnimales(nuevosAnimales);
    } catch (error) {
      console.error('Error al eliminar el animal:', error);
    }
  };

  const editarAnimal = (arete) => {
    const animalSeleccionado = animales.find((animal) => animal.arete === arete);
    if (animalSeleccionado) {
      navigation.navigate('AgregarAnimal', { socio, editar: true, animal: animalSeleccionado });
    }
  };

  const venderAnimal = (arete) => {
    // Lógica para la venta del animal
    // Puedes implementar la navegación a la pantalla de venta aquí
    navigation.navigate('VentaAnimales', { socio, arete, animal: animales.find(animal => animal.arete === arete) });
  };

  const renderItem = ({ item, index }) => {
    return (
      <Card key={index} containerStyle={styles.cardContainer}>
        <Text style={styles.areteAnimal}>Arete: {item.arete}</Text>
        <Text>Precio de Compra: {item.precioCompra}</Text>
        <Text>Peso Inicial: {item.pesoInicial}</Text>
        <Text>Fecha de Compra: {item.fechaCompra}</Text>
        <View style={styles.botonesContainer}>
          <Button
            title="✏️"
            onPress={() => editarAnimal(item.arete)}
            buttonStyle={styles.botonesEditar}
          />
          <Button
            title="🛒"
            onPress={() => venderAnimal(item.arete)}
            buttonStyle={styles.botonesVender}
          />
          <Button
            title="🗑️"
            onPress={() => eliminarAnimal(item.arete)}
            buttonStyle={styles.botonesEliminar}
          />
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Text>Inventario de Animales - {socio ? socio.nombre : ''}</Text>
      <FlatList
        data={animales}
        renderItem={renderItem}
        keyExtractor={(item) => item.arete.toString()}
      />
      <TouchableOpacity onPress={() => navigation.navigate('AgregarAnimal', { socio })}>
        <Text style={styles.agregarAnimal}>+Agregar Animal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: '100%',
    margin: 10,
    borderRadius: 10,
  },
  areteAnimal: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  botonesEditar: {
    width: '60%',
    margin: 10,
    backgroundColor: 'green',
  },
  botonesEliminar: {
    width: '60%',
    margin: 10,
    backgroundColor: 'red',
  },
  botonesVender: {
    width: '60%',
    margin: 10,
    backgroundColor: 'yellow',
  },
  agregarAnimal: {
    marginTop: 20,
    marginBottom: 20,
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default InventarioAnimalesScreen;