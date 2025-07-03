import { useState } from "react";
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

function AddWallet({ secphrase }) {
  const [privatekey, setprivatekey] = useState([]);
  const [publickey, setpublickey] = useState([]);
  const [index, setIndex] = useState(0);
  const [balances, setBalances] = useState({});
  const [loadingIndex, setLoadingIndex] = useState(null);

  // Your Alchemy Solana RPC endpoint
  const RPC_URL = "https://solana-mainnet.g.alchemy.com/v2/OLIdcDbbtjfQuUP_l1y57";

  function handleClick() {
    const seed = bip39.mnemonicToSeedSync(secphrase);
    const path = `m/44'/501'/${index}'/0'`; 
    const { key } = derivePath(path, seed.toString('hex'));
    const solanaKeypair = Keypair.fromSeed(key);
    let pub = solanaKeypair.publicKey.toBase58();
    let pvt = bs58.encode(key);

    setpublickey(prev => [...prev, pub]);    
    setprivatekey(prev => [...prev, pvt]);   
    setIndex(index + 1);
  }

  async function getBalance(i) {
    setLoadingIndex(i);
    const pubKey = publickey[i];
    
    try {
      const body = {
        jsonrpc: "2.0",
        id: 1,
        method: "getBalance",
        params: [pubKey, { commitment: "confirmed" }]
      };

      const response = await fetch(RPC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.result) {
        // Lamports to SOL conversion (1 SOL = 1,000,000,000 lamports)
        const balanceInSol = data.result.value / 1e9;
        setBalances(prev => ({ ...prev, [i]: balanceInSol.toFixed(9) + " SOL" }));
      } else {
        setBalances(prev => ({ ...prev, [i]: "Error fetching balance" }));
      }
    } catch (error) {
      setBalances(prev => ({ ...prev, [i]: "Error fetching balance" }));
    } finally {
      setLoadingIndex(null);
    }
  }

  return (
    <>
      <div className="mt-[5rem] ml-[10rem] flex">
        <p className="text-white mr-[40rem] font-bold text-[1.4rem]">Add New Wallet</p>
        <button 
          className="text-white bg-green-600 px-[2rem] py-[0.5rem] hover:bg-green-800"
          onClick={handleClick}
        >
          Generate
        </button>
      </div>

      <div className="text-white space-y-4">
        {privatekey.map((pvt, i) => (
          <div 
            key={i} 
            className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 mt-[1rem]"
          >
            <p className="font-semibold mb-2">Index: {i}</p>
            <p className="break-words"><span className="font-semibold">Private Key:</span> {pvt}</p>
            <p className="break-words"><span className="font-semibold">Public Key:</span> {publickey[i]}</p>
            <div className="mt-2">
              {balances[i] ? (
                <h1>Your Balance is: {balances[i]}</h1>
              ) : (
                <button 
                  className="text-white bg-green-600 px-[2rem] py-[0.5rem] hover:bg-green-800"
                  onClick={() => getBalance(i)}
                  disabled={loadingIndex === i}
                >
                  {loadingIndex === i ? "Loading..." : "Get Balance"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default AddWallet;
