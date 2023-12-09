import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { ExpenseAdded } from "../generated/schema"
import { ExpenseAdded as ExpenseAddedEvent } from "../generated/Contract/Contract"
import { handleExpenseAdded } from "../src/contract"
import { createExpenseAddedEvent } from "./contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let groupId = BigInt.fromI32(234)
    let expenseId = BigInt.fromI32(234)
    let requester = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let amount = BigInt.fromI32(234)
    let description = "Example string value"
    let payers = [
      Address.fromString("0x0000000000000000000000000000000000000001")
    ]
    let share = BigInt.fromI32(234)
    let newExpenseAddedEvent = createExpenseAddedEvent(
      groupId,
      expenseId,
      requester,
      amount,
      description,
      payers,
      share
    )
    handleExpenseAdded(newExpenseAddedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ExpenseAdded created and stored", () => {
    assert.entityCount("ExpenseAdded", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ExpenseAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "groupId",
      "234"
    )
    assert.fieldEquals(
      "ExpenseAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "expenseId",
      "234"
    )
    assert.fieldEquals(
      "ExpenseAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "requester",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ExpenseAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )
    assert.fieldEquals(
      "ExpenseAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "description",
      "Example string value"
    )
    assert.fieldEquals(
      "ExpenseAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "payers",
      "[0x0000000000000000000000000000000000000001]"
    )
    assert.fieldEquals(
      "ExpenseAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "share",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
