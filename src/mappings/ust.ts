import {
  Approval as ApprovalEvent,
  Burn as BurnEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Transfer as TransferEvent,
} from '../../generated/wUST/wUST'
import { Approval, Burn, OwnershipTransferred, Transfer, Token, User } from '../../generated/schema'

const UST = "UST"
//const UST_ADDRESS = '0x320bc76961fb4e2a0e2e86d43d4b9d13b4985b8f'
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(event.transaction.hash.toHex())
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.amount = event.params.value
  entity.save()
}

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
  let entity = new OwnershipTransferred(event.transaction.hash.toHex())
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}

const getToken = (tokenName: string): Token => {
  let token = Token.load(tokenName)
  if (!token) {
    token = new Token(tokenName)
  }
  return token
}

export function handleBurn(event: BurnEvent): void {
  const token = getToken(UST)
  const burnAmount = event.params.amount
  //token.amount = token.amount.minus(burnAmount)
  token.totalBurned = token.totalBurned.plus(burnAmount)

  const userId = event.params._sender.toHex()
  
  const burnId = event.transaction.hash.toHex()
  const burn = new Burn(burnId)
  burn.timestamp = event.block.timestamp.toI32()
  burn.burner = userId
  burn.amount = burnAmount
  burn.save()

  let user = User.load(userId)
  if (!user) {
    user = new User(userId)
    token.totalUsersEver = token.totalUsersEver + 1
  }
  user.txCount = user.txCount + 1
  user.save()

  /*let ustUser = User.load(UST_ADDRESS)
  if (ustUser) {
    ustUser.ustBalance = ustUser.ustBalance.minus(burnAmount)
    ustUser.save()
  }*/
  token.save()
}

export function handleTransfer(event: TransferEvent): void {
  const token = getToken(UST)
  const userToId = event.params.to.toHex()
  const userFromId = event.params.from.toHex()
  const transferId = event.transaction.hash.toHex()
  const txAmount = event.params.value

  const transfer = new Transfer(transferId)
  transfer.from = userFromId
  transfer.to = userToId
  transfer.amount = txAmount
  transfer.timestamp = event.block.timestamp.toI32()
  transfer.save()

  /*if (userToId == UST_ADDRESS) { // Mint
    token.amount = token.amount.plus(txAmount)
  }*/

  let userFrom = User.load(userFromId)
  if (!userFrom) {
    userFrom = new User(userFromId)
    token.totalUsersEver = token.totalUsersEver + 1
  }
  if (userFromId != ZERO_ADDRESS) {
    userFrom.ustBalance = userFrom.ustBalance.minus(txAmount)
  }
  userFrom.txCount = userFrom.txCount + 1
  userFrom.save()

  let userTo = User.load(userToId)
  if (!userTo) {
    userTo = new User(userToId)
    token.totalUsersEver = token.totalUsersEver + 1
  }
  if (userToId != ZERO_ADDRESS) {
    userTo.ustBalance = userTo.ustBalance.plus(txAmount)
  }
  userTo.save()

  token.save()
}
