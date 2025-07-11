'use client'

import { useState, useEffect, useCallback } from 'react'
import { StudentData, AdminConfig, FeedbackResponse } from '../lib/types'

interface SecondPageProps {
  studentData: StudentData;
  onBack: () => void;
  onComplete: () => void;
}

export default function SecondPage({ studentData, onBack, onComplete }: SecondPageProps) {
  const [config, setConfig] = useState<AdminConfig | null>(null)
  const [responses, setResponses] = useState<FeedbackResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Load admin config for the student
  const loadAdminConfig = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      })

      if (response.ok) {
        const configData = await response.json()
        setConfig(configData)
        
        // Initialize responses array
        const initialResponses: FeedbackResponse[] = configData.subjects.map((subject: any) => ({
          subject: subject.subject,
          teacher: subject.teacher,
          ratings: {}
        }))
        setResponses(initialResponses)
      } else {
        throw new Error('Failed to load configuration')
      }
    } catch (error) {
      console.error('Error loading config:', error)
      if (typeof window !== 'undefined' && window.electronAPI) {
        window.electronAPI.showErrorDialog(
          'Error',
          'Failed to load feedback configuration. Please go back and try again.'
        )
      }
    } finally {
      setLoading(false)
    }
  }, [studentData])

  // Load admin config when component mounts
  useEffect(() => {
    loadAdminConfig()
  }, [loadAdminConfig])

  const handleRatingChange = (subjectIndex: number, questionIndex: number, rating: number) => {
    setResponses(prev => {
      const newResponses = [...prev]
      newResponses[subjectIndex] = {
        ...newResponses[subjectIndex],
        ratings: {
          ...newResponses[subjectIndex].ratings,
          [questionIndex]: rating
        }
      }
      return newResponses
    })

    // Clear error for this field
    const errorKey = `${subjectIndex}-${questionIndex}`
    setErrors(prev => ({ ...prev, [errorKey]: '' }))
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (config) {
      responses.forEach((response, subjectIndex) => {
        config.subjects[subjectIndex].questions.forEach((_, questionIndex) => {
          const rating = response.ratings[questionIndex]
          if (!rating || rating < 1 || rating > 10) {
            const errorKey = `${subjectIndex}-${questionIndex}`
            newErrors[errorKey] = 'Please provide a rating between 1-10'
          }
        })
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      if (typeof window !== 'undefined' && window.electronAPI) {
        window.electronAPI.showErrorDialog(
          'Validation Error',
          'Please provide ratings for all questions before submitting.'
        )
      }
      return
    }

    try {
      setSubmitting(true)
      
      const submissionData = {
        studentData,
        responses,
        submissionTime: new Date().toISOString()
      }

      const response = await fetch('/api/submit-enhanced-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      })

      if (response.ok) {
        onComplete()
      } else {
        throw new Error('Failed to submit feedback')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      if (typeof window !== 'undefined' && window.electronAPI) {
        window.electronAPI.showErrorDialog(
          'Submission Error',
          'Failed to submit your feedback. Please try again.'
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-600">Loading feedback configuration...</p>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Configuration Not Found</h3>
        <p className="text-gray-600 mb-4">
          No subjects found for your selection. Please go back and verify your information.
        </p>
        <button onClick={onBack} className="btn-secondary">
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Header with Registration Number */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Feedback Form</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <div className="text-blue-800">
                  <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">Registration Number: {studentData.registrationNumber}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600">
              Please rate each teacher for all questions below (1 = Poor, 10 = Excellent)
            </p>
          </div>
          <button onClick={onBack} className="btn-secondary">
            Back
          </button>
        </div>
        
        {/* Student Info Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mt-4">
          <h3 className="font-medium text-gray-900 mb-2">Student Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Joining Year:</span>
              <span className="ml-1 font-medium">{studentData.joiningYear}</span>
            </div>
            <div>
              <span className="text-gray-500">Branch:</span>
              <span className="ml-1 font-medium">{studentData.branch}</span>
            </div>
            <div>
              <span className="text-gray-500">Academic Year:</span>
              <span className="ml-1 font-medium">{studentData.year}</span>
            </div>
            <div>
              <span className="text-gray-500">Section:</span>
              <span className="ml-1 font-medium">{studentData.section}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Forms */}
      <div className="space-y-8">
        {config.subjects.map((subjectData, subjectIndex) => (
          <div key={`${subjectData.subject}-${subjectData.teacher}`} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{subjectData.subject}</h3>
              <p className="text-gray-600 font-medium">Teacher: {subjectData.teacher}</p>
            </div>
            
            {/* Questions Section */}
            <div className="space-y-6">
              {subjectData.questions && subjectData.questions.length > 0 ? (
                subjectData.questions.map((question, questionIndex) => {
                  const errorKey = `${subjectIndex}-${questionIndex}`
                  const currentRating = responses[subjectIndex]?.ratings[questionIndex]
                  
                  return (
                    <div key={questionIndex} className="border-l-4 border-blue-200 pl-4">
                      <label className="block text-sm font-medium text-gray-800 mb-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold mr-2">
                          Q{questionIndex + 1}
                        </span>
                        {question}
                      </label>
                      
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => handleRatingChange(subjectIndex, questionIndex, rating)}
                            className={`rating-button ${currentRating === rating ? 'selected' : ''}`}
                          >
                            {rating}
                          </button>
                        ))}
                      </div>
                      
                      {errors[errorKey] && (
                        <p className="text-red-500 text-sm mt-2 font-medium">{errors[errorKey]}</p>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-yellow-600 mb-2">
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <p className="text-yellow-800 font-medium">
                    No feedback questions found for this subject
                  </p>
                  <p className="text-yellow-600 text-sm mt-1">
                    Please check your Google Sheets configuration
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-success flex items-center space-x-2"
        >
          {submitting && <div className="spinner" />}
          <span>{submitting ? 'Submitting...' : 'Submit Feedback'}</span>
        </button>
      </div>
    </div>
  )
}
