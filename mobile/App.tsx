import { 
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold
} from '@expo-google-fonts/inter';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { Loading } from './src/components/Loading';


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
    <View style={styles.container}>
      <Text style={styles.text}>Open up App.tsx to start working on your app!</Text>
      <StatusBar
      backgroundColor="transparent"
        barStyle="light-content"
        translucent />
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontFamily: 'Inter_800ExtraBold'
  }
});
