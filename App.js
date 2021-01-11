import React, { useState, useEffect, useRef } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import FormScreen from './src/pages/FormScreen'
import IndexScreen from './src/pages/IndexScreen'
import ProfileScreen from './src/pages/ProfileScreen'
import * as Notifications from 'expo-notifications';

import Ionicons from "react-native-vector-icons/Ionicons";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Erro ao obter token para notificacao push!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Voce deve usar um telefone fisico para notificacao push.');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }
  

  const Tab = createBottomTabNavigator();
  const HomeStack = createStackNavigator();

  function ProfileStackScreen() {
    return (
      <HomeStack.Navigator>
        <HomeStack.Screen name="Inicio" component={IndexScreen} />
        <HomeStack.Screen name="Perfil" component={ProfileScreen} />
      </HomeStack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size}) => {
            let iconName;

            if(route.name === "Página Inicial"){
              iconName = "home-outline";
            }
            else if(route.name === "Formulário"){
              iconName = "document-text-outline";
            }

            return <Ionicons name={iconName} size={size} color ={color} />;
          }
        })}>
        <Tab.Screen name="Página Inicial" component={ProfileStackScreen} />
        <Tab.Screen name="Formulário" component={FormScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}