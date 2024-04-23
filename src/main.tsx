import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { KitProvider } from '@0xsequence/kit'
import { getDefaultConnectors } from '@0xsequence/kit-connectors'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig, http, WagmiConfig } from 'wagmi'
import { mainnet, polygon, Chain } from 'wagmi/chains'
 
const queryClient = new QueryClient() 
 
function Dapp() {
  const chains = [mainnet, polygon] as [Chain, ...Chain[]]
  
  const projectAccessKey = 'jflHSuIP97vcdmfqDBxUogZAAAAAAAAAA'
 
  const connectors = getDefaultConnectors({
    walletConnectProjectId: '458215b98fce3f9f700f2c233b932ae1',
    defaultChainId: 43113,
    appName: 'demo app',
    projectAccessKey
  })
 
  const transports: any = {}
 
  chains.forEach(chain => {
    transports[chain.id] = http()
  })
  
  //@ts-ignore
  const config = createConfig({
    transports,
    connectors,
    chains
  })
 
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}> 
        <KitProvider config={{}}>
          <App />
        </KitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Dapp />
  </React.StrictMode>,
)
