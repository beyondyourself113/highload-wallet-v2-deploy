import { toNano } from '@ton/core';
// import { HighloadWalletV2 } from '../wrappers/HighloadWalletV2';
import { NetworkProvider } from '@ton/blueprint';
import { mnemonicNew, mnemonicToPrivateKey } from '@ton/crypto';
import { HighloadWalletV2 } from "@scaleton/highload-wallet";

export async function run(provider: NetworkProvider) {
  if (!process.env.WALLET_MNEMONIC) {
    console.error('Variable WALLET_MNEMONIC must be specified.');
    process.exit(1);
  }

  const highloadMnemonicArray = await mnemonicNew(24);

  const keyPair = await mnemonicToPrivateKey(highloadMnemonicArray);
  console.log("mnemonic====>", highloadMnemonicArray)
  // const keyPair = await mnemonicToPrivateKey(
  //   (process.env.WALLET_MNEMONIC).split(' '),
  // );

  const highloadWalletV2 = provider.open(
    new HighloadWalletV2(keyPair.publicKey),
  );

  await highloadWalletV2.sendDeploy(provider.sender(), toNano('0.05'));

  await provider.waitForDeploy(highloadWalletV2.address);
}
