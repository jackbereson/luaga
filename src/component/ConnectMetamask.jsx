import { useEffect, useState } from "react";
import Web3 from "web3";
import Moralis from "moralis";

const SM_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tongtien",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "vi",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tien",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "hoten",
				"type": "string"
			}
		],
		"name": "CoHocSinhVuaNapTien",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "arrayHocsinh",
		"outputs": [
			{
				"internalType": "address",
				"name": "_Address",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_Tien",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_Hoten",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "thutu",
				"type": "uint256"
			}
		],
		"name": "get_one_Hocsinh",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "hocsinhCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "hoten",
				"type": "string"
			}
		],
		"name": "napTien",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tongtien",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const SM_Address = "0x3cd4cb139fDFA89ef43f80A3426CD1a17F26Ef64";

//https://remix.ethereum.org/#optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.7+commit.e28d00a7.js

//https://ropsten.etherscan.io/address/0x5e032ad1dfac01024febc28770a3d0af14c42c6a

//https://infura.io/dashboard/stats/ethereum/24h/all-projects
var web3 = null;
const ConnectMetamask = () => {
  const [metaInstalled, checkInstalled] = useState(false);
  const [currentAccount, setAccount] = useState();
  const [contractMM, setContractMM] = useState();
  const [, setContractInfura] = useState();
  const [error, setError] = useState();
  const [tongTien, setTongTien] = useState(0);
  const [list, setList] = useState([]);

  useEffect(() => {
    if (window?.ethereum) {
      console.log("Metamask is installed");
      checkInstalled(true);

      window.ethereum.on("chainChanged", () => {
        setAccount(null);
      });
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0]);
      });
    } else {
      console.log("Metamask is not installed");
    }
  }, []);

  useEffect(() => {
    // loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractMM, web3]);

  const connectMetamask = () => {
    const { ethereum } = window;
    ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((accounts) => {
        // console.log("data", accounts);
        setAccount(accounts[0]);
        loadContractMetamask();
        loadContractInfura();
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const loadContractMetamask = () => {
    setError();
    web3 = new Web3(window.ethereum);
    const contractMM = new web3.eth.Contract(SM_ABI, SM_Address);
    setContractMM(contractMM);
  };

  const loadContractInfura = () => {
    const provider = new Web3.providers.WebsocketProvider(
      "wss://ropsten.infura.io/ws/v3/88380146e86b4b99941a59eb0e69d4b3"
    );
    const infuraWeb3 = new Web3(provider);
    const contractInfura = new infuraWeb3.eth.Contract(SM_ABI, SM_Address);
    setContractInfura(contractInfura);
    contractInfura.events.CoHocSinhVuaNapTien(
      { filter: {}, fromBlock: "latest" },
      function (err, data) {
        if (err) {
          console.log("err", err);
          setError(err.message);
        } else {
          console.log('data',data);
          const tongtien = web3.utils.fromWei(data.returnValues[0], "ether");
          setTongTien(tongtien);
          const item = {
            hoten: data.returnValues[3],
            account: data.returnValues[1],
            eth: web3.utils.fromWei(data.returnValues[2], "ether"),
          };
          setList([item, ...list]);
        }
      }
    );
  };

  //   console.log("currentAccount", currentAccount);

  const loadList = () => {
    if (contractMM && web3) {
      contractMM.methods
        .hocsinhCounter()
        .call() // send có phí - call ko có phí
        .then((data) => {
          const tong = parseInt(data);
          if (tong > 0) {
            const promiseList = [];
            for (let i = 0; i < tong; i++) {
              promiseList.push(contractMM.methods.get_one_Hocsinh(i).call());
            }
            Promise.all(promiseList).then((hsList) => {
              const ethList = [];
              for (const hs of hsList) {
                const item = {
                  hoten: hs["2"],
                  account: hs["0"],
                  eth: web3.utils.fromWei(hs["1"], "ether"),
                };
                ethList.push(item);
              }
              setList(ethList);
            });
          }
        })
        .catch((error) => {
          console.log("error", error);
          setError(error.message);
        });
    }
  };

  const MetamaskAction = () => {
    const [hoten, setHoten] = useState("test");
    const [tien, setTien] = useState("0.0001");
    const onChangeHoten = (e) => {
      setHoten(e.target.value);
    };

    const onChangeTien = (e) => {
      setTien(e.target.value);
    };

    const sendMoney = () => {
      //   console.log("data", data);
      if (contractMM) {
      }
      const newMoney = parseFloat(tien || 0).toString();
      const data = {
        from: currentAccount,
        value: web3.utils.toWei(newMoney, "ether"),
      };
      contractMM.methods
        .napTien(hoten)
        .send(data) // send có phí - call ko có phí
        .then((data) => {
          console.log("data", data);
          loadList();
        })
        .catch((error) => {
          console.log("error", error);
          setError(error.message);
        });
    };

    return (
      <div>
        <MetamaskAccount currentAccount={currentAccount} />
        <div>
          <button onClick={connectMetamask}>Connect metamask</button>
        </div>

        {contractMM && (
          <div>
            <h1>Gửi tiền ở đây</h1>
            <div>
              <label>Họ tên</label>
              <input
                type="text"
                defaultValue={hoten}
                onChange={onChangeHoten}
              />
            </div>
            <div>
              <label>Số tiền </label>
              <input
                type="number"
                defaultValue={tien}
                onChange={onChangeTien}
              />
            </div>
            <div>
              <button onClick={sendMoney}>Gửi tiền</button>
            </div>
            {error && <div>{error}</div>}
          </div>
        )}
      </div>
    );
  };

  const MetamaskTable = () => {
    return (
      <div>
        <h3>{tongTien} ETH</h3>
        <table>
          <thead>
            <tr>
              <td>Ho ten</td>
              <td>Account</td>
              <td>ETH</td>
            </tr>
          </thead>
          <tbody>
            {list?.map(({ hoten, account, eth }, k) => {
              return (
                <tr key={k}>
                  <td>{hoten}</td>
                  <td>{account}</td>
                  <td>{eth}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const MetamaskExtLink = () => {
    return (
      // eslint-disable-next-line react/jsx-no-target-blank
      <a
        style={{ color: "#fff" }}
        href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?utm_source=chrome-ntp-icon"
        target={"_blank"}
      >
        Download metamask
      </a>
    );
  };

  return (
    <div style={{ padding: "2em" }}>
      {metaInstalled && (
        <>
          <MetamaskAction />
          <MetamaskTable />
        </>
      )}
      <br />
      {!metaInstalled && <MetamaskExtLink />}
    </div>
  );
};

export default ConnectMetamask;

const MetamaskAccount = ({ currentAccount }) => {
  if (!currentAccount) {
    return <></>;
  }
  return <div>{currentAccount}</div>;
};
