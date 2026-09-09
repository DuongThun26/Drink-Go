import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import axiosClient from '@/api/axiosClient'

export default function ImageUpload({ onUpload, maxFiles = 5 }) {
  const [uploading, setUploading] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleFiles = async (files) => {
    if (uploadedUrls.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed`)
      return
    }

    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`)
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setUploading(true)
    try {
      const formData = new FormData()
      validFiles.forEach((file) => formData.append('files', file))

      const response = await axiosClient.post('/cloudinary/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const newUrls = [...uploadedUrls, ...response.data]
      setUploadedUrls(newUrls)
      onUpload(newUrls)
      toast.success(`${response.data.length} image(s) uploaded`)
    } catch (err) {
      toast.error('Upload failed: ' + (err.response?.data?.message || err.message))
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleChange = (e) => {
    handleFiles(e.target.files)
  }

  const removeImage = (index) => {
    const newUrls = uploadedUrls.filter((_, i) => i !== index)
    setUploadedUrls(newUrls)
    onUpload(newUrls)
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          disabled={uploading}
        />
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-gray-400" />
          <div>
            <p className="font-medium text-gray-700">
              {uploading ? 'Uploading...' : 'Drag images here or click to select'}
            </p>
            <p className="text-sm text-gray-500">
              PNG, JPG, GIF up to 5MB. Max {maxFiles} images.
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
          >
            Select Files
          </button>
        </div>
      </div>

      {uploadedUrls.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">
            Uploaded ({uploadedUrls.length}/{maxFiles})
          </p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {uploadedUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index}`}
                  className="h-24 w-24 rounded-lg object-cover border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 hidden group-hover:flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
