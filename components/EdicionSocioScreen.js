import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EdicionSocioScreen = ({ route, navigation }) => {
  const [nombreSocio, setNombreSocio] = useState('');
  const [socioId, setSocioId] = useState(null);

  useEffect(() => {
    const { socioId, nombreSocio } = route.params || {};
    setSocioId(socioId);
    setNombreSocio(nombreSocio || '');
  }, [route.params]);

  const guardarSocio = async () => {
    try {
      const sociosString = await AsyncStorage.getItem('socios');
      const socios = sociosString ? JSON.parse(sociosString) : [];

      if (socioId !== null && socios[socioId]) {
        // Editar socio existente
        socios[socioId].nombre = nombreSocio;
      } else {
        // Agregar nuevo socio
        const nuevoSocio = { nombre: nombreSocio, animales: [] };
        socios.push(nuevoSocio);
      }

      await AsyncStorage.setItem('socios', JSON.stringify(socios));

      // Asegurémonos de que nuevoSocio esté definido antes de intentar acceder a sus propiedades
      const nuevoSocio = socios[socios.length - 1];

      // Usamos navigation.navigate en lugar de navigation.replace
      // para permitir que el usuario regrese a la pantalla de inicio después de la edición
      navigation.navigate('Home', { nuevoSocio });
    } catch (error) {
      console.error('Error al guardar el socio:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Edición de Socio</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del Socio"
        value={nombreSocio}
        onChangeText={(text) => setNombreSocio(text)}
      />
      <TouchableOpacity style={styles.guardarButton} onPress={guardarSocio}>
        <Text style={styles.guardarButtonText}>Guardar Socio</Text>
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

export default EdicionSocioScreen;