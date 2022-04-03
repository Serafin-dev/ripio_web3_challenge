
// ALL products

// ALL products
const getProducts = async (contract) => {
    var products_amount = await contract.size()

    // save all product promises
    var all_promises = []
    for (var id = 0; id < parseInt(products_amount); id++){
        const promise = contract.products(id); // get promise
        all_promises.push(promise);
    }
    
    // handle promises 
    const all_products =  await Promise.all(all_promises);
    
    // save products 
    for (var id = 0; id < parseInt(products_amount); id++){
        all_products[id] = {
                "name": all_products[id].name,
                "id": id,
                "status": all_products[id].status,
                "owner": all_products[id].owner,
                "newOwner": all_products[id].newOwner,
            };
    }
    return all_products;
};

const createNewProduct = async (contract, wallet, name) => {
    
    // connect the Contract with a Wallet to be able to interact between each other
    const Sender = contract.connect(wallet)

    // Event Listener
    contract.once("NewProduct", (productId, name) => {
        console.log(`Product Created!\n id: ${parseFloat(productId)}, NOMBRE: ${name}`);
    });
    
    // Transaction
    const tx = await Sender.createProduct(name)
    await tx.wait()
    
    return tx    
}

const delegateProduct = async (contract, product_id, wallet, to) => {

    // connect the Contract with a Wallet to be able to interact between each other
    const Sender = contract.connect(wallet)
        
    // Event Listener
    contract.once("DelegateProduct", (productId, newOwner, status) => {
        console.log(`Product succesfully Delegated!\n id: ${parseInt(productId)}, New Owner:${newOwner}, Status: ${parseInt(status)}`);
    });
    // Transaction
    const tx = await Sender.delegateProduct(product_id, to)
    await tx.wait()
    return tx
}

const acceptProduct = async (contract, id, Wallet) => {

    const Sender = contract.connect(Wallet) // Interaction between sender and the contract

    // Event Listener - log information
    contract.once("AcceptProduct", (productId, name, status) => {
        console.log(`Product succesfully accepted!\n id: ${parseInt(productId)}, NAME: ${name}, STATUS: ${parseInt(status)}`);
    });
    // Transaction
    const tx = await Sender.acceptProduct(id)
    await tx.wait()
    return tx
}
// get products that an account owns
const getProductsFromOwner = async (contract, owner) => {

    const products_amount = await contract.size();

    // save all product promises
    var all_promises = []
    for (var id = 0; id < parseInt(products_amount); id++){
        const promise = contract.products(id); // get promise
        all_promises.push(promise); 
    }
    // handle promises 
    const all_products =  await Promise.all(all_promises);
    
    // save products 
    const products_from_owner = [];
    for (var id = 0; id < parseInt(products_amount); id++){
        if (owner == all_products[id].owner){
            products_from_owner.push({
                "name": all_products[id].name,
                "id": id,
                "status": all_products[id].status,
                "owner": all_products[id].owner,
                "newOwner": all_products[id].newOwner,
            });
        };
    };
    return products_from_owner
};
module.exports = { getProducts, createNewProduct, delegateProduct, acceptProduct, getProductsFromOwner }
