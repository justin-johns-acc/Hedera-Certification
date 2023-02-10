# Task 4

## Problem
Create a script that creates a scheduled transaction of 2 hbar from
Account1 to Account2.
Make a second script that deletes the transaction.
Print out the schedule information along the way along with the
proof that the transfer did not happen.
Try to execute the transaction and show that it does not work.

## Prerequisite
- using node v18.9.0 (npm v8.19.1)
- make sure task 1 is done and file accounts.json craeted in the same folder
- go to folder (Task_4_Scheduled_Transaction)
- `npm install`

## How to run
run command  `npm run start:createandsubmit` to create a scheduled transaction
run command `npm run start:deleteandsubmit` to delete and try signature submission

## output
**Submit transaction Output**

```
Transaction is encoded
TX 0.0.3425202@1676027857.334223878 status: SUCCESS
The schedule ID is 0.0.3425675
The scheduledId you queried for is:  0.0.3425675
The memo for it is:  This messege submitted at 1676027870254
It got created by:  0.0.3425202
It got payed by:  0.0.3425202
The expiration time of the scheduled tx is:  2023-02-10T11:47:50.000Z
The transaction has not been executed yet.

File created: schedule.jso
```

**Output of delete and execute**


```
working with schedule id: 0.0.3426366

The scheduledId you queried for is:  0.0.3426366
The memo for it is:  This messege submitted at 1676030763237
It got created by:  0.0.3425202
It got payed by:  0.0.3425202
The expiration time of the scheduled tx is:  2023-02-10T12:36:03.000Z
The transaction has not been executed yet.
The transaction consensus status is 22
Scheduled deleted

The transaction errored with message SCHEDULE_ALREADY_DELETED

Error:{"name":"StatusError","status":"SCHEDULE_ALREADY_DELETED","transactionId":"0.0.3425202@1676030760.661458486","message":"receipt for transaction 0.0.3425202@1676030760.661458486 contained error status SCHEDULE_ALREADY_DELETED"}

The scheduledId you queried for is:  0.0.3426366
The memo for it is:  This messege submitted at 1676030763237
It got created by:  0.0.3425202
It got payed by:  0.0.3425202
The expiration time of the scheduled tx is:  2023-02-10T12:36:03.000Z
The transaction has not been executed yet.
```