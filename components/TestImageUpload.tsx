"use client"

import { useState } from "react"

export default function TestImageUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const testUpload = async () => {
    if (!file) {
      setError("Please select a file first")
      return
    }

    setUploading(true)
    setError("")
    setResult(null)

    // YOUR BACKEND API URL - UPDATE THIS!
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    
    const formData = new FormData()
    formData.append('image', file)

    console.log('Uploading file:', file.name, file.type, file.size)
    console.log('API URL:', `${API_URL}/upload/image`)

    try {
      const response = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        body: formData,
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      const responseText = await response.text()
      console.log('Response text:', responseText)
      console.log('Response content-type:', response.headers.get('content-type'))

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        throw new Error(`Invalid JSON response: ${responseText}`)
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${data.message || responseText}`)
      }

      if (!data.success) {
        throw new Error(data.message || 'Upload failed')
      }

      setResult(data)
      console.log('Upload successful:', data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Image Upload</h1>

      <div className="space-y-4">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-[#CCA33A] file:text-black
              hover:file:bg-[#b89234]"
          />
        </div>

        {preview && (
          <div className="border border-gray-600 rounded p-4">
            <p className="text-sm mb-2">Preview:</p>
            <img src={preview} alt="Preview" className="max-h-40 object-contain" />
          </div>
        )}

        <button
          onClick={testUpload}
          disabled={!file || uploading}
          className="bg-[#CCA33A] text-black px-6 py-2 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Test Upload'}
        </button>

        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded p-4">
            <p className="text-red-500 font-semibold mb-1">Error:</p>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-500/10 border border-green-500 rounded p-4">
            <p className="text-green-500 font-semibold mb-2">Success!</p>
            <pre className="text-xs text-gray-300 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
            {result.data?.url && (
              <div className="mt-4">
                <p className="text-sm mb-2">Uploaded Image:</p>
                <img src={result.data.url} alt="Uploaded" className="max-h-40 object-contain border border-gray-600" />
                <p className="text-xs text-gray-400 mt-2 break-all">{result.data.url}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}