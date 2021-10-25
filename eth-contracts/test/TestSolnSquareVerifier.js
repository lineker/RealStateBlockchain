// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier

const truffleAssert = require('truffle-assertions');

var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
var SquareVerifier = artifacts.require("SquareVerifier");

contract("SolnSquareVerifier", (accounts) => {
  var verifier;
  var contract;
  const account_one = accounts[0];
  const account_two = accounts[1];
  let proof = require("./proof");

  describe("Test - SolnSquareVerifier", function () {
    beforeEach(async function () {
      verifier = await SquareVerifier.new({ from: account_one });
      contract = await SolnSquareVerifier.new(verifier.address, {
        from: account_one,
      });
    });

    // Test if a new solution can be added for contract - SolnSquareVerifier
    it("Test if a new solution can be added for contract", async function () {
      const {
        proof: { a, b, c },
        inputs: input,
      } = proof;
      
      console.log(`${account_two}, ${5}, ${a}, ${b}, ${c}, ${input}`)
      let key = await contract.getVerifierKey(a, b, c, input);

      let result = await contract.addSolution(account_two, 2, key);

      // Test event is emitted
      truffleAssert.eventEmitted(result, 'SolutionAdded');
    });

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it("Test if an ERC721 token can be minted for contract", async function () {
      const {
        proof: { a, b, c },
        inputs: input,
      } = proof;

      let totalSupply = (await contract.totalSupply()).toNumber();

      console.log(`${account_two}, ${5}, ${a}, ${b}, ${c}, ${input}`)
      let isCorrect = await contract.mintToken(
        account_two,
        50000,
        a,
        b,
        c,
        input,
        { from: account_one }
      );

      let newTotalSupply = (await contract.totalSupply()).toNumber();

      assert.equal(totalSupply + 1, newTotalSupply, "Invalid proof result");
    });
  });
});