import {View,Text , TouchableOpacity} from 'react-native'
import Logo from '../assets/logo.svg';
import { Feather } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';

export function Header(){
  return(
    <View className='w-full flex-row items-center justify-between'>
      <Logo />
      <TouchableOpacity activeOpacity={0.7} className='flex-row items-center h-11 px-4 border border-violet-500 rounded-lg active:border-violet-300'>
        <Feather 
          name='plus'
          color={colors.violet[500]}
          size={20}
        />
        <Text className='text-white ml-3 font-semibold text-base'>Novo hábito</Text>
      </TouchableOpacity>
    </View>
  )
}