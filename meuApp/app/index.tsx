import { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function App() {
  const [tarefas, setTarefas] = useState<any[]>([]);
  const [texto, setTexto] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);

  // ESTADOS DE CONTROLE
  const [carregando, setCarregando] = useState(false); // Para o ícone de load

  const router = useRouter();
  const API = 'https://urban-space-cod-g4wjrgjqr4qrfvw59-3000.app.github.dev/tarefas';

  // 1. CARREGAR COM TRATAMENTO DE ERRO
  async function carregar() {
    setCarregando(true);
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error(); // Força erro se a resposta for ruim
      const data = await res.json();

      // Ordenação (Exercício 4)
      const ordenada = data.sort((a: { titulo: string }, b: { titulo: string }) => a.titulo.localeCompare(b.titulo));
      setTarefas(ordenada);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor. Verifique se o backend está rodando!");
    } finally {
      setCarregando(false); // Desliga o load independente se deu erro ou não
    }
  }

  // 2. SALVAR COM TRY/CATCH
  async function salvar() {
    if (!texto) return;
    setCarregando(true);
    try {
      const method = editandoId ? 'PUT' : 'POST';
      const url = editandoId ? `${API}/${editandoId}` : API;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: texto })
      });

      if (!res.ok) throw new Error();

      setTexto('');
      setEditandoId(null);
      carregar();
    } catch (error) {
      Alert.alert("Erro ao salvar", "Ocorreu um problema ao guardar a tarefa.");
      setCarregando(false);
    }
  }

  useEffect(() => { carregar() }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Fatec List ✅</Text>

      <View style={styles.inputArea}>
        <TextInput
          value={texto}
          onChangeText={setTexto}
          placeholder="O que vamos fazer?"
          style={styles.input}
          editable={!carregando} // Trava o input enquanto salva
        />

        {/* Se estiver carregando, mostra o ícone de girar, senão mostra o botão */}
        {carregando ? (
          <ActivityIndicator size="large" color="#2ecc71" />
        ) : (
          <Button
            title={editandoId ? "Atualizar" : "Adicionar"}
            onPress={salvar}
            color={editandoId ? "#f39c12" : "#2ecc71"}
          />
        )}
      </View>

      <FlatList
        data={tarefas}
        keyExtractor={item => item._id}
        onRefresh={carregar} // Puxar para baixo para atualizar
        refreshing={carregando}
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
                { textDecorationLine: item.concluida ? 'line-through' : 'none', color: item.concluida ? '#95a5a6' : '#2c3e50' }
              ]}>
                {item.titulo}
              </Text>
            </TouchableOpacity>
            {/* ... botões de edição e delete que você já tem ... */}
          </View>
        )}
        // Mensagem caso a lista esteja vazia
        ListEmptyComponent={!carregando ? <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma tarefa encontrada.</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f6fa', paddingTop: 60 },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#2c3e50', textAlign: 'center' },
  inputArea: { marginBottom: 20, gap: 10 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 10, elevation: 3 },
  textoTarefa: { fontSize: 16, fontWeight: '500' }
});
