"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Bot, FileText, Upload, Loader2, Brain, MessageSquare, Settings, Sparkles } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export function AISupportTab() {
  const { toast } = useToast()
  const [isTraining, setIsTraining] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [knowledgeBase, setKnowledgeBase] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [previewQuestion, setPreviewQuestion] = useState("")
  const [previewResponse, setPreviewResponse] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  // Demo data - in a real app, fetch from API
  const agentStatus = {
    isActive: true,
    lastTrained: "2024-02-04T10:00:00Z",
    totalConversations: 156,
    averageResponseTime: "2.3s",
    satisfactionRate: 98
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files))
    }
  }

  const handleTrainAgent = async () => {
    if (!knowledgeBase.trim() && uploadedFiles.length === 0) {
      toast({
        title: "No training data",
        description: "Please provide knowledge base text or upload files",
        variant: "destructive"
      })
      return
    }

    setIsTraining(true)
    try {
      // Here you would:
      // 1. Upload files to storage
      // 2. Process text and files into training data
      // 3. Call OpenAI API to fine-tune the model
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast({
        title: "AI agent trained successfully",
        description: "Your support agent is ready to help customers"
      })
    } catch (error) {
      toast({
        title: "Training failed",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setIsTraining(false)
    }
  }

  const handlePreviewResponse = async () => {
    if (!previewQuestion.trim()) {
      toast({
        title: "Enter a question",
        description: "Please enter a question to test the AI agent",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    try {
      // Here you would call your OpenAI API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500))
      setPreviewResponse(
        "Based on your product documentation, I can help with that. The UI kit includes over 100 components, all fully customizable with Tailwind CSS. Each component comes with detailed documentation and usage examples. Would you like me to show you some specific examples?"
      )
    } catch (error) {
      toast({
        title: "Error generating response",
        description: "Please try again",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">AI Support Agent</h2>
        <p className="text-muted-foreground">
          Train your AI agent to provide 24/7 support for your customers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Training Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <Tabs defaultValue="text">
              <TabsList>
                <TabsTrigger value="text">Knowledge Base</TabsTrigger>
                <TabsTrigger value="files">Upload Files</TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4">
                <div className="space-y-2">
                  <Label>Product Knowledge</Label>
                  <Textarea
                    value={knowledgeBase}
                    onChange={(e) => setKnowledgeBase(e.target.value)}
                    placeholder="Enter detailed information about your products, features, common questions, etc."
                    className="min-h-[200px]"
                  />
                </div>
              </TabsContent>

              <TabsContent value="files" className="space-y-4">
                <div className="space-y-2">
                  <Label>Upload Documentation</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      onChange={handleFileUpload}
                      multiple
                      accept=".pdf,.doc,.docx,.txt"
                    />
                    <Button variant="outline" size="icon">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Supported formats: PDF, DOC, DOCX, TXT
                  </p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Files</Label>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-secondary rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setUploadedFiles(prev => 
                                prev.filter((_, i) => i !== index)
                              )
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowPreview(true)}
              >
                <Bot className="w-4 h-4 mr-2" />
                Preview Agent
              </Button>
              <Button
                onClick={handleTrainAgent}
                disabled={isTraining}
              >
                {isTraining ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Training Agent...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Train Agent
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Settings Card */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Agent Settings
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Agent Name</Label>
                  <Input placeholder="e.g., ProductPro AI" />
                </div>
                <div className="space-y-2">
                  <Label>Response Style</Label>
                  <Input placeholder="e.g., Professional and friendly" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Welcome Message</Label>
                <Textarea 
                  placeholder="Enter the message your AI agent will use to greet customers"
                  rows={3}
                />
              </div>

              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertTitle>Pro Tip</AlertTitle>
                <AlertDescription>
                  Make your AI agent more engaging by giving it a personality that matches your brand.
                </AlertDescription>
              </Alert>
            </div>
          </Card>
        </div>

        {/* Status Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Agent Status
          </h3>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <Badge variant={agentStatus.isActive ? "default" : "secondary"}>
                {agentStatus.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Last Trained</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(agentStatus.lastTrained).toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Total Conversations</Label>
                <p className="text-2xl font-bold">
                  {agentStatus.totalConversations}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Average Response Time</Label>
                <p className="text-2xl font-bold">
                  {agentStatus.averageResponseTime}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Customer Satisfaction</Label>
                <p className="text-2xl font-bold text-green-500">
                  {agentStatus.satisfactionRate}%
                </p>
              </div>
            </div>

            <Alert>
              <MessageSquare className="h-4 w-4" />
              <AlertTitle>Active Support</AlertTitle>
              <AlertDescription>
                Your AI agent is actively supporting {agentStatus.totalConversations} customers.
              </AlertDescription>
            </Alert>
          </div>
        </Card>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Preview AI Support Agent</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Test a Question</Label>
              <div className="flex gap-2">
                <Input
                  value={previewQuestion}
                  onChange={(e) => setPreviewQuestion(e.target.value)}
                  placeholder="e.g., How do I customize the UI components?"
                  className="flex-1"
                />
                <Button
                  onClick={handlePreviewResponse}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Ask"
                  )}
                </Button>
              </div>
            </div>

            {previewResponse && (
              <div className="space-y-2">
                <Label>AI Response</Label>
                <Card className="p-4 bg-muted">
                  <div className="flex gap-4">
                    <Bot className="w-6 h-6 shrink-0" />
                    <p className="text-sm">{previewResponse}</p>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}