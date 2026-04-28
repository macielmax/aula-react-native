import { useState } from 'react';
import { FlatList, View, Text, Button, StyleSheet } from 'react-native';

export default function App() {
  const [dados, setDados] = useState([
    { id: '1', nome: 'Estudar React Native' },
    { id: '2', nome: 'Fazer atividade FATEC' },
    { id: '3', nome: 'Configurar MongoDB' },
  ]);

  const deletarItem = (id) => {
    setDados(dados.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Minhas Tarefas</Text>
      <FlatList
        data={dados}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.textoItem}>{item.nome}</Text>
            <Button title="X" color="red" onPress={() => deletarItem(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  item: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 15, 
    backgroundColor: '#f9f9f9', 
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee'
  },
  textoItem: { fontSize: 16 }
});
