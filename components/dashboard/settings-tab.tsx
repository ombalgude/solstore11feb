"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useWallet } from "@/hooks/use-wallet"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Mail, Wallet, Store, ShoppingBag, CheckCircle2, Star, Lock, AlertTriangle } from "lucide-react"
import { ChangePasswordDialog } from "@/components/change-password-dialog"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function SettingsTab() {
  const { address, disconnect } = useWallet()
  const { toast } = useToast()
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showDisconnectWallet, setShowDisconnectWallet] = useState(false)
  const [username, setUsername] = useState("")
  const [emailSettings, setEmailSettings] = useState({
    salesNotifications: true,
    orderUpdates: true,
    productReviews: true,
    marketingEmails: false
  })
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: ""
  })

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setUsername(value)
  }

  const handleEmailSettingChange = (setting: keyof typeof emailSettings) => {
    setEmailSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
    toast({
      title: "Settings updated",
      description: "Your email preferences have been saved."
    })
  }

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your changes have been saved successfully."
    })
  }

  const handleDisconnectWallet = async () => {
    try {
      await disconnect()
      setShowDisconnectWallet(false)
      toast({
        title: "Wallet disconnected",
        description: "Your wallet has been disconnected successfully."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Enter your display name" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Custom URL</Label>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">solstore.com/</span>
                  <Input 
                    id="username"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="your-username"
                    maxLength={30}
                    className="flex-1"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Only lowercase letters, numbers, and hyphens. Max 30 characters.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio"
                  value={formData.bio}
                  onChange={handleFormChange}
                  placeholder="Tell others about yourself and your content"
                  className="resize-none"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Enter your email" 
                />
              </div>
              <div className="space-y-2">
                <Label>Wallet Address</Label>
                <Input value={address || ""} disabled />
              </div>
              <Button onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Password</h4>
                  <p className="text-sm text-muted-foreground">
                    Change your account password
                  </p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setShowChangePassword(true)}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Connected Wallet</h4>
                  <p className="text-sm text-muted-foreground">
                    Manage your connected Phantom wallet
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {address ? (
                    <>
                      <span className="text-sm text-muted-foreground">
                        {`${address.slice(0, 4)}...${address.slice(-4)}`}
                      </span>
                      <Button 
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowDisconnectWallet(true)}
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" disabled>
                      No Wallet Connected
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4" />
                    <Label>Sales Notifications</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when you make a sale
                  </p>
                </div>
                <Switch
                  checked={emailSettings.salesNotifications}
                  onCheckedChange={() => handleEmailSettingChange('salesNotifications')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    <Label>Order Updates</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Get updates about your purchases
                  </p>
                </div>
                <Switch
                  checked={emailSettings.orderUpdates}
                  onCheckedChange={() => handleEmailSettingChange('orderUpdates')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <Label>Product Reviews</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Notifications about new reviews on your products
                  </p>
                </div>
                <Switch
                  checked={emailSettings.productReviews}
                  onCheckedChange={() => handleEmailSettingChange('productReviews')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <Label>Marketing Emails</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about new features and promotions
                  </p>
                </div>
                <Switch
                  checked={emailSettings.marketingEmails}
                  onCheckedChange={() => handleEmailSettingChange('marketingEmails')}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Order Management</h3>
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Sales Made
                </h4>
                <div className="space-y-4">
                  {[1, 2, 3].map((order) => (
                    <div key={order} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">Premium UI Kit</p>
                        <p className="text-sm text-muted-foreground">
                          Purchased by user123 • 2.5 SOL
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Order ID: #ORD-{order}123
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          2 hours ago
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => {
                            toast({
                              title: "Order marked as fulfilled",
                              description: "The buyer has been notified."
                            })
                          }}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Mark as Fulfilled
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Your Purchases
                </h4>
                <div className="space-y-4">
                  {[1, 2].map((purchase) => (
                    <div key={purchase} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">Stock Photo Collection</p>
                        <p className="text-sm text-muted-foreground">
                          Sold by creator456 • 1.2 SOL
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Order ID: #PUR-{purchase}456
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          1 day ago
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Download started",
                              description: "Your content is being prepared for download."
                            })
                          }}
                        >
                          Download Content
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <ChangePasswordDialog 
        open={showChangePassword}
        onOpenChange={setShowChangePassword}
      />

      <AlertDialog open={showDisconnectWallet} onOpenChange={setShowDisconnectWallet}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Wallet</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex items-start gap-2 mt-2 text-destructive">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Warning:</p>
                  <p>Disconnecting your wallet will prevent you from:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Making purchases</li>
                    <li>Receiving payments</li>
                    <li>Managing your store</li>
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisconnectWallet}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Disconnect Wallet
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}