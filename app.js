// Requires
require('dotenv').config();
const express = require('express'); 
const { ethers } = require('ethers');
const products = require('./controllers/products');
const abi = require("./contracts/abi");

// app 
const app = express();
app.use(express.json());

// Web3 config 
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, provider);

// get all Products 
app.get('/products', async (req, res) => {
    
    // Get all products from contract
    const all_products = await products.getProducts(contract);
    
    //response 
    res.status(200).send({
        all_products    
    });
});

// Create product
app.post('/create_product/:name', async (req, res) => {
    
    // Request 
    const { name } = req.params

    if (!name){
        res.status(418).send({
            message : "You need to give the product a name! "
        });
    };

    const backend_Wallet = new ethers.Wallet(process.env.PK, provider);
    products.createNewProduct(contract, backend_Wallet, name);
    
    res.send({
        message:`Product created with name: ${name}`; 
    });
});
// delegate product
app.post('/delegate_product/:id', async (req, res) => {
    
    // Request
    const { id } = req.params; // product id
    const from = req.body.owner_pk; // owner private key
    const to = req.body.new_owner; // newOwner public key
    
    if(!id || !from || !to){
        res.status(418).send({
            message : "Product Id, public key and private key are needed"
        });
    };
    // Owner Wallet
    const Wallet = new ethers.Wallet(from, provider) // sender Wallet
    products.delegateProduct(contract, id, Wallet, to)

    res.send({
        message : `Product succesfully delegated to ${to}`
    });

});

// Accept Product
app.post('/accept_product/:id', async (req, res) => {
    
    // Request
    const { id } = req.params //product id
    const pk  = req.body.pk // newOwner private key

    // Check params
    if (!pk || !id){
        res.status(418).send({
            message : " ¡A private Key and an id are needed! "
        });
    };

    const Wallet = new ethers.Wallet(pk, provider) // sender Wallet
    products.acceptProduct(contract, id, Wallet)
    
    //response 
    res.send({
        message : `Product accepted with id:${id}`
    });
});
//0x61BB5BAA4ED7Ff7Ac86BFb7cAcbB29c7e5EC8678
// Read Products from owner
app.get('/owner_products/:owner', async (req, res) => {
    
    const { owner } = req.params;// public key
    
    // Ckeck params
    if (!owner){
        res.status('418').send({
            message: "A public Key is needed"
        });
    };
    
    const products_from_owner = await products.getProductsFromOwner(contract, owner);
    
    //response 
    res.status('200').send({
        products_from_owner
    });
});

module.exports = app;