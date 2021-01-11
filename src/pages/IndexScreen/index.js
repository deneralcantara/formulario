import React, { useEffect } from 'react';
import { Text, View, FlatList, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { style } from './styles'
import AsyncStorage from '@react-native-async-storage/async-storage';

const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

export default function IndexScreen({navigation}) {

  const [users, setUsers] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getUsers();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    getUsers()
  }, []); 

  async function getUsers(){
    let users_array = await AsyncStorage.getItem('users');
    setUsers(JSON.parse(users_array));
  }

  async function clearUsers(){
    await AsyncStorage.clear();
    
    setUsers(null);
  }

  if(users){
    return (
      <View style={style.body}>

        <Text style={{marginTop: 15}}>Para atualizar a lista, é só deslizar para baixo =)</Text>
        <TouchableOpacity onPress={() => clearUsers()} style={style.button}>
          <Text style={style.buttonText}>Apagar tudo</Text>
        </TouchableOpacity>

        <View style={style.flatlist}>
          <View style={style.list_user}>
            <Text style={style.header}>Nome</Text>
            <Text style={style.header}>Email</Text>
            <Text style={style.header}>Telefone</Text>
          </View>
        </View>
         
          <FlatList refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            style={style.flatlist}
            data={users}
            renderItem={({item} ) => (
              <View>
                <TouchableOpacity onPress={() => navigation.navigate('Perfil', {user: item})} style={[style.list_user, {borderBottomWidth: 1, borderBottomColor: "#a6a6a6", paddingBottom: 20, paddingTop: 20}]}>
                  <Text>{item.name}</Text>
                  <Text>{item.email}</Text>
                  <Text>{item.telephone}</Text>
                </TouchableOpacity>
              </View>
          )}
            keyExtractor={(item) => item.id}
          />
      </View>
    );
  }else{
    return (
      <View style={[style.body, {marginTop: 200}]}>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <Text style={style.text}>Bem vindo ao aplicativo Formulário! Para atualizar essa lista, é só deslizar para baixo =)</Text>  
        </ScrollView>
      </View>
    );
  }
}