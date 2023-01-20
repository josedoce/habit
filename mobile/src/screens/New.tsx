import { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons';
import { BackButton } from "../components/BackButton";
import { CheckBox } from "../components/CheckBox";
import colors from "tailwindcss/colors";

const avilableWeekDays = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
];

export function New(){

  const [weekDays, setWeekDays] = useState<number[]>([]);

  function handleToggleWeekDay(weekDayIndex: number){
    if(weekDays.includes(weekDayIndex)){
      //se tiver, remova
      setWeekDays(prevState=> prevState.filter(weekDay => weekDay !== weekDayIndex));
    }else{
      //se não tiver, coloque
      setWeekDays(prevState => [...prevState, weekDayIndex])
    }
  }

  return(
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView 
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}>
        <BackButton />

        <Text className="mt-6 text-white font-extrabold text-3xl">
          Criar hábito
        </Text>

        <Text className="mt-6 text-white font-semibold text-base">
          Qual seu comprometimento?
        </Text>

        <TextInput 
          className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
          placeholder="Exercícios, dormir bem, etc..."
          placeholderTextColor={colors.zinc[400]}

        />

        <Text className="font-semibold mt-4 mb-3 text-white text-base">
          Qual a recorrência?
        </Text>
        {
          avilableWeekDays.map((weekDay, index) => (
            <CheckBox
              checked={weekDays.includes(index)}
              onPress={()=> handleToggleWeekDay(index)} 
              key={`${weekDay}-${index}`} 
              title={weekDay} />
          ))
        }

        <TouchableOpacity
          className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
          activeOpacity={0.7}
        >
          <Feather
            name="check"
            size={20}
            color={colors.white}
          />
          <Text className="font-semibold text-base text-white ml-2">
            Confirmar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}