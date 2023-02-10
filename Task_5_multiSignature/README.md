# Task 5

## Problem
Create a scheduled transaction with a key list with 3 key
(Account1, Account2 and Account3) that requires 2 of the three
keys.
Sign the transaction with Account1. Get the information of the
transaction and show that it has not yet been executed.
Sign the transaction with Account2 and get the information again
to show that it has been executed.

## Prerequisite
- using node v18.9.0 (npm v8.19.1)
- go to folder (Task_5_multiSignature)
- `npm install`

## How to run
run command  `npm start`

## output
```
Key list created

 

The Multi Signature Account ID is: 0.0.3425971 


Scheduling Hbar Transfer
The transaction status is SUCCESS
The schedule ID is 0.0.3425974


Scheduled Transaction Info -
ScheduleId : 0.0.3425974
Memo :  
Created by :  0.0.3425211
Payed by :  0.0.3425211
Expiration time :  2023-02-10T12:22:53.000Z
The transaction has not been executed yet.

Submitting first signature
Submitting Signature to Schedule Transaction 0.0.3425974 status is SUCCESS


Scheduled Transaction Info -
ScheduleId : 0.0.3425974
Memo :  
Created by :  0.0.3425211
Payed by :  0.0.3425211
Expiration time :  2023-02-10T12:22:53.000Z
The transaction has not been executed yet.

Submitting second signature
Submitting Signature to Schedule Transaction 0.0.3425974 status is SUCCESS


Scheduled Transaction Info -
ScheduleId : 0.0.3425974
Memo :  
Created by :  0.0.3425211
Payed by :  0.0.3425211
Expiration time :  2023-02-10T12:22:53.000Z
The transaction has been executed.
Time of execution :  2023-02-10T11:52:58.000Z
```