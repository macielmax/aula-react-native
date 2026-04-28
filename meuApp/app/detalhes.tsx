import { View, Text, StyleSheet, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function Detalhes() {
  const router = useRouter();
  // Captura os dados enviados pela tela anterior
  const { titulo, status } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tarefa:</Text>
      <Text style={styles.titulo}>{titulo}</Text>
      
      <Text style={styles.label}>Status:</Text>
      <Text style={[styles.status, { color: status === 'true' ? 'green' : 'red' }]}>
        {status === 'true' ? 'Concluída ✅' : 'Pendente ⏳'}
      </Text>

      <Button title="Voltar" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  label: { fontSize: 14, color: '#666', marginTop: 20 },
  titulo: { fontSize: 28, fontWeight: 'bold' },
  status: { fontSize: 20, fontWeight: 'bold', marginBottom: 40 }
});
