const cron = require('node-cron');
const FutureTransfer = require('../models/FutureTransfer');

//Run every minute
cron.schedule('* * * * *', async () => {
    try {
        const now = new Date();

        const pendingTransfers = await FutureTransfer.findAll({
            where: {
                status: 'pending'
            }
        });
        for (const transfer of pendingTransfers) {
            if (new Date(transfer.executionDate)<= now) {
                transfer.status = 'completed';
                await transfer.save();
            }
        }
        console.log('Transfer job executed');
    } catch (error) {
        console.log('Error in transfer job:', error);
    }
});