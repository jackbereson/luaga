import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

const SM_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tongtien",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "vi",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tien",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "hoten",
        type: "string",
      },
    ],
    name: "CoHocSinhVuaNapTien",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "arrayHocsinh",
    outputs: [
      {
        internalType: "address",
        name: "_Address",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_Tien",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_Hoten",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "thutu",
        type: "uint256",
      },
    ],
    name: "get_one_Hocsinh",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "hocsinhCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "hoten",
        type: "string",
      },
    ],
    name: "napTien",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "tongtien",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const SM_Address = "0x3cd4cb139fDFA89ef43f80A3426CD1a17F26Ef64";

const ConnectMetamaskMoralis = () => {
  const { authenticate, isAuthenticated, account } = useMoralis();

  const {
    web3,
    enableWeb3,
    isWeb3Enabled,
    isWeb3EnableLoading,
    web3EnableError,
  } = useMoralis();

  const [contract, setContract] = useState();
  const [error, setError] = useState();
  const [tongTien, setTongTien] = useState(0);
  const [list, setList] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      enableWeb3();
    }
  }, [isAuthenticated]);

  useEffect(()=>{
    if(web3){
      loadMoralis();
    }
  },[isWeb3Enabled])

  console.log("isWeb3Enabled", isWeb3Enabled);
  console.log("isAuthenticated", isAuthenticated);
  console.log("account", account);

  const loadMoralis = () => {
    console.log("web3", web3);
    const contract = new web3.eth.Contract(SM_ABI, SM_Address);
    console.log("contract", contract);
    setContract(contract);
    contract.events.CoHocSinhVuaNapTien(
      { filter: {}, fromBlock: "latest" },
      function (err, data) {
        if (err) {
          console.log("err", err);
          setError(err.message);
        } else {
          console.log("data", data);
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

  const connectMetamask = () => {
    authenticate();
  };

  const loadList = () => {};

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
      console.log("contract", contract);
      if (contract) {
      }
      const newMoney = parseFloat(tien || 0).toString();
      const data = {
        from: account,
        value: web3.utils.toWei(newMoney, "ether"),
      };
      contract.methods
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
        <MetamaskAccount currentAccount={account} />
        <div>
          <button onClick={connectMetamask}>Connect metamask</button>
        </div>

        {isAuthenticated && (
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
      {isAuthenticated && (
        <>
          <MetamaskAction />
          <MetamaskTable />
        </>
      )}
      <br />
      {!isAuthenticated && <MetamaskExtLink />}
    </div>
  );
};

export default ConnectMetamaskMoralis;

const MetamaskAccount = ({ currentAccount }) => {
  if (!currentAccount) {
    return <></>;
  }
  return <div>{currentAccount}</div>;
};
