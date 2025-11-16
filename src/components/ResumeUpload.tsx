import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
// Temporarily disable resume parsing by removing dependency on resumeParser
export interface ParsedResumeData {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  title?: string;
  bio?: string;
  skills?: string[];
  experience?: Array<{
    title?: string;
    company?: string;
    location?: string;
    period?: string;
    description?: string;
    achievements?: string[];
  }>;
  education?: Array<{
    degree?: string;
    school?: string;
    location?: string;
    period?: string;
    gpa?: string;
    honors?: string;
  }>;
  linkedin_url?: string;
  portfolio_url?: string;
}
import { updateJobSeekerProfile } from '@/lib/utils';
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ResumeUploadProps {
  onResumeParsed?: (data: ParsedResumeData) => void;
  onUpdateComplete?: () => void;
}

export default function ResumeUpload({ onResumeParsed, onUpdateComplete }: ResumeUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];

    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or DOCX file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    setUploadedFile(file);
    setError(null);
    setSuccess(false);
    setParsedData(null);

    // Parsing disabled for now
    setParsing(false);
    setError('Resume parsing is temporarily disabled.');
    toast({
      title: "Resume parsing disabled",
      description: "This feature is temporarily unavailable.",
      variant: "destructive",
    });
  };

  const handleApplyData = async () => {
    if (!parsedData) return;

    try {
      setUploading(true);
      setError(null);

      // Map parsed data to profile data
      const profileData: any = {};

      if (parsedData.firstName) profileData.first_name = parsedData.firstName;
      if (parsedData.lastName) profileData.last_name = parsedData.lastName;
      if (parsedData.title) profileData.title = parsedData.title;
      if (parsedData.bio) profileData.bio = parsedData.bio;
      if (parsedData.skills && parsedData.skills.length > 0) profileData.skills = parsedData.skills;
      if (parsedData.location) profileData.location = parsedData.location;
      if (parsedData.phone) profileData.phone = parsedData.phone;
      if (parsedData.linkedin_url) profileData.linkedin_url = parsedData.linkedin_url;
      if (parsedData.portfolio_url) profileData.portfolio_url = parsedData.portfolio_url;
      if (parsedData.experience && parsedData.experience.length > 0) {
        profileData.experience = parsedData.experience;
      }
      if (parsedData.education && parsedData.education.length > 0) {
        profileData.education = parsedData.education;
      }

      // Update profile
      await updateJobSeekerProfile(profileData);

      setSuccess(true);
      setUploading(false);

      toast({
        title: "Profile updated!",
        description: "Your profile has been updated with data from your resume.",
      });

      if (onUpdateComplete) {
        onUpdateComplete();
      }

      // Reset after 2 seconds
      setTimeout(() => {
        setUploadedFile(null);
        setParsedData(null);
        setSuccess(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 2000);
    } catch (err: any) {
      setUploading(false);
      setError(err.message || 'Failed to update profile. Please try again.');
      toast({
        title: "Error updating profile",
        description: err.message || 'Failed to update profile. Please try again.',
        variant: "destructive",
      });
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setParsedData(null);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Upload Resume
        </CardTitle>
        <CardDescription>
          Upload your resume (PDF or DOCX) to automatically extract and fill your profile information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!uploadedFile ? (
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileSelect}
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              className="cursor-pointer flex flex-col items-center gap-4"
            >
              <div className="p-4 rounded-full bg-primary/10">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF or DOCX (Max 5MB)
                </p>
              </div>
            </label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                fileInputRef.current?.click();
              }}
              className="mt-2"
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* File Info */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                disabled={parsing || uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Parsing Status */}
            {parsing && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Parsing resume...</span>
              </div>
            )}

            {/* Error */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success */}
            {success && (
              <Alert className="border-green-500 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Profile updated successfully!
                </AlertDescription>
              </Alert>
            )}

            {/* Parsed Data Preview */}
            {parsedData && !parsing && (
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h4 className="text-sm font-semibold mb-3">Extracted Data Preview</h4>
                  <div className="space-y-2 text-sm">
                    {parsedData.firstName && parsedData.lastName && (
                      <div>
                        <span className="font-medium">Name:</span> {parsedData.firstName} {parsedData.lastName}
                      </div>
                    )}
                    {parsedData.title && (
                      <div>
                        <span className="font-medium">Title:</span> {parsedData.title}
                      </div>
                    )}
                    {parsedData.email && (
                      <div>
                        <span className="font-medium">Email:</span> {parsedData.email}
                      </div>
                    )}
                    {parsedData.phone && (
                      <div>
                        <span className="font-medium">Phone:</span> {parsedData.phone}
                      </div>
                    )}
                    {parsedData.location && (
                      <div>
                        <span className="font-medium">Location:</span> {parsedData.location}
                      </div>
                    )}
                    {parsedData.skills && parsedData.skills.length > 0 && (
                      <div>
                        <span className="font-medium">Skills:</span> {parsedData.skills.slice(0, 5).join(', ')}
                        {parsedData.skills.length > 5 && ` +${parsedData.skills.length - 5} more`}
                      </div>
                    )}
                    {parsedData.experience && parsedData.experience.length > 0 && (
                      <div>
                        <span className="font-medium">Experience:</span> {parsedData.experience.length} position(s)
                      </div>
                    )}
                    {parsedData.education && parsedData.education.length > 0 && (
                      <div>
                        <span className="font-medium">Education:</span> {parsedData.education.length} entry(ies)
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleApplyData}
                  disabled={uploading}
                  className="w-full"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Profile...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Apply to Profile
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

