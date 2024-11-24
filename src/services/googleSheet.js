import { google } from 'googleapis'
import getEnv from '../helpers/getEnv.js'


const GOOGLE_SERVICE_ACCOUNT_KEY = getEnv("GOOGLE_SERVICE_ACCOUNT_KEY")
const SHEET_ID = getEnv("SHEET_ID")
const LIST_NAME = getEnv("LIST_NAME")

export const exportToGoogleSheet = async (data, isHeaderNeeded = false) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: GOOGLE_SERVICE_ACCOUNT_KEY,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth });

    let rows = data.map(client => [
        client.id,
        client.firstName,
        client.lastName,
        client.gender,
        client.address,
        client.city,
        client.phone,
        client.email,
        client.status,
    ])

    if (isHeaderNeeded) {
        await sheets.spreadsheets.values.clear({
            spreadsheetId: SHEET_ID,
            range: `${LIST_NAME}`,
        })
        console.log('Таблица очищена от данных.')

        rows = [['ID', 'First Name', 'Last Name', 'Gender', 'Address', 'City', 'Phone', 'Email', 'Status'], ...rows]
    }

    await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: `${LIST_NAME}!A1`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
            values: rows,
        },
    })

    console.log('Батч данных экспортирован в Таблицу.')
}
