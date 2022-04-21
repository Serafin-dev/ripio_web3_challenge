# ripio_web3_challenge

## Hola. 
### Dependencias 
- DOTENV
- Express
- Librería Ether.js

Para poder usar la API :
### 1- Instalar Node</h4>
### 1- Clonar el repositorio Master</h4>
### 2- Crear un archivo .env en la ruta principal del proyecto e incluir lo siguiente, un elemento por línea y sin espaciado entre caracteres:
#### .env:
- PORT="EL-PUERTO-QUE-DESEES" //yo usé "8080"
- PROVIDER="https://rpc-mumbai.maticvigil.com/v1/28655f72958aeffeb2f7e6dd638683465b1770c3"
- PK="ACA-VA-LA-CLAVE-PRIVADA-DE-TU-WALLET-SIN-ESPACIOS"
- CONTRACT_ADDRESS="0xd9E0b2C0724F3a01AaECe3C44F8023371f845196" // copiar esta misma dirección

<h4>3- En la terminal pararse sobre la carpeta API y correr el siguiente comando para iniciar:

  
  `node .`

  
### 4- Instalar Postman o Insomnia(opcional)

#### Rutas /api
| Path | Method | Requerimientos |
| --- | --- | --- |
| /api/products | GET | Definir previamente CONTRACT_ADDRESS en archivo .env |
| /api/create_product/:name | POST | Definir previamente PK(private key) en tu archivo .env y reemplazar :name de la url por el nombre del producto que deseas crear |
| /api/delegate_product/:id | POST | Reemplazar el id de la url (:id) por el id del producto y el siguiente JSON por el BODY del request: {"new_owner":"ACA-Va-PUBLIC-KEY-A-LA-QUE-QUIERES-DELEGAR-EL-PRODUCTO", "owner_pk" : "ACA-VA-LA-PRIVATE-KEY-DUEÑA-DE-ALGUN-PRODUCTO"} |
| /api/accept_product/:id | POST | Reemplazar el id de la url (:id) por el id del producto a aceptar, y pasar el siguiente JSON por el BODY del request: {"pk":"ACA-VA-LA-PRIVATE-KEY-A-LA-QUE-LE-DELEGARON-ALGUN-PRODUCTO"} |
| /api/owner_products/:owner | GET | Reemplazar :owner de la url por una public key |
