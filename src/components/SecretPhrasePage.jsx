import { useState } from "react";
import * as bip39 from "bip39";

function SecretPhrasePage({ secphrase, setsecphrease }) {
  const [secgen, setSecgen] = useState(false);

  // Generate a 128-bit mnemonic phrase (12 words)
  const generateMnemonic = () => {
    return bip39.generateMnemonic(128);  // 128 bits = 12 words
  };

  // Handle button click to generate secret phrase
  function handleClick() {
    setSecgen(true);  // Toggle to show generated phrase
    const mnemonic = generateMnemonic();  // Generate mnemonic
    setsecphrease(mnemonic);  // Update the parent state with the generated mnemonic
  }

  return (
    <div className="pt-[4rem]">
      {!secgen ? (
        <div className="pl-[10rem] flex ">
          <p className="text-white mr-[40rem] font-bold text-[1.4rem]">Generate your own Secret phrase</p>
          <button 
            className="text-white bg-green-600 px-[2rem] py-[0.5rem] hover:bg-green-800"
            onClick={handleClick}  // On click, trigger the mnemonic generation
          >
            Generate
          </button>
        </div>
      ) : (
        <div className="pl-[10rem] flex items-center space-x-4">
          <p className="text-white font-bold text-[1.4rem]">Secret Phrase:</p>
          <p className="text-white font-bold text-[1rem]">{secphrase}</p>
        </div>

      )}
    </div>
  );
}

export default SecretPhrasePage;
