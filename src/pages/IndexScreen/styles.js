import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
    body: {  
        flex:1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        textAlign: "center",
    },
    flatlist: {
        width: "100%",
        paddingLeft: 30,
        paddingRight: 30,
    },
    header: {
        marginTop: 50,
        fontWeight: "bold",
        fontSize: 15,
    },
    list_user: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    deleteItem: {
        backgroundColor: '#00000090',
        borderRadius: 10,
        paddingRight: 30,
        paddingLeft: 30,
        paddingBottom: 15,
        alignItems: "center",
        marginLeft: 30,
        marginRight: 30,
    },
    button: {
        backgroundColor: '#d9534f',
        borderRadius: 10,
        paddingRight: 20,
        paddingLeft: 20,
        paddingBottom: 15,
        alignItems: "center",
        marginLeft: 50,
        marginRight: 50,
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 15,
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        fontWeight: 'bold'
    },
})