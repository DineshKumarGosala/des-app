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
    const studentData = await request.json()

    // Get data from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Admin Config!A:Z',
    })

    const rows = response.data.values
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 })
    }

    // Parse headers and data
    const headers = rows[0]
    const data = rows.slice(1).map(row => {
      const obj: { [key: string]: string } = {}
      headers.forEach((header, index) => {
        obj[header] = row[index] || ''
      })
      return obj
    })

    // Filter data for the specific student
    const filteredData = data.filter(row => 
      row.JoiningYear === studentData.joiningYear &&
      row.Branch === studentData.branch &&
      row.Year === studentData.year &&
      row.Section === studentData.section
    )

    if (filteredData.length === 0) {
      return NextResponse.json({ 
        subjects: [],
        questions: []
      })
    }

    // Extract question columns - these are columns after the basic info columns
    // Include ANY column that's not in the basic info columns
    const basicColumns = ['JoiningYear', 'Branch', 'Year', 'Section', 'Subject', 'Teacher']
    const questionColumns = headers.filter(header => {
      const cleanHeader = header.trim()
      return !basicColumns.includes(cleanHeader) && 
             cleanHeader !== '' &&
             cleanHeader.length > 0
    })
    
    // Get questions from the headers themselves (since the questions are the column names)
    const questions = questionColumns.filter(Boolean)
    
    console.log('ALL Headers found:', headers)
    console.log('Basic columns:', basicColumns)
    console.log('Question columns found:', questionColumns)
    console.log('Final questions extracted:', questions)

    // Group by subject and teacher
    const subjectMap = new Map()
    
    filteredData.forEach(row => {
      const key = `${row.Subject}|${row.Teacher}`
      if (!subjectMap.has(key)) {
        subjectMap.set(key, {
          subject: row.Subject,
          teacher: row.Teacher,
          questions: questions
        })
      }
    })

    const subjects = Array.from(subjectMap.values())

    return NextResponse.json({
      subjects,
      questions
    })
  } catch (error) {
    console.error('Error in admin-config:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin configuration' },
      { status: 500 }
    )
  }
}
