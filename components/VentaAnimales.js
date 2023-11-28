import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Input, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInDays, parse } from 'date-fns';

const VentaAnimalesScreen = ({ route, navigation }) => {
  const [gananciaPeso, setGananciaPeso] = useState('');
  const [promedioGananciaPeso, setPromedioGananciaPeso] = useState('');
  const [ganancia, setGanancia] = useState('');

  const arete = route.params.animal?.arete || '';
  const pesoActual = route.params.pesoActual || '';
  const precioVenta = route.params.precioVenta || '';
  const fechaVenta = route.params.fechaVenta || '';

  useEffect(() => {
    const calcularDatosAutomaticos = () => {
      if (route.params.animal) {
        const pesoInicial = route.params.animal.pesoInicial || 0;
        const fechaCompra = route.params.animal.fechaCompra || '';
        const fechaVentaParseada = parse(fechaVenta, 'dd/MM/yyyy', new Date());
        const fechaCompraParseada = parse(fechaCompra, 'dd/MM/yyyy', new Date());

        // Calcula la ganancia de peso
        setGananciaPeso(pesoInicial - parseFloat(pesoActual));

        // Calcula el promedio de ganancia de peso por día
        const diasDiferencia = differenceInDays(fechaVentaParseada, fechaCompraParseada);
        const promedioGanancia = (parseFloat(pesoActual) - pesoInicial) / diasDiferencia;
        setPromedioGananciaPeso(
          isNaN(promedioGanancia) || diasDiferencia <= 0 ? '' : promedioGanancia.toFixed(2)
        );

        // Calcula la ganancia
        setGanancia(parseFloat(precioVenta) - route.params.animal.precioCompra);
      }
    };

    calcularDatosAutomaticos();
  }, [pesoActual, precioVenta, fechaVenta, route.params.animal]);

  const venderAnimal = async () => {
    try {
      const animalVendido = {
        arete: arete,
        fechaVenta: fechaVenta,
        precioVenta: parseFloat(precioVenta),
        gananciaPeso: parseFloat(gananciaPeso),
        promedioGananciaPeso: parseFloat(promedioGananciaPeso),
        ganancia: parseFloat(ganancia),
        socio: route.params.socio.nombre,
        pesoFinal: parseFloat(pesoActual),
      };

      const animalesVendidosString = await AsyncStorage.getItem('animalesVendidos');
      const animalesVendidos = animalesVendidosString ? JSON.parse(animalesVendidosString) : [];
      animalesVendidos.push(animalVendido);
      await AsyncStorage.setItem('animalesVendidos', JSON.stringify(animalesVendidos));

      // Envía los datos a la vista 'AnimalesVendidos' y navega a ella
      navigation.navigate('AnimalesVendidos', { animalVendido });
    } catch (error) {
      console.error('Error al vender el animal:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.areteAnimal}>Arete: {arete}</Text>
      {route.params.animal && (
        <Card containerStyle={styles.infoCard}>
          <Text>Fecha de Compra: {route.params.animal.fechaCompra}</Text>
          <Text>Precio de Compra: {route.params.animal.precioCompra}</Text>
          <Text>Peso Inicial: {route.params.animal.pesoInicial}</Text>
        </Card>
      )}
      <Card containerStyle={styles.cardContainer}>
        <Text style={styles.cardTitle}>Registro de Venta</Text>
        <Input
          label="Peso Actual (kg)"
          placeholder="Ingrese el peso actual"
          value={pesoActual}
          onChangeText={value => navigation.setParams({ pesoActual: value })}
        />
        <Input
          label="Precio de Venta C$"
          placeholder="Ingrese el precio de venta"
          value={precioVenta}
          onChangeText={value => navigation.setParams({ precioVenta: value })}
        />
        <Input
          label="Fecha de Venta"
          placeholder="Ej. 02/10/2024"
          value={fechaVenta}
          onChangeText={value => navigation.setParams({ fechaVenta: value })}
        />
        <Card containerStyle={styles.resultadosCard}>
          <Text style={styles.resultadosTitle}>Datos de la venta</Text>
          <Text>Ganancia de Peso: {gananciaPeso}</Text>
          <Text>Ganancia Peso por Día: {promedioGananciaPeso}</Text>
          <Text style={styles.textGanancia}>Ganancia: {ganancia}</Text>
        </Card>
        <Button
          title="Vender"
          onPress={venderAnimal}
          buttonStyle={styles.botonVender}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#329F9F',
  },
  areteAnimal: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardContainer: {
    width: '80%',
    margin: 10,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoCard: {
    marginTop: 10,
    marginBottom: 5,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  resultadosCard: {
    marginTop: 5,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  resultadosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  botonVender: {
    marginTop: 20,
    backgroundColor: 'green',
  },
  textGanancia: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'green',
    textAlign: 'center',
  },
});

export default VentaAnimalesScreen;