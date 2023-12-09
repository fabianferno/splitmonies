import { Bytes } from "@graphprotocol/graph-ts"
import {
  ExpenseAdded as ExpenseAddedEvent,
  GroupCreated as GroupCreatedEvent,
  SplitPaid as SplitPaidEvent
} from "../generated/Contract/Contract"
import { ExpenseAdded, GroupCreated, SplitPaid } from "../generated/schema"

export function handleExpenseAdded(event: ExpenseAddedEvent): void {
  let entity = new ExpenseAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.groupId = event.params.groupId
  entity.expenseId = event.params.expenseId
  entity.requester = event.params.requester
  entity.amount = event.params.amount
  entity.description = event.params.description
  entity.payers = changetype<Bytes[]>(event.params.payers)
  entity.share = event.params.share

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleGroupCreated(event: GroupCreatedEvent): void {
  let entity = new GroupCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.groupId = event.params.groupId
  entity.owner = event.params.owner
  entity.members = changetype<Bytes[]>(event.params.members)
  entity.groupName = event.params.groupName
  entity.description = event.params.description
  entity.groupImage = event.params.groupImage

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSplitPaid(event: SplitPaidEvent): void {
  let entity = new SplitPaid(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.groupId = event.params.groupId
  entity.expenseId = event.params.expenseId
  entity.payer = event.params.payer
  entity.requester = event.params.requester
  entity.description = event.params.description
  entity.share = event.params.share

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
