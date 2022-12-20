import {createNativeStackNavigator } from '@react-navigation/native-stack' 
import Welcome from '../pages/welcome'
import Home from '../pages/Home'
import Stats from '../pages/Stats'


const Stack = createNativeStackNavigator()

export default function Route(){
  return(
      <Stack.Navigator>
        <Stack.Screen
         name="Welcome"
         component={Welcome} 
         options={{headerShown:false}}
        />
        <Stack.Screen
         name="Home"
         component={Home}
         options={{headerShown:false}}
        />
        <Stack.Screen
          name="StatsPage"
          component={Stats}
          options={({ route }) => ({
            headerShown:false,
            title: route.params.name ,
            headerStyle: {
              backgroundColor: 'Black', //Set Header color
            },
            headerBackTitle:'Voltar',
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          })}
        />
      </Stack.Navigator>
  )
}