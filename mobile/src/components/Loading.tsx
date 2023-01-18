import { View, StyleSheet, ActivityIndicator } from "react-native"

export function Loading(){
  return(
    <View style={style.container}>
        <ActivityIndicator color={"#7c3aed"} />
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#09090a'
  }
})