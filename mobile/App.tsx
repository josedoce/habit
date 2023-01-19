import { 
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold
} from '@expo-google-fonts/inter';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { Loading } from './src/components/Loading';
import { Home } from './src/screens/Home';


export default function App() {
  const [fontLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold
  });

  if(!fontLoaded){
    return (<Loading />);
  }

  return (
    <>
      <Home />
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent />
    
    </>
  );
}
