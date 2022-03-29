 
require('dotenv').config(); // environment module

// Requires
const express = require('express'); // Express : represents the api we are building and its value = an import of the express package 
const { ethers } = require('ethers'); // Ethers
const products = require('./products'); // Products module

// initializes the app
const app = express();
const PORT = 8080;

app.use(express.json());

// call a callback function as second parameter TO KNOW WHEN THE API IS READY (OPTIONAL)
app.listen(PORT, () => console.log(`It is alive on http://localhost:${PORT}`)) // conectas la web al servidor
// JsonRPC provider
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);
// contract interface
const abi = [{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"createProduct","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"productToOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_productId","type":"uint256"},{"name":"_newOwner","type":"address"}],"name":"delegateProduct","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_productId","type":"uint256"}],"name":"acceptProduct","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"products","outputs":[{"name":"name","type":"string"},{"name":"status","type":"uint8"},{"name":"owner","type":"address"},{"name":"newOwner","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"size","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"productId","type":"uint256"},{"indexed":false,"name":"name","type":"string"}],"name":"NewProduct","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"productId","type":"uint256"},{"indexed":false,"name":"newOwner","type":"address"},{"indexed":false,"name":"status","type":"uint8"}],"name":"DelegateProduct","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"productId","type":"uint256"},{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"status","type":"uint8"}],"name":"AcceptProduct","type":"event"}]
// contract
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, provider)

// All Products 
// como segundo parametro se le pasa una CALLBACK function, que SE EJECUTA CUANDO UN USUARIO ingresa a esta ruta.
app.get('/api/products', async (req, res) => {

    // Get all products from contract
    const all_products = await products.getProducts(contract);
    
    //response 
    res.status(200).send({
        all_products    
    })
});

// Create product
app.post('/api/create_product/:name', async (req, res) => {
    
    // Request 
    const { name } = req.params;

    // Ckeck params
    if (!name){
        res.status(418).send({
            message : "You need to give the product a name! "
        })
    }
    // Backend Wallet
    const backend_Wallet = new ethers.Wallet(process.env.PK, provider) 

    //Transaction
    const tx = await products.createNewProduct(contract, backend_Wallet, name);
    
    //Response 
    res.send({
        message:"Product created succesfully",
        tx 
    });
});

// Delegate Product
// id = 55, 56, 57, 59
// {"new_owner":"0x54773Cd3baA62Fab47468b5Bc128bA55D5896E59", "owner_pk" : "becc443de304bdd2aa386785d18470fa655a6137fc184f0aaf52e35b80035878"}
app.post('/api/delegate_product/:id', async (req, res) => {
    
    // Request
    const { id } = req.params; // product id
    const from = req.body.owner_pk; // owner private key
    const to = req.body.new_owner; // newOwner public key
    
    //Check params
    if(!id || !from || !to){
        res.status(418).send({
            message : "Product Id, public key and private key are needed"
        })
    }
    // Owner Wallet
    const Wallet = new ethers.Wallet(from, provider) // sender Wallet
    
    // Response
    const tx = await products.delegateProduct(contract, id, Wallet, to)
    res.send({
        message : `Product succesfully delegated to ${to}`,
        tx 
    })

});

// Accept Product
// {"pk":"9ec233b6619add55c73f0445708ab0ead286d6ddad95a9cb4b220b0a77722ad4"}
app.post('/api/accept_product/:id', async (req, res) => {
    // Request
    const { id } = req.params;//product id
    const pk  = req.body.pk; // newOwner private key

    // Check params
    if (!pk || !id){
        res.status(418).send({
            message : " ¡A private Key and an id are needed! "
        })
    }
    // Owner Wallet
    const Wallet = new ethers.Wallet(pk, provider) // sender Wallet

    // Transaction
    const tx = await products.acceptProduct(contract, id, Wallet)
    
    //response 
    res.send({
        message : "Product accepted",
        tx
    })
});

// See Products from owner
app.get('/api/owner_products/:owner', async (req, res) => {
    const { owner } = req.params;// public key
    
    // Ckeck params
    if (!owner){
        res.status('418').send({
            message: "A public Key is needed"
        })
    }
    // get products from acc
    const products_from_owner = await products.getProductsFromOwner(contract, owner)
    
    //response 
    res.status('200').send({
        products_from_owner
    })
});