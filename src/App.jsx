import React, { useState } from 'react';
import SecretPhrasePage from  "./components/SecretPhrasePage";
import AddWallet from './components/AddWallet';

function App() {
  const [secphrase, setsecphrease] = useState("");  // State to store the secret phrase

  return (<>
    <div className="bg-black min-h-screen">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-[4rem] font-bold text-white">NeuroSol</h1>
        <p className="text-[1.5rem] font-bold text-white">
          Simple way to create your own Solan wallet
        </p>
      </div>

      {/* Seed Phrase Component */}
      <SecretPhrasePage secphrase={secphrase} setsecphrease={setsecphrease} />

      {secphrase!==""? 
      <div>
        <AddWallet secphrase={secphrase}/>
      </div>:
      <div>
        
      </div>  
    }

    
      
    </div>
    <div>
      <footer className="text-white bg-black text-center">Vansh's Built © 3-7-2025</footer>
    </div>
    </>
  );
}

export default App;
