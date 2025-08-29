import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// polyfill secure random values for uuid in React Native
import 'react-native-get-random-values';
import AppNavigation from './src/navigation/AppNavigation';
import { NotesProvider } from './src/context/NotesContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <NotesProvider>
        <AppNavigation />
      </NotesProvider>
      <StatusBar style="dark" backgroundColor="#ffffff" translucent={false} />
    </SafeAreaProvider>
  );
}
