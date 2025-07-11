import { NextRequest, NextResponse } from 'next/server'
import { GoogleAuth } from 'google-auth-library'
import { google } from 'googleapis'

// Google Sheets configuration
const auth = new GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
})

const sheets = google.sheets({ version: 'v4', auth })
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID

export async function POST(request: NextRequest) {
  try {
    const currentSelections = await request.json()

    // Get data from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Admin Config!A:Z', // Adjust range as needed
    })

    const rows = response.data.values
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 })
    }

    // Assume first row contains headers
    const headers = rows[0]
    const data = rows.slice(1).map(row => {
      const obj: { [key: string]: string } = {}
      headers.forEach((header, index) => {
        obj[header] = row[index] || ''
      })
      return obj
    })

    // Filter data based on current selections
    let filteredData = data

    if (currentSelections.joiningYear) {
      filteredData = filteredData.filter(row => row.JoiningYear === currentSelections.joiningYear)
    }
    if (currentSelections.branch) {
      filteredData = filteredData.filter(row => row.Branch === currentSelections.branch)
    }
    if (currentSelections.year) {
      filteredData = filteredData.filter(row => row.Year === currentSelections.year)
    }

    // Extract unique options
    const result = {
      joiningYears: [...new Set(data.map(row => row.JoiningYear).filter(Boolean))].sort(),
      branches: [...new Set(filteredData.map(row => row.Branch).filter(Boolean))].sort(),
      years: [...new Set(filteredData.map(row => row.Year).filter(Boolean))].sort(),
      sections: [...new Set(filteredData.map(row => row.Section).filter(Boolean))].sort(),
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in get-filtered-options:', error)
    return NextResponse.json(
      { error: 'Failed to fetch filtered options' },
      { status: 500 }
    )
  }
}
