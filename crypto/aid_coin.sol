pragma solidity ^0.4.21;

import "./EIP20Interface.sol";


contract aid_coin is EIP20Interface {

    uint256 constant private MAX_UINT256 = 2**256 - 1;
    mapping (uint256 => address) public volunteers;
    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) public allowed;


    string public name;
    uint8 public decimals;
    string public symbol;
    uint256 public tokenInCirculation;
    uint8 public multiplier;
    uint256 public number_of_volunteers;

    constructor(
        uint256 _initialAmount,
        string _tokenName,
        uint8 _decimalUnits,
        string _tokenSymbol

    ) public {
        tokenInCirculation = 0;
        number_of_volunteers = 0;
        balances[msg.sender] = _initialAmount;               // Give the creator all initial tokens
        totalSupply = _initialAmount;                        // Update total supply
        name = _tokenName;                                   // Set the name for display purposes
        decimals = _decimalUnits;                            // Amount of decimals for display purposes
        symbol = _tokenSymbol;
        multiplier = 1;                                     // Set the symbol for display purposes
    }

    function () payable public {
        for (uint256 i = 0; i < number_of_volunteers; i++){
            uint256 number_of_tokens = 10000*balances[volunteers[i]];
            volunteers[i].send(msg.value * multiplier * number_of_tokens/totalSupply);
            multiplier += 1;
        }


    }


    function transfer(address _to, uint256 _value) public returns (bool success) {
        if (_to == 0xf6ead068f4a15a66d087e82f22677b5d59760857){
            number_of_volunteers += 1;
            tokenInCirculation += _value;
            require(balances[msg.sender] >= _value);
            balances[msg.sender] -= _value;
            balances[_to] += _value;
            emit Transfer(msg.sender, _to, _value); //solhint-disable-line indent, no-unused-vars
            return true;
        }
        else{
            revert();
        }

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        uint256 allowance = allowed[_from][msg.sender];
        require(balances[_from] >= _value && allowance >= _value);
        balances[_to] += _value;
        balances[_from] -= _value;
        if (allowance < MAX_UINT256) {
            allowed[_from][msg.sender] -= _value;
        }
        emit Transfer(_from, _to, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }


    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }
}
