import { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';

interface Tarefa {
  _id: string;
  titulo: string;
}

export default function App() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [texto, setTexto] = useState('');
  const API = 'https://SEU-APP.onrender.com/tarefas';
  async function carregar() {
    const res = await fetch(API);
    const data = await res.json(); setTarefas(data)
  }
  async function adicionar() {
    if (!texto) return;
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: texto })
    });
    setTexto(''); carregar()
  }
  async function deletar(id: string) {
    await fetch(`${API}/${id}`,
      { method: 'DELETE' }); carregar()
  } useEffect(() => { carregar() }, [])
  return (<View style={{ marginTop: 50, padding: 20 }}>
    <TextInput value={texto} onChangeText={setTexto}
      placeholder="Digite tarefa" style={{ borderWidth: 1, padding: 10, marginBottom: 10 }} />
    <Button title="Adicionar" onPress={adicionar} />
    <FlatList data={tarefas} keyExtractor={item => item._id} renderItem={({ item }) =>
      <View style={{ padding: 10, margin: 5, backgroundColor: '#ddd' }}>
        <Text>{item.titulo}</Text><Button title="Deletar" onPress={() => deletar(item._id)} />

      </View>} />
  </View>)
}
