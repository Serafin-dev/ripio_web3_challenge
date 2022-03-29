
// ALL products
const getProducts = async (contract) => {
    var products_amount = await contract.size()

    var products = []
    for (var id = 0; id < parseInt(products_amount); id++){
        const product = await contract.products(id);
        
        products.push({
            "name": product.name,
            "id":id,
            "status":product.status,
            "owner":product.owner,
            "newOwner":product.newOwner,
        });
    }
    return products
}

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

    const products_amount = await contract.size()

    var products_from_owner = []
    for (var id = 0; id < parseInt(products_amount); id ++){

        const product = await contract.products(id);
        if (owner == product.owner){
            products_from_owner.push({
                "name": product.name,
                "id":id,
                "status":product.status,
                "owner":product.owner,
                "newOwner":product.newOwner,
            });     
        }
    }
    return products_from_owner
}
module.exports = { getProducts, createNewProduct, delegateProduct, acceptProduct, getProductsFromOwner }