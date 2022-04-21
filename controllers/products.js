// - No tiene error handling ni manejo de excepciones (try-catch-finally). Si algo falla, la API se cae y hay que levantarla de nuevo.
// - El ABI del contrato esta harcoreado dentro del script en lugar de estar en un archivo aparte.
// - Todos los endpoints contienen /abi, podría haberse extraído en un .env o ser configurado más arriba en el entry point.
// - Al crear un producto, por un lado se suscribe al evento de creación, pero a la vez awaitea la TX y la devuelva ya minada. Esto retrasa la response y vuelve irrelevante la suscripción al evento.
const getProducts = async (contract) => {
    var products_amount = await contract.size()

    var all_promises = []
    for (var id = 0; id < parseInt(products_amount); id++){
        // product promise
        const promise = new Promise((resolve, reject) => {
            contract.products(id)
                .then((result) => {
                    resolve(result)
                })
                .catch(() => {
                    resolve(null) 
                });
        })
        all_promises.push(promise);
    }        
    
    const all_products =  await Promise.all(all_promises);
    
    for (var id = 0; id < parseInt(products_amount); id++){
        if (all_products[id] != null){
            all_products[id] = {
                    "name": all_products[id].name,
                    "id": id,
                    "status": all_products[id].status,
                    "owner": all_products[id].owner,
                    "newOwner": all_products[id].newOwner,
                };
        };
    }
    return all_products;
};

const createNewProduct = async (contract, wallet, name) => {
    
    // connect the Contract with a Wallet 
    const Sender = contract.connect(wallet)

    // Event Listener 
    contract.once("NewProduct", (productId, name) => {
        console.log({
            "message":"Product succesfully created",
            "id": productId, 
            "Name": name,
        })
    });
    Sender.createProduct(name);
    
};

const delegateProduct = async (contract, product_id, wallet, to) => {

    // connect the Contract with a Wallet
    const Sender = contract.connect(wallet)
        
    // Suscribe to Delegate event
    contract.once("DelegateProduct", (productId, newOwner, status) => {
        console.log({
            "message":"Product succesfully Delegated",
            "id": productId, 
            "New Owner": newOwner,
            "Status": status
        });
    });
    // Delegate product
    Sender.delegateProduct(product_id, to);
};

const acceptProduct = async (contract, id, Wallet) => {

    const Sender = contract.connect(Wallet) // Interaction between sender and the contract

    // Event Listener - log information
    contract.once("AcceptProduct", (productId, name, status) => {
        console.log(`Product succesfully accepted!\n id: ${parseInt(productId)}, NAME: ${name}, STATUS: ${parseInt(status)}`);
    });
    // Transaction
    Sender.acceptProduct(id);
};

//0x61BB5BAA4ED7Ff7Ac86BFb7cAcbB29c7e5EC8678
const getProductsFromOwner = async (contract, owner) => {
    
    var products_amount = await contract.size();
    
    // handle promises 
    const all_products = await getProducts(contract); 
    
    // save products 
    const products_from_owner = [];
    for (var id = 0; id < parseInt(products_amount); id++){
        if (owner == all_products[id].owner)
            products_from_owner.push(all_products[id]);
    };
    return products_from_owner
};
module.exports = { getProducts, createNewProduct, delegateProduct, acceptProduct, getProductsFromOwner };