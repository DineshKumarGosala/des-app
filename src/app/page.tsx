'use client'

import { useState, useEffect } from 'react'
import FirstPage from '../components/FirstPage'
import SecondPage from '../components/SecondPage'

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [studentData, setStudentData] = useState({
    joiningYear: '',
    branch: '',
    year: '',
    section: '',
    registrationNumber: ''
  })

  // Listen for Electron navigation events
  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.onNavigateToHome(() => {
        setCurrentStep(1)
        setStudentData({
          joiningYear: '',
          branch: '',
          year: '',
          section: '',
          registrationNumber: ''
        })
      })
    }
  }, [])

  const handleStepComplete = (data: any) => {
    setStudentData(data)
    setCurrentStep(2)
  }

  const handleBackToFirstPage = () => {
    setCurrentStep(1)
  }

  const handleFeedbackComplete = async () => {
    // Show success message
    if (typeof window !== 'undefined' && window.electronAPI) {
      await window.electronAPI.showInfoDialog(
        'Success',
        'Your feedback has been submitted successfully!'
      )
    }
    
    // Reset to first page
    setCurrentStep(1)
    setStudentData({
      joiningYear: '',
      branch: '',
      year: '',
      section: '',
      registrationNumber: ''
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className={`progress-step ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : 'inactive'}`}>
              1
            </div>
            <span className="font-medium text-gray-700">Student Information</span>
          </div>
          
          <div className={`h-0.5 w-20 ${currentStep > 1 ? 'bg-success-500' : 'bg-gray-300'}`} />
          
          <div className="flex items-center space-x-3">
            <div className={`progress-step ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : 'inactive'}`}>
              2
            </div>
            <span className="font-medium text-gray-700">Feedback Collection</span>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="card animate-fade-in">
        {currentStep === 1 ? (
          <FirstPage onComplete={handleStepComplete} />
        ) : (
          <SecondPage 
            studentData={studentData}
            onBack={handleBackToFirstPage}
            onComplete={handleFeedbackComplete}
          />
        )}
      </div>
    </div>
  )
}
