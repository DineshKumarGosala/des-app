'use client'

import { useState, useEffect } from 'react'
import { StudentData, FilteredOptions } from '../lib/types'

interface FirstPageProps {
  onComplete: (data: StudentData) => void;
}

export default function FirstPage({ onComplete }: FirstPageProps) {
  const [formData, setFormData] = useState<StudentData>({
    joiningYear: '',
    branch: '',
    year: '',
    section: '',
    registrationNumber: ''
  })

  const [options, setOptions] = useState<FilteredOptions>({
    joiningYears: [],
    branches: [],
    years: [],
    sections: []
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Load initial joining years
  useEffect(() => {
    loadFilteredOptions({})
  }, [])

  const loadFilteredOptions = async (currentSelections: Partial<StudentData>) => {
    try {
      setLoading(true)
      const response = await fetch('/api/get-filtered-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentSelections)
      })

      if (response.ok) {
        const data = await response.json()
        setOptions(data)
      } else {
        throw new Error('Failed to load options')
      }
    } catch (error) {
      console.error('Error loading options:', error)
      if (typeof window !== 'undefined' && window.electronAPI) {
        window.electronAPI.showErrorDialog(
          'Error',
          'Failed to load dropdown options. Please check your internet connection.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = async (field: keyof StudentData, value: string) => {
    const newFormData = { ...formData, [field]: value }
    
    // Clear dependent fields when parent field changes
    if (field === 'joiningYear') {
      newFormData.branch = ''
      newFormData.year = ''
      newFormData.section = ''
    } else if (field === 'branch') {
      newFormData.year = ''
      newFormData.section = ''
    } else if (field === 'year') {
      newFormData.section = ''
    }

    setFormData(newFormData)
    
    // Clear errors
    setErrors(prev => ({ ...prev, [field]: '' }))

    // Load new options for dependent dropdowns
    if (['joiningYear', 'branch', 'year'].includes(field)) {
      await loadFilteredOptions(newFormData)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.joiningYear) newErrors.joiningYear = 'Joining Year is required'
    if (!formData.branch) newErrors.branch = 'Branch is required'
    if (!formData.year) newErrors.year = 'Academic Year is required'
    if (!formData.section) newErrors.section = 'Section is required'
    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration Number is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onComplete(formData)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Information</h2>
        <p className="text-gray-600">Please fill in your details to proceed with the feedback.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Joining Year */}
        <div>
          <label htmlFor="joiningYear" className="block text-sm font-medium text-gray-700 mb-1">
            Joining Year *
          </label>
          <select
            id="joiningYear"
            value={formData.joiningYear}
            onChange={(e) => handleInputChange('joiningYear', e.target.value)}
            className={`select-field ${errors.joiningYear ? 'border-red-500' : ''}`}
            disabled={loading}
          >
            <option value="">Select Joining Year</option>
            {options.joiningYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          {errors.joiningYear && (
            <p className="text-red-500 text-sm mt-1">{errors.joiningYear}</p>
          )}
        </div>

        {/* Branch */}
        <div>
          <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
            Branch *
          </label>
          <select
            id="branch"
            value={formData.branch}
            onChange={(e) => handleInputChange('branch', e.target.value)}
            className={`select-field ${errors.branch ? 'border-red-500' : ''}`}
            disabled={loading || !formData.joiningYear}
          >
            <option value="">Select Branch</option>
            {options.branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
          {errors.branch && (
            <p className="text-red-500 text-sm mt-1">{errors.branch}</p>
          )}
        </div>

        {/* Academic Year */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
            Academic Year *
          </label>
          <select
            id="year"
            value={formData.year}
            onChange={(e) => handleInputChange('year', e.target.value)}
            className={`select-field ${errors.year ? 'border-red-500' : ''}`}
            disabled={loading || !formData.branch}
          >
            <option value="">Select Academic Year</option>
            {options.years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          {errors.year && (
            <p className="text-red-500 text-sm mt-1">{errors.year}</p>
          )}
        </div>

        {/* Section */}
        <div>
          <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">
            Section *
          </label>
          <select
            id="section"
            value={formData.section}
            onChange={(e) => handleInputChange('section', e.target.value)}
            className={`select-field ${errors.section ? 'border-red-500' : ''}`}
            disabled={loading || !formData.year}
          >
            <option value="">Select Section</option>
            {options.sections.map(section => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
          {errors.section && (
            <p className="text-red-500 text-sm mt-1">{errors.section}</p>
          )}
        </div>

        {/* Registration Number */}
        <div>
          <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Registration Number *
          </label>
          <input
            type="text"
            id="registrationNumber"
            value={formData.registrationNumber}
            onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
            className={`input-field ${errors.registrationNumber ? 'border-red-500' : ''}`}
            placeholder="Enter your registration number"
          />
          {errors.registrationNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.registrationNumber}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
            disabled={loading}
          >
            {loading && <div className="spinner" />}
            <span>Continue to Feedback</span>
          </button>
        </div>
      </form>
    </div>
  )
}
