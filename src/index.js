import { authenticateUser } from './services/auth.js'
import { fetchClients, fetchStatuses } from './services/client.js'
import { exportToGoogleSheet } from './services/googleSheet.js'
import { handleError } from './helpers/error.js'
import getEnv from './helpers/getEnv.js'


(async () => {
    try {
        const USERNAME = getEnv('USERNAME')
        const LIMIT = parseInt(getEnv('LIMIT', 1000), 10)
        let OFFSET = 0

        const token = await authenticateUser(USERNAME)

        let isFirstBatch = true
        while (true) {
            const clients = await fetchClients(token, LIMIT, OFFSET)
            if (!clients.length) break

            const userIds = clients.map(client => client.id)
            const statuses = await fetchStatuses(token, userIds)

            const clientData = clients.map(client => ({
                ...client,
                status: statuses.find(status => status.id === client.id)?.status || 'Unknown',
            }))

            await exportToGoogleSheet(clientData, isFirstBatch)

            isFirstBatch = false
            OFFSET += LIMIT
        }
    } catch (error) {
        handleError(error)
    }
})()
