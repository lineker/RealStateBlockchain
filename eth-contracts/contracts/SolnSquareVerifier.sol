//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.8;
pragma experimental ABIEncoderV2;
import "./ERC721Mintable.sol";
import "./SquareVerifier.sol";


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721MintableComplete
{

    SquareVerifier private verifierContract;

    constructor(address verifierAddress) ERC721MintableComplete() {
        verifierContract = SquareVerifier(verifierAddress);
    }

// TODO define a solutions struct that can hold an index & an address
struct Solution {
    uint256 index;
    address addr;
}

// TODO define an array of the above struct
Solution[] private _solutions;

// TODO define a mapping to store unique solutions submitted
mapping (bytes32 => Solution) submittedSolutions;


// TODO Create an event to emit when a solution is added
event SolutionAdded(uint256 slnIndex, address indexed slnAddress);

function getVerifierKey(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(a, b, c, input));
    }

// TODO Create a function to add the solutions to the array and emit the event
function addSolution(address _addr, uint256 _index, bytes32 _key) public
{
    Solution memory solution = Solution({index : _index, addr : _addr});
    _solutions.push(solution);
    submittedSolutions[_key] = solution;
    emit SolutionAdded(_index, _addr);
}


// DONE Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
function mintToken(
        address _to,
        uint256 _tokenId,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input
    ) public {
        // hash solution to get key
        bytes32 key = getVerifierKey(a, b, c, input);
        //  - make sure the solution is unique (has not been used before)
        require(submittedSolutions[key].addr == address(0), "Solution is already used.");
        //  verify solution
        Verifier.Proof memory proof = Verifier.Proof(
            Pairing.G1Point(a[0], a[1]),
            Pairing.G2Point(b[0], b[1]),
            Pairing.G1Point(c[0], c[1])
        );
        require(verifierContract.verifyTx(proof, input), "Solution is not correct");

        addSolution(_to, _tokenId, key);
        //  - make sure you handle metadata as well as tokenSuplly
        super.mint(_to, _tokenId);
    }

}
  


























