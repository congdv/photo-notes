import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigation from './src/navigation/AppNavigation';
import { NotesProvider } from './src/context/NotesContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <NotesProvider>
        <AppNavigation />
      </NotesProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
