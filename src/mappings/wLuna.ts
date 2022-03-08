import {
  Approval as ApprovalEvent,
  Burn as BurnEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Transfer as TransferEvent,
} from '../../generated/wLuna/wLuna'
import { Approval, Burn, OwnershipTransferred, Transfer, Token, User } from '../../generated/schema'

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(event.transaction.hash.toHex() + '-' + event.logIndex.toString())
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.save()
}

export function handleBurn(event: BurnEvent): void {
  const id = 'LUNA'
  let wLuna = Token.load(id)
  if(!wLuna) {
    wLuna = new Token(id)
  }
  wLuna.amount = wLuna.amount.minus(event.params.amount)
  wLuna.totalBurned = wLuna.totalBurned.plus(event.params.amount)

  const userId = event.params._sender.toHex()
  let user = User.load(userId)
  if(!user) {
    user = new User(userId)
  }
  user.wLunaBalance = user.wLunaBalance.minus(event.params.amount)
  user.txCount = user.txCount + 1

  const burnId = event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  const burn = new Burn(burnId)
  burn.timestamp = event.block.timestamp.toI32()
  burn.burner = userId
  burn.amount = event.params.amount

  wLuna.save()
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
  const id = 'LUNA'
  let wLuna = Token.load(id)
  if(!wLuna) {
    wLuna = new Token(id)
  }

  const userToId = event.params.to.toHex()
  let userTo = User.load(userToId)
  if (!userTo) {
    userTo = new User(userToId)
    userTo.transferFrom = []
    userTo.transfersTo = []
    userTo.burns = []
    wLuna.totalUsersEver = wLuna.totalUsersEver + 1
  }
  userTo.wLunaBalance = userTo.wLunaBalance.plus(event.params.value)

  const userFromId = event.params.from.toHex()
  let userFrom = User.load(userFromId)
  if (!userFrom) {
    userFrom = new User(userFromId)
    userFrom.transferFrom = []
    userFrom.transfersTo = []
    userFrom.burns = []
    wLuna.totalUsersEver = wLuna.totalUsersEver + 1
  }
  userFrom.wLunaBalance = userFrom.wLunaBalance.minus(event.params.value)
  userFrom.txCount = userFrom.txCount + 1

  const transferd = event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  const transfer = new Transfer(transferd)
  transfer.from = userFromId
  transfer.to = userToId
  transfer.amount = event.params.value
  transfer.timestamp = event.block.timestamp.toI32()

  transfer.save()
  wLuna.save()
  userTo.save()
  userFrom.save()
}