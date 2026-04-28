import { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';

interface Tarefa {
  _id: string;
  titulo: string;
  concluida: boolean;
}

export default function App() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [texto, setTexto] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  
  // ESTADOS DE CONTROLE (Exercício 5)
  const [carregando, setCarregando] = useState(false);
  
  const router = useRouter();
  const API = 'https://urban-space-cod-g4wjrgjqr4qrfvw59-3000.app.github.dev/tarefas';

  // 1. CARREGAR COM ORDENAÇÃO E ERRO (Exercícios 4 e 5)
  async function carregar() {
    setCarregando(true);
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error();
      const data: Tarefa[] = await res.json();

      // Ordena: Pendentes no topo, Concluídas embaixo
      const ordenada = data.sort((a, b) => a.titulo.localeCompare(b.titulo));
      
      setTarefas(ordenada);
    } catch (error) {
      Alert.alert("Erro de Conexão", "Não foi possível carregar as tarefas. O servidor está ligado?");
    } finally {
      setCarregando(false);
    }
  }

  // 2. SALVAR (ADICIONAR OU EDITAR)
  async function salvar() {
    if (!texto) return;
    setCarregando(true);
    try {
      const url = editandoId ? `${API}/${editandoId}` : API;
      const method = editandoId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: texto })
      });

      if (!res.ok) throw new Error();

      setTexto('');
      setEditandoId(null);
      carregar();
    } catch (error) {
      Alert.alert("Erro ao Salvar", "Verifique sua conexão.");
      setCarregando(false);
    }
  }

  // 3. CONCLUIR / DESMARCAR
  async function alternarConcluida(id: string, statusAtual: boolean) {
    try {
      await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concluida: !statusAtual })
      });
      carregar();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o status.");
    }
  }

  // 4. DELETAR
  async function deletar(id: string) {
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' });
      carregar();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível deletar.");
    }
  }

  function prepararEdicao(item: Tarefa) {
    setTexto(item.titulo);
    setEditandoId(item._id);
  }

  useEffect(() => { carregar() }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Minhas Tarefas Diárias ✅</Text>
      
      <View style={styles.inputArea}>
        <TextInput 
          value={texto} 
          onChangeText={setTexto}
          placeholder="O que vamos fazer hoje?" 
          style={styles.input} 
          editable={!carregando} // Trava o campo enquanto carrega
        />
        
        {carregando ? (
          <ActivityIndicator size="small" color="#2ecc71" />
        ) : (
          <Button 
            title={editandoId ? "Salvar Alteração" : "Adicionar"} 
            onPress={salvar} 
            color={editandoId ? "#f39c12" : "#2ecc71"}
          />
        )}
      </View>

      <FlatList 
        data={tarefas} 
        keyExtractor={item => item._id} 
        refreshing={carregando}
        onRefresh={carregar} // Pull-to-refresh (puxar para baixo para atualizar)
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity 
              style={{ flex: 1 }} 
              onPress={() => router.push({
                pathname: '/detalhes',
                params: { titulo: item.titulo, status: String(item.concluida) }
              })}
            >
              <Text style={[
                styles.textoTarefa, 
                { 
                  textDecorationLine: item.concluida ? 'line-through' : 'none', 
                  color: item.concluida ? '#95a5a6' : '#2c3e50' 
                }
              ]}>
                {item.titulo}
              </Text>
            </TouchableOpacity>

            <View style={styles.acoes}>
              {/* BOTÃO CONCLUIR/DESMARCAR */}
              <TouchableOpacity onPress={() => alternarConcluida(item._id, item.concluida)}>
                <Text style={styles.btnIcone}>{item.concluida ? "⏪" : "✅"}</Text>
              </TouchableOpacity>
              
              {/* BOTÃO EDITAR */}
              <TouchableOpacity onPress={() => prepararEdicao(item)}>
                <Text style={styles.btnIcone}>✎</Text>
              </TouchableOpacity>

              {/* BOTÃO DELETAR */}
              <TouchableOpacity onPress={() => deletar(item._id)}>
                <Text style={styles.btnIcone}>❌</Text>
              </TouchableOpacity>
            </View>
          </View>
        )} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f6fa', paddingTop: 60 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#2c3e50', textAlign: 'center' },
  inputArea: { marginBottom: 20, gap: 10 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
  card: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10,
    elevation: 3 
  },
  textoTarefa: { fontSize: 16, fontWeight: '500' },
  acoes: { flexDirection: 'row', gap: 18, alignItems: 'center' },
  btnIcone: { fontSize: 20 }
});
