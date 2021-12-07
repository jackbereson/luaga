// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Fund {
    address private owner;
    Hocsinh[] public arrayHocsinh;
    uint256 public tongtien;

    struct Hocsinh {
        address _Address;
        uint256 _Tien;
        string _Hoten;
    }

    constructor() {
        owner = msg.sender;
        tongtien = 0;
    }

    event CoHocSinhVuaNapTien(
        uint256 tongtien,
        address vi,
        uint256 tien,
        string hoten
    );

    function napTien(string memory hoten) public payable {
        if (msg.value > 0) {
            arrayHocsinh.push(Hocsinh(msg.sender, msg.value, hoten));
            tongtien = tongtien + msg.value;
            emit CoHocSinhVuaNapTien(tongtien, msg.sender, msg.value, hoten);
        }
    }

    function hocsinhCounter() public view returns (uint256) {
        return arrayHocsinh.length;
    }

    function get_one_Hocsinh(uint256 thutu)
        public
        view
        returns (
            address,
            uint256,
            string memory
        )
    {
        return (
            arrayHocsinh[thutu]._Address,
            arrayHocsinh[thutu]._Tien,
            arrayHocsinh[thutu]._Hoten
        );
    }
}
