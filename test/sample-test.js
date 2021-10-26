const { expect } = require("chai");
const hre = require("hardhat");
const ethers = require("ethers")

/**
 * Test 1 - Purchase one madlad *
 * Test 2 - Purchase 12 madlads *
 * Test 3 - Purchase 15 madlads *
 * Test 4 - Hit max cap expect error *
 * Test 5 - Hit max cap, update max cap, expect success *
 * Test 6 - Capture historical events
 */
it("Purchase one madlad", async function () {
  const Madlads = await hre.ethers.getContractFactory("Madlads");
  const madlad = await Madlads.deploy("Madlads", "MAD", "TEST", 100);
  await madlad.deployed();

  await madlad.mintMadlad( 1, { value: ethers.utils.parseEther("0.35") })
  const nftURI = await madlad.tokenURI(1)
  expect(nftURI).to.equal("TEST1")

});

// need to get addresses
it("Purchase 12 madlads", async function () {
  const [owner, signer] = await hre.ethers.getSigners();

  const Madlads = await hre.ethers.getContractFactory("Madlads");
  const madlad = await Madlads.deploy("Madlads", "MAD", "TEST", 100);
  await madlad.deployed();

  await madlad.connect(signer).mintMadlad( 12, { value: ethers.utils.parseEther("4") })
  const signerBalance = await madlad.balanceOf(signer.address)
  expect(signerBalance).to.equal(12)
});

it("Purchase 15 madlads", async function () {
  const [owner, signer] = await hre.ethers.getSigners();

  const Madlads = await hre.ethers.getContractFactory("Madlads");
  const madlad = await Madlads.deploy("Madlads", "MAD", "TEST", 100);
  await madlad.deployed();

  await madlad.connect(signer).mintMadlad( 15, { value: ethers.utils.parseEther("5") })
  const signerBalance = await madlad.balanceOf(signer.address)
  expect(signerBalance).to.equal(15)
});

it("Hit max cap expect errors", async function () {
  const [owner, signer] = await hre.ethers.getSigners();

  const Madlads = await hre.ethers.getContractFactory("Madlads");
  const madlad = await Madlads.deploy("Madlads", "MAD", "TEST", 12);
  await madlad.deployed();

  await expect(madlad.connect(signer).mintMadlad( 15, { value: ethers.utils.parseEther("5") })).to.be.revertedWith('Sale has already ended.')
});

it("Hit max cap, update max cap, expect success", async function () {
  const [owner, signer] = await hre.ethers.getSigners();

  const Madlads = await hre.ethers.getContractFactory("Madlads");
  const madlad = await Madlads.deploy("Madlads", "MAD", "TEST", 12);
  await madlad.deployed();

  await expect(madlad.connect(signer).mintMadlad( 15, { value: ethers.utils.parseEther("5") })).to.be.revertedWith('Sale has already ended.')

  await madlad.connect(owner).changeMaxSupply(100)
  const maxSupply = await madlad.MAX_SUPPLY()
  expect(maxSupply).to.equal(100)

  await madlad.connect(owner).mintMadlad( 15, { value: ethers.utils.parseEther("5") })

  const ownerSupply = await madlad.balanceOf(owner.address)
  expect(ownerSupply).to.equal(45)
});
