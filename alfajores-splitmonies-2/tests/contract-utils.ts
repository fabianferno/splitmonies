import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ExpenseAdded,
  GroupCreated,
  SplitPaid
} from "../generated/Contract/Contract"

export function createExpenseAddedEvent(
  groupId: BigInt,
  expenseId: BigInt,
  requester: Address,
  amount: BigInt,
  description: string,
  payers: Array<Address>,
  share: BigInt
): ExpenseAdded {
  let expenseAddedEvent = changetype<ExpenseAdded>(newMockEvent())

  expenseAddedEvent.parameters = new Array()

  expenseAddedEvent.parameters.push(
    new ethereum.EventParam(
      "groupId",
      ethereum.Value.fromUnsignedBigInt(groupId)
    )
  )
  expenseAddedEvent.parameters.push(
    new ethereum.EventParam(
      "expenseId",
      ethereum.Value.fromUnsignedBigInt(expenseId)
    )
  )
  expenseAddedEvent.parameters.push(
    new ethereum.EventParam("requester", ethereum.Value.fromAddress(requester))
  )
  expenseAddedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  expenseAddedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  expenseAddedEvent.parameters.push(
    new ethereum.EventParam("payers", ethereum.Value.fromAddressArray(payers))
  )
  expenseAddedEvent.parameters.push(
    new ethereum.EventParam("share", ethereum.Value.fromUnsignedBigInt(share))
  )

  return expenseAddedEvent
}

export function createGroupCreatedEvent(
  groupId: BigInt,
  owner: Address,
  members: Array<Address>,
  groupName: string,
  description: string,
  groupImage: string
): GroupCreated {
  let groupCreatedEvent = changetype<GroupCreated>(newMockEvent())

  groupCreatedEvent.parameters = new Array()

  groupCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "groupId",
      ethereum.Value.fromUnsignedBigInt(groupId)
    )
  )
  groupCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  groupCreatedEvent.parameters.push(
    new ethereum.EventParam("members", ethereum.Value.fromAddressArray(members))
  )
  groupCreatedEvent.parameters.push(
    new ethereum.EventParam("groupName", ethereum.Value.fromString(groupName))
  )
  groupCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  groupCreatedEvent.parameters.push(
    new ethereum.EventParam("groupImage", ethereum.Value.fromString(groupImage))
  )

  return groupCreatedEvent
}

export function createSplitPaidEvent(
  groupId: BigInt,
  expenseId: BigInt,
  payer: Address,
  requester: Address,
  description: string,
  share: BigInt
): SplitPaid {
  let splitPaidEvent = changetype<SplitPaid>(newMockEvent())

  splitPaidEvent.parameters = new Array()

  splitPaidEvent.parameters.push(
    new ethereum.EventParam(
      "groupId",
      ethereum.Value.fromUnsignedBigInt(groupId)
    )
  )
  splitPaidEvent.parameters.push(
    new ethereum.EventParam(
      "expenseId",
      ethereum.Value.fromUnsignedBigInt(expenseId)
    )
  )
  splitPaidEvent.parameters.push(
    new ethereum.EventParam("payer", ethereum.Value.fromAddress(payer))
  )
  splitPaidEvent.parameters.push(
    new ethereum.EventParam("requester", ethereum.Value.fromAddress(requester))
  )
  splitPaidEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  splitPaidEvent.parameters.push(
    new ethereum.EventParam("share", ethereum.Value.fromUnsignedBigInt(share))
  )

  return splitPaidEvent
}
