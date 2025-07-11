import { NextRequest, NextResponse } from 'next/server'
import { GoogleAuth } from 'google-auth-library'
import { google } from 'googleapis'

// Google Sheets configuration
const auth = new GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const sheets = google.sheets({ version: 'v4', auth })
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID

export async function POST(request: NextRequest) {
  try {
    const submissionData = await request.json()
    const { studentData, responses, submissionTime } = submissionData

    // Create sheet name with format: date_joiningdate_branch_year_section
    const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '') // YYYYMMDD format
    const joiningYear = studentData.joiningYear.replace(/\s+/g, '') // Remove spaces
    const branch = studentData.branch.replace(/\s+/g, '') // Remove spaces
    const year = studentData.year.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '') // Remove spaces and special chars
    const section = studentData.section.replace(/\s+/g, '') // Remove spaces
    
    const sheetName = `${currentDate}_${joiningYear}_${branch}_${year}_${section}`
    console.log('Generated sheet name:', sheetName)

    // Prepare data for Google Sheets
    const submissionRows: string[][] = []

    // Add header row if this is the first submission
    const headerRow = [
      'Submission Time',
      'Joining Year',
      'Branch',
      'Academic Year',
      'Section',
      'Registration Number',
      'Subject',
      'Teacher',
      'Question',
      'Rating'
    ]

    // Create rows for each response
    responses.forEach((response: any) => {
      Object.entries(response.ratings).forEach(([questionIndex, rating]) => {
        const row = [
          submissionTime,
          studentData.joiningYear,
          studentData.branch,
          studentData.year,
          studentData.section,
          studentData.registrationNumber,
          response.subject,
          response.teacher,
          `Question ${parseInt(questionIndex) + 1}`,
          rating
        ]
        submissionRows.push(row)
      })
    })

    // Check if the dynamic sheet exists, create if not
    try {
      await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A1:J1`,
      })
      console.log(`Sheet "${sheetName}" already exists`)
    } catch (error) {
      // Sheet doesn't exist, create it
      console.log(`Creating new sheet: "${sheetName}"`)
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                },
              },
            },
          ],
        },
      })

      // Add header row
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A1:J1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [headerRow],
        },
      })
      console.log(`Header row added to sheet: "${sheetName}"`)
    }

    // Append the feedback data
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:J`,
      valueInputOption: 'RAW',
      requestBody: {
        values: submissionRows,
      },
    })

    return NextResponse.json({ 
      success: true,
      message: 'Feedback submitted successfully',
      sheetName: sheetName,
      rowsAdded: submissionRows.length
    })
  } catch (error) {
    console.error('Error in submit-enhanced-feedback:', error)
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}
