import Common from 'ethereumjs-common'

const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;

export const createAccount = () => {
    const web3 = new Web3( "http://localhost:8545");
    const data =  web3.eth.accounts.create()
    return data 
}

export const createPersonalAccount = () => {
    const web3 = new Web3( "http://localhost:8545");
    return web3.eth.personal.newAccount("exchange")
    .then((result) => {
        return result
    })
    .catch((err) => {
        console.log(err)
    })
}

export const getBalance =  async (account) => {
     const web3 = await new Web3( "http://localhost:8545");
    return web3.eth.getBalance(account.toString())
    .then((balance) => {
        return balance
    })
    .catch((err) => {
        throw err
    })
}

export const checkTransaction =  async (transactionId) => {
    const web3 = await new Web3( "http://localhost:8545");
    return  web3.eth.getTransactionReceipt(transactionId)
    .then((txR) => {
        if (txR.blockNumber == undefined) {
            throw "transaction receipt not found";
        } else {
            return  web3.eth.getTransaction(transactionId)
            .then((tx) => {
                if (tx.blockNumber == undefined|| tx.value == undefined) {
                    throw "transaction receipt not found";
                } else {
                    return tx
                }
            })
            .catch((err) => {
                throw err
            })
        } 
    }).catch((err)=>{
        throw(err)
    })
}

export const getEtheriumNonce=((address) => {
    const web3 =  new Web3( "http://localhost:8545");
    return web3.eth.getTransactionCount(address,'pending')
    .then((nonce) => {
    //got nonce proceed with creating and signing transaction
        return nonce;
    })
    .catch((err) => {
        throw err
    })  
})

export const sendEther =  async (account,value) => {
    const web3 = await new Web3( "http://localhost:8545");
    //unlock it for a period of 15 secs
    return  web3.eth.personal.unlockAccount("0x868453967f6806ef86de7cf5e57a32ab28b875b4","exchange", 15000)
    .then((unlocked) => {
        return web3.eth.sendTransaction({
            //from: process.env.ADMIN_ETHERIUM_ACCOUNT_ADDRESS,
            from: '0x868453967f6806ef86de7cf5e57a32ab28b875b4',
            to: account.toString(),
            value: web3.utils.toWei (value.toString())
        })
        .then((receipt) => {
            // then lock it
            return web3.eth.personal.lockAccount("0x868453967f6806ef86de7cf5e57a32ab28b875b4")
            .then(() => {
                return receipt
            })
            .catch((err) => {
                return receipt
            })
        })
        .catch((err) =>{
            throw err
        })
    }).catch((err)=>{
        throw(err)
    })
}

export const receiveEtherFromClient = (transactionHash) => {
    //receive transaction from the ui and send it
    const web3 =  new Web3( "http://localhost:8545");
    let rawTx =  undefined
    let transaction = undefined
    //custom network
    const customCommon = Common.forCustomChain(
        'mainnet',
        {
          name: 'my-network',
          networkId: 1981,
          chainId: 1981,
        },
        'petersburg',
      )
    const preData = () => {
        const privateKey = Buffer.from(
            '64061456066baa81c5097c895b5176fb3e1452eaf6f6776e2d7bf07ddb9accfe',
            'hex'
        )
        //parameters should be hex string starting with 0x
        const txParams = {
            nonce: '0x01',
            gas: 50002,
            gasPrice: Number(web3.utils.toWei('601', 'gwei')),
            to: '0x868453967f6806ef86de7cf5e57a32ab28b875b4',
            value:  10000003
        }
        // The second parameter is not necessary if these values are used
        const tx = new Tx(txParams,{common : customCommon})
        tx.sign(privateKey)
        const serializedTx = tx.serialize()
        return rawTx = '0x' + serializedTx.toString('hex');
    }
    return Promise.all([preData()])
    .then(()=>{
        return  web3.eth.sendSignedTransaction(rawTx)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            throw err;
        })
    })
    .catch((err) => {
        throw err
    })
}

export const getAccounts = async () => {
    const web3 = await new Web3( "http://localhost:8545");
    return web3.eth.getAccounts()
    .then((result)=>{
        console.log("all acounts is ", result)
    })
    .catch((err)=>{
        throw err
    })
}
