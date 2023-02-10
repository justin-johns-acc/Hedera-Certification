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
run command  `npm start`

## output
Submit transaction Output

```
Transaction is encoded
TX 0.0.3425202@1676025125.222632583 status: SUCCESS
The schedule ID is 0.0.3425432
The scheduledId you queried for is:  0.0.3425432
The memo for it is:  This messege submitted at 1676025138217
It got created by:  0.0.3425202
It got payed by:  0.0.3425202
The expiration time of the scheduled tx is:  2023-02-10T11:02:18.000Z
The time of execution of the scheduled tx is:  2023-02-10T10:32:18.000Z
```