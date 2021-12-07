import logo from "./logo.svg";
import "./App.css";
import styled from "styled-components";
import ConnectMetamask from "./component/ConnectMetamask";
import { socket, SocketContext } from "./context/socket";
import SocketConnection from "./component/SocketConnection";
import { MoralisProvider } from "react-moralis";
import ConnectMetamaskMoralis from "./component/ConnectMetamaskMoralis";

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <MoralisProvider
        appId="yabnvWayPYqBegNGfbNoMnNBdQoN4FPL0zBwgB05"
        serverUrl="https://ri6wxg1ufzks.usemoralis.com:2053/server"
      >
        <div className="App">
          <AppHeader>
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <ConnectMetamaskMoralis />
            <SocketConnection />
          </AppHeader>
        </div>
      </MoralisProvider>
    </SocketContext.Provider>
  );
}

export default App;

const AppHeader = styled.header`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;
