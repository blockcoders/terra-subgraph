import {
    Approval as ApprovalEvent,
    Burn as BurnEvent,
    OwnershipTransferred as OwnershipTransferredEvent,
    Transfer as TransferEvent
  } from "../../generated/wLuna/wLuna"
  import {
    Approval,
    Burn,
    OwnershipTransferred,
    Transfer
  } from "../../generated/schema"
  
  export function handleApproval(event: ApprovalEvent): void {
    let entity = new Approval(
      event.transaction.hash.toHex() + "-" + event.logIndex.toString()
    )
    entity.owner = event.params.owner
    entity.spender = event.params.spender
    entity.value = event.params.value
    entity.save()
  }
  
  export function handleBurn(event: BurnEvent): void {
    let entity = new Burn(
      event.transaction.hash.toHex() + "-" + event.logIndex.toString()
    )
    entity._sender = event.params._sender
    entity._to = event.params._to
    entity.amount = event.params.amount
    entity.save()
  }
  
  export function handleOwnershipTransferred(
    event: OwnershipTransferredEvent
  ): void {
    let entity = new OwnershipTransferred(
      event.transaction.hash.toHex() + "-" + event.logIndex.toString()
    )
    entity.previousOwner = event.params.previousOwner
    entity.newOwner = event.params.newOwner
    entity.save()
  }
  
  export function handleTransfer(event: TransferEvent): void {
    let entity = new Transfer(
      event.transaction.hash.toHex() + "-" + event.logIndex.toString()
    )
    entity.from = event.params.from
    entity.to = event.params.to
    entity.value = event.params.value
    entity.save()
  }
  
