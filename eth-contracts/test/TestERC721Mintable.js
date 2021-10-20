var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    let contract;

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens

            await contract.mint(account_one, 1, { from: account_one });
            await contract.mint(account_one, 2, { from: account_one });
            await contract.mint(account_one, 3, { from: account_one });
            await contract.mint(account_two, 4, { from: account_one });
        })

        it('should return total supply', async function () { 
            let totalSupply = await contract.totalSupply();
            assert.equal(totalSupply, 4, "Invalid total supply");
        })

        it('should get token balance', async function () { 
            let balance = await contract.balanceOf.call(account_one, {
                from: account_one,
              });
              assert.equal(balance, 3, "Invalid balance, should be 3");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenId = 1;
            let expectedURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/" + tokenId;
            let tokenURI = await contract.tokenURI(tokenId);
            assert.equal(tokenURI, expectedURI, "Invalid token URI returned.");
        })

        it('should transfer token from one owner to another', async function () { 
            let targetTokenId = 2;
            await contract.transferFrom(account_one, account_two, targetTokenId, {
                from: account_one,
            });
            let newOwner = await contract.ownerOf(targetTokenId);

            assert.equal(account_two, newOwner, "Ownership didn't transfer.");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let requestFailed = false;
            try {
                await contract.mint(account_two, 5, { from: account_two });
            } catch (err) {
                requestFailed = true;
            }

            assert.equal(requestFailed, true, "Mint operation succeded but it should have failed");
        })

        it('should return contract owner', async function () { 
            let owner = await contract.owner.call();
            assert(account_one, owner, "Invalid owner returned.");
        })

    });
})