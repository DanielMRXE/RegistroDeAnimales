import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInDays } from 'date-fns'; // Agregado para importar differenceInDays

const HomeScreen = ({ navigation, route }) => {
  const [socios, setSocios] = useState([]);

  useEffect(() => {
    const cargarSocios = async () => {
      try {
        const sociosString = await AsyncStorage.getItem('socios');
        const socios = sociosString ? JSON.parse(sociosString) : [];
        setSocios(socios);
      } catch (error) {
        console.error('Error al cargar socios:', error.message || error);
      }
    };

    cargarSocios();
  }, [route.params]);

  const eliminarSocio = async (socioId) => {
    try {
      const nuevosSocios = socios.filter((socio, index) => index !== socioId);
      await AsyncStorage.setItem('socios', JSON.stringify(nuevosSocios));
      setSocios(nuevosSocios);
    } catch (error) {
      console.error('Error al eliminar el socio:', error.message || error);
    }
  };

  const editarSocio = (socioId) => {
    const socio = socios[socioId];
    navigation.navigate('EdicionSocio', { socioId, nombreSocio: socio.nombre });
  };

  const verInventario = async (socio) => {
    navigation.navigate('InventarioAnimales', { socio });
  };


  const renderItem = ({ item, index }) => {
    return (
      <Card key={index} containerStyle={styles.cardContainer}>
        <Text style={styles.nombreSocio}>{item.nombre}</Text>
        <Text>Número de Animales: </Text>
        <Text>Ganancia de Peso Diaria: </Text>
        <Text>Ganancia promedio por animal: </Text>
        <View style={styles.botonesContainer}>
          <Button
            title="✏️"
            onPress={() => editarSocio(index)}
            buttonStyle={styles.botonesEditar}
          />
          <Button
            title="🗑️"
            onPress={() => eliminarSocio(index)}
            buttonStyle={styles.botonesEliminar}
          />
          <Button
            title="🐮"
            onPress={() => verInventario(item)}
            buttonStyle={styles.botonInventario}
          />
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Text>Lista de Socios</Text>
      <FlatList
        data={socios}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity onPress={() => navigation.navigate('EdicionSocio')}>
        <Text style={styles.agregarSocio}>+Agregar Socio</Text>
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
    width: '100%', // Ocupa todo el ancho de la pantalla
    margin: 10,
    borderRadius: 10,
  },
  nombreSocio: {
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
  botonInventario: {
    width: '60%',
    margin: 10,
    backgroundColor: 'yellow',
  },
  agregarSocio: {
    marginTop: 20,
    marginBottom: 20,
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default HomeScreen;