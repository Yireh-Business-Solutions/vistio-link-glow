import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  CreditCard, 
  Users, 
  Mail, 
  QrCode, 
  BarChart3, 
  Plus, 
  Settings, 
  LogOut,
  Sparkles,
  Edit,
  Share,
  Trash2,
  Eye
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useCards } from "@/hooks/useCards";
import CreateCardForm from "@/components/cards/CreateCardForm";
import ResourcesGenerator from "@/components/resources/ResourcesGenerator";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cards, loading, refetch, deleteCard } = useCards();
  const [activeTab, setActiveTab] = useState("cards");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleDeleteCard = async (cardId: string) => {
    const result = await deleteCard(cardId);
    if (result.success) {
      toast({
        title: "Card deleted",
        description: "Your business card has been deleted successfully."
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete card",
        variant: "destructive"
      });
    }
  };

  const handleViewCard = (card: any) => {
    // Navigate to the public card view
    const slug = card.slug || card.id;
    window.open(`/card/${slug}`, '_blank');
  };

  const handleEditCard = (card: any) => {
    // You can implement edit functionality here
    toast({
      title: "Edit functionality",
      description: "Edit functionality will be implemented soon."
    });
  };

  const handleShareCard = (card: any) => {
    const slug = card.slug || card.id;
    const url = `${window.location.origin}/card/${slug}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${card.name}'s Business Card`,
        text: `Check out ${card.name}'s digital business card`,
        url: url
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(url).then(() => {
        toast({
          title: "Link copied!",
          description: "The card link has been copied to your clipboard."
        });
      }).catch(() => {
        toast({
          title: "Share link",
          description: url,
        });
      });
    }
  };

  const getThemeColor = (theme: string | null) => {
    const themes = {
      'neon-blue': 'hsl(195 100% 50%)',
      'neon-green': 'hsl(120 100% 50%)',
      'neon-purple': 'hsl(280 100% 70%)',
      'neon-pink': 'hsl(320 100% 70%)'
    };
    return themes[(theme || 'neon-blue') as keyof typeof themes] || themes['neon-blue'];
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-neon-blue" />
            <span className="text-2xl font-bold text-foreground">Vistio</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your digital business cards and connections
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit">
            <TabsTrigger value="cards" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              My Cards
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* My Cards Tab */}
          <TabsContent value="cards" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">My Business Cards</h2>
              <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-primary hover:shadow-neon transition-all duration-300">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Card
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-hero">
                  <DialogHeader>
                    <DialogTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
                      Create New Business Card
                    </DialogTitle>
                  </DialogHeader>
                  <CreateCardForm 
                    onSuccess={() => {
                      setShowCreateForm(false);
                      refetch();
                    }}
                    onCancel={() => setShowCreateForm(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your cards...</p>
              </div>
            ) : cards.length === 0 ? (
              <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardContent className="p-12 text-center">
                  <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No cards yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first digital business card to get started.
                  </p>
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    className="bg-gradient-primary hover:shadow-neon transition-all duration-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Card
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => (
                  <Card 
                    key={card.id}
                    className="bg-card/50 backdrop-blur-sm border-border hover:border-neon-blue transition-all duration-300 hover:shadow-neon"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{card.name}</CardTitle>
                          <CardDescription>
                            {card.title} {card.company && `at ${card.company}`}
                          </CardDescription>
                        </div>
                        {card.is_primary && (
                          <Badge 
                            variant="outline" 
                            style={{ borderColor: getThemeColor(card.color_theme) }}
                          >
                            Primary
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div 
                          className="h-20 rounded-lg border-2 flex items-center justify-center"
                          style={{ 
                            borderColor: getThemeColor(card.color_theme),
                            boxShadow: `0 0 10px ${getThemeColor(card.color_theme)}30`
                          }}
                        >
                          <span className="font-semibold" style={{ color: getThemeColor(card.color_theme) }}>
                            {card.name}
                          </span>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <p>Views: {card.view_count || 0}</p>
                          <p>Created: {new Date(card.created_at).toLocaleDateString()}</p>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handleEditCard(card)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handleShareCard(card)}
                          >
                            <Share className="h-3 w-3 mr-1" />
                            Share
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewCard(card)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteCard(card.id)}
                            className="hover:border-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <h2 className="text-2xl font-semibold">Contacts & Connections</h2>
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No contacts yet</h3>
                  <p className="text-muted-foreground">
                    When people share their information through your business card, they'll appear here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <h2 className="text-2xl font-semibold">Signature & Resources</h2>
            {cards.length === 0 ? (
              <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardContent className="p-12 text-center">
                  <Mail className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No cards available</h3>
                  <p className="text-muted-foreground mb-6">
                    Create a business card first to generate email signatures and resources.
                  </p>
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    className="bg-gradient-primary hover:shadow-neon transition-all duration-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Card
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <ResourcesGenerator card={cards[0]} />
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-semibold">Analytics</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Card Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neon-blue">0</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">New Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neon-green">0</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Share Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neon-purple">0%</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-semibold">Settings</h2>
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <Button variant="outline">
                    Update Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;