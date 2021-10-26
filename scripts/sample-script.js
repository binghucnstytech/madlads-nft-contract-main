const hre = require("hardhat");

async function main() {
  const Madlads = await hre.ethers.getContractFactory("Madlads");
  const madlad = await Madlads.deploy("Madlads", "MAD", "TEST");

  await madlad.deployed();

}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
