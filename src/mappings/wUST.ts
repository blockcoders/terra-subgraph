import {
  Approval as ApprovalEvent,
  Burn as BurnEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Transfer as TransferEvent,
} from '../../generated/wUST/wUST'
import { Approval, Burn, OwnershipTransferred, Transfer, Token, User } from '../../generated/schema'

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(event.transaction.hash.toHex() + '-' + event.logIndex.toString())
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.save()
}

export function handleBurn(event: BurnEvent): void {
  const id = 'UST'
  let wUST = Token.load(id)
  if(!wUST) {
    wUST = new Token(id)
  }
  wUST.amount = wUST.amount.minus(event.params.amount)
  wUST.totalBurned = wUST.totalBurned.plus(event.params.amount)

  const userId = event.params._sender.toHex()
  let user = User.load(userId)
  if(!user) {
    user = new User(userId)
  }
  user.wUSTBalance = user.wUSTBalance.minus(event.params.amount)
  user.txCount = user.txCount + 1

  const burnId = event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  const burn = new Burn(burnId)
  burn.timestamp = event.block.timestamp.toI32()
  burn.burner = user
  burn.amount = event.params.amount

  wUST.save()
  user.save()
  burn.save()
}

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
  let entity = new OwnershipTransferred(event.transaction.hash.toHex() + '-' + event.logIndex.toString())
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  const id = 'UST'
  let wUST = Token.load(id)
  if(!wUST) {
    wUST = new Token(id)
  }

  const userToId = event.params.to.toHex()
  let userTo = User.load(userToId)
  if (!userTo) {
    userTo = new User(userToId)
    userTo.transferFrom = []
    userTo.transfersTo = []
    userTo.burns = []
    wUST.totalUsersEver = wUST.totalUsersEver + 1
  }
  userTo.wUSTBalance = userTo.wUSTBalance.plus(event.params.value)

  const userFromId = event.params.from.toHex()
  let userFrom = User.load(userFromId)
  if (!userFrom) {
    userFrom = new User(userFromId)
    userFrom.transferFrom = []
    userFrom.transfersTo = []
    userFrom.burns = []
    wUST.totalUsersEver = wUST.totalUsersEver + 1
  }
  userFrom.wUSTBalance = userFrom.wUSTBalance.minus(event.params.value)
  userFrom.txCount = userFrom.txCount + 1

  const transferd = event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  const transfer = new Transfer(transferd)
  transfer.from = userFrom
  transfer.to = userTo
  transfer.amount = event.params.value
  transfer.timestamp = event.block.timestamp.toI32()

  transfer.save()
  wUST.save()
  userTo.save()
  userFrom.save()
}