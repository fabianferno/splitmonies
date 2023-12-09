// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// import "./SMToken.sol";

contract SplitMoney {
    // SMToken public smToken;
    IERC20 public celoUsd;

    using Counters for Counters.Counter;

    Counters.Counter public _groupCounter;

    constructor(address tokenAddress) {
        celoUsd = IERC20(tokenAddress);
    }

    struct Expense {
        uint256 groupId;
        address requester;
        address[] payers;
        uint256 amount;
        string description;
        uint256 share;
    }

    struct Group {
        address[] members;
        string groupName;
        string description;
        string groupImage;
        mapping(address => bool) isMember;
    }

    struct MyGroups {
        uint256 groupId;
        string groupName;
        string description;
        string groupImage;
        address[] members;
    }

    struct ViewPendingPayments {
        uint256 groupId;
        uint256 expenseIndex;
        address requester;
        uint256 amount;
        string description;
    }

    Expense[] public expenses;

    mapping(uint256 => Group) private GroupListing;
    mapping(address => mapping(uint256 => bool)) public isPaid;

    event GroupCreated(
        uint256 groupId,
        address owner,
        address[] members,
        string groupName,
        string description,
        string groupImage
    );
    event ExpenseAdded(
        uint256 groupId,
        uint256 expenseId,
        address requester,
        uint256 amount,
        string description,
        address[] payers,
        uint256 share
    );
    event SplitPaid(uint256 groupId, uint256 expenseId, address payer, address requester, string description, uint256 share);

    //Create Group
    function createGroup(
        address[] memory _members,
        string memory _groupName,
        string memory _description,
        string memory _groupImage
    ) public {
        //must contain atleast 2 members in a group
        require(_members.length > 1, "At least two members is required");

        _groupCounter.increment();
        uint256 uid = _groupCounter.current();

        GroupListing[uid].members = _members;
        GroupListing[uid].groupName = _groupName;
        GroupListing[uid].description = _description;
        GroupListing[uid].groupImage = _groupImage;

        for (uint256 i = 0; i < _members.length; i++) {
            GroupListing[uid].isMember[_members[i]] = true;
        }

        emit GroupCreated(uid,msg.sender, _members, _groupName, _description, _groupImage);
    }

    function getGroupDetails(uint256 _groupId) public view returns (MyGroups memory) {
        return
            MyGroups(
                _groupId,
                GroupListing[_groupId].groupName,
                GroupListing[_groupId].description,
                GroupListing[_groupId].groupImage,
                GroupListing[_groupId].members
            );
    }

    function getMyGroups() public view returns (MyGroups[] memory) {
        address requester = msg.sender;

        uint256 index = 0;

        for (uint256 i = 1; i <= _groupCounter.current(); i++) {
            if (GroupListing[i].isMember[requester] == true) {
                index++;
            }
        }

        MyGroups[] memory myGroupsArray = new MyGroups[](index);

        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= _groupCounter.current(); i++) {
            if (GroupListing[i].isMember[requester] == true) {
                myGroupsArray[currentIndex] = MyGroups(
                    i,
                    GroupListing[i].groupName,
                    GroupListing[i].description,
                    GroupListing[i].groupImage,
                    GroupListing[i].members
                );
            }
            currentIndex++;
        }
        return myGroupsArray;
    }

    function addExpense(uint256 _groupId, uint256 _amount, string memory _description) external {
        require(_groupId != 0, "Group ID cannot be zero");
        require(_amount > 0, "Amount must be greater than 0");

        uint256 membersCount = (GroupListing[_groupId].members).length;
        address[] memory members = GroupListing[_groupId].members;

        uint256 splitAmount = _amount / membersCount;

        expenses.push(Expense(_groupId, msg.sender, members, _amount, _description, splitAmount));

        for (uint256 i = 0; i < membersCount; i++) {
            if (members[i] == expenses[expenses.length - 1].requester) {
                isPaid[members[i]][expenses.length - 1] = true;
            } else {
                isPaid[members[i]][expenses.length - 1] = false;
            }
        }

        emit ExpenseAdded(
            _groupId,
            expenses.length - 1,
            msg.sender,
            _amount,
            _description,
            members,
            splitAmount
        );
    }

    function viewSplits() public view returns (ViewPendingPayments[] memory) {
        address requester = msg.sender;

        uint256 pendingCount = 0;

        for (uint256 i = 0; i < expenses.length; i++) {
            if (isPaid[requester][i] == false) {
                pendingCount++;
            }
        }

        ViewPendingPayments[] memory userPayments = new ViewPendingPayments[](pendingCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < expenses.length; i++) {
            if (isPaid[requester][i] == false) {
                userPayments[currentIndex] = ViewPendingPayments(
                    expenses[i].groupId,
                    i,
                    expenses[i].requester,
                    expenses[i].share,
                    expenses[i].description
                );
                currentIndex++;
            }
        }

        return userPayments;
    }

    function getGroupExpenses(uint256 _groupId) public view returns (Expense[] memory) {
        uint256 index = 0;

        for (uint256 i = 0; i < expenses.length; i++) {
            if (_groupId == expenses[i].groupId) {
                index++;
            }
        }

        Expense[] memory groupExpenses = new Expense[](index);

        uint256 currentIndex = 0;

        for (uint256 i = 0; i < expenses.length; i++) {
            if (_groupId == expenses[i].groupId) {
                groupExpenses[currentIndex] = Expense(
                    expenses[i].groupId,
                    expenses[i].requester,
                    expenses[i].payers,
                    expenses[i].amount,
                    expenses[i].description,
                    expenses[i].share
                );
                currentIndex++;
            }
        }

        return groupExpenses;
    }

    function paySplit(uint256 expenseId) public payable {
        //check if expense ID is valid
        require(expenseId < expenses.length, "Invalid expense id");
        //check if user hasn't paid already
        require(isPaid[msg.sender][expenseId] == false, "Already Paid");
        //check balance
        require(
            celoUsd.balanceOf(msg.sender) >= expenses[expenseId].share,
            "Insufficient Balance"
        );

        celoUsd.transferFrom(msg.sender, expenses[expenseId].requester, expenses[expenseId].share);

        isPaid[msg.sender][expenseId] = true;

        emit SplitPaid(expenses[expenseId].groupId, expenseId, msg.sender, expenses[expenseId].requester, expenses[expenseId].description, expenses[expenseId].share);
    }
}
