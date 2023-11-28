import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AnimalesVendidosScreen = ({ navigation }) => {
  const [animalesVendidos, setAnimalesVendidos] = useState([]);

  useEffect(() => {
    const cargarAnimalesVendidos = async () => {
      try {
        const animalesVendidosString = await AsyncStorage.getItem('animalesVendidos');
        const animalesVendidos = animalesVendidosString ? JSON.parse(animalesVendidosString) : [];
        setAnimalesVendidos(animalesVendidos);
      } catch (error) {
        console.error('Error al cargar los animales vendidos:', error);
      }
    };

    cargarAnimalesVendidos();
  }, []);

  const eliminarAnimalVendido = async (arete) => {
    try {
      const nuevosAnimalesVendidos = animalesVendidos.filter((animal) => animal.arete !== arete);
      await AsyncStorage.setItem('animalesVendidos', JSON.stringify(nuevosAnimalesVendidos));
      setAnimalesVendidos(nuevosAnimalesVendidos);
    } catch (error) {
      console.error('Error al eliminar el animal vendido:', error);
    }
  };

  const editarAnimalVendido = (animal) => {
    // Aquí deberías navegar a la pantalla de edición con los datos del animal
    // Puedes pasar los datos como parámetros de navegación
    navigation.navigate('VentaAnimales', {
      arete: animal.arete,
      fechaVenta: animal.fechaVenta,
      precioVenta: animal.precioVenta.toString(),
      gananciaPeso: animal.gananciaPeso.toString(),
      promedioGananciaPeso: animal.promedioGananciaPeso.toString(),
      ganancia: animal.ganancia.toString(),
      socio: animal.socio,
      pesoFinal: animal.pesoFinal.toString(),
      isEdit: true, // Agrega esta bandera para indicar que es una edición
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Animales Vendidos</Text>
      <ScrollView style={styles.scrollContainer}>
        {animalesVendidos.map((animal, index) => (
          <Card key={index} containerStyle={styles.cardContainer}>
            <Text>Arete: {animal.arete}</Text>
            <Text>Fecha de Venta: {animal.fechaVenta}</Text>
            <Text>Precio de Venta: {animal.precioVenta}</Text>
            <Text>Ganancia Peso: {animal.gananciaPeso}</Text>
            <Text>Promedio Ganancia Peso: {animal.promedioGananciaPeso}</Text>
            <Text>Ganancia: {animal.ganancia}</Text>
            <Text>Socio: {animal.socio}</Text>
            <Text>Peso Final: {animal.pesoFinal}</Text>
            <Button
              title="Eliminar"
              onPress={() => eliminarAnimalVendido(animal.arete)}
              buttonStyle={styles.buttonEliminar}
            />
            <Button
              title="Editar"
              onPress={() => editarAnimalVendido(animal)}
              buttonStyle={styles.buttonEditar}
            />
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#329F9F',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
  },
  scrollContainer: {
    width: '100%',
  },
  cardContainer: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  buttonEliminar: {
    backgroundColor: 'red',
    marginTop: 10,
  },
  buttonEditar: {
    backgroundColor: 'orange',
    marginTop: 5,
  },
});

export default AnimalesVendidosScreen;