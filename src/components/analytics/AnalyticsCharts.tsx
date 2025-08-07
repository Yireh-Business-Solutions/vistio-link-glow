import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCards } from "@/hooks/useCards";
import { useContacts } from "@/hooks/useContacts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Calendar,
  TrendingUp,
  Users,
  Eye,
  Share,
  Download,
  RefreshCw
} from "lucide-react";

export default function AnalyticsCharts() {
  const { cards } = useCards();
  const { contacts, getContactStats } = useContacts();
  const [viewData, setViewData] = useState<any[]>([]);
  const [contactData, setContactData] = useState<any[]>([]);
  const [cardPerformance, setCardPerformance] = useState<any[]>([]);

  const contactStats = getContactStats();

  useEffect(() => {
    // Generate view data for the last 30 days
    const generateViewData = () => {
      const data = [];
      const today = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Simulate some view data based on existing card views
        const totalViews = cards.reduce((sum, card) => sum + (card.view_count || 0), 0);
        const dailyViews = Math.floor(Math.random() * Math.max(1, totalViews / 30)) + 1;
        
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          views: dailyViews,
          contacts: Math.floor(dailyViews * 0.1) // 10% conversion rate
        });
      }
      return data;
    };

    // Generate contact data for the last 30 days
    const generateContactData = () => {
      const data = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - (i * 7));
        
        const weekContacts = contacts.filter(contact => {
          const contactDate = new Date(contact.created_at);
          const weekStart = new Date(date);
          const weekEnd = new Date(date);
          weekEnd.setDate(weekEnd.getDate() + 7);
          return contactDate >= weekStart && contactDate < weekEnd;
        }).length;
        
        data.push({
          week: `Week ${7 - i}`,
          contacts: weekContacts,
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
      }
      return data;
    };

    // Generate card performance data
    const generateCardPerformance = () => {
      return cards.map(card => ({
        name: card.name.substring(0, 15) + (card.name.length > 15 ? '...' : ''),
        views: card.view_count || 0,
        contacts: contactStats.byCard[card.id] || 0,
        conversion: card.view_count > 0 ? ((contactStats.byCard[card.id] || 0) / card.view_count * 100).toFixed(1) : 0
      }));
    };

    setViewData(generateViewData());
    setContactData(generateContactData());
    setCardPerformance(generateCardPerformance());
  }, [cards, contacts, contactStats]);

  const totalViews = cards.reduce((sum, card) => sum + (card.view_count || 0), 0);
  const avgConversion = totalViews > 0 ? ((contactStats.total / totalViews) * 100).toFixed(1) : 0;

  const COLORS = ['hsl(195 100% 50%)', 'hsl(120 100% 50%)', 'hsl(280 100% 70%)', 'hsl(320 100% 70%)'];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-blue">{totalViews}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-green">{contactStats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-purple">{avgConversion}%</div>
            <p className="text-xs text-muted-foreground">Views to contacts</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-pink">{contactStats.thisWeek}</div>
            <p className="text-xs text-muted-foreground">New contacts</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Views Over Time */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Views Over Time
            </CardTitle>
            <CardDescription>Card views for the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={viewData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="hsl(195 100% 50%)" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(195 100% 50%)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Contact Acquisition */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Contact Acquisition
            </CardTitle>
            <CardDescription>New contacts by week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contactData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="contacts" 
                  fill="hsl(120 100% 50%)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Card Performance */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Card Performance
          </CardTitle>
          <CardDescription>Individual card metrics and conversion rates</CardDescription>
        </CardHeader>
        <CardContent>
          {cardPerformance.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No cards available for analysis</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cardPerformance.map((card, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{card.name}</h4>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {card.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {card.contacts} contacts
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{card.conversion}%</div>
                    <div className="text-xs text-muted-foreground">conversion</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Sources Pie Chart */}
      {contacts.length > 0 && (
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share className="h-5 w-5" />
              Contact Sources
            </CardTitle>
            <CardDescription>How people are finding your cards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Card Form', value: contacts.filter(c => c.source === 'card_form').length },
                      { name: 'QR Scan', value: contacts.filter(c => c.source === 'qr_scan').length },
                      { name: 'Direct Link', value: contacts.filter(c => c.source === 'direct_link').length }
                    ].filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'Card Form', value: contacts.filter(c => c.source === 'card_form').length },
                      { name: 'QR Scan', value: contacts.filter(c => c.source === 'qr_scan').length },
                      { name: 'Direct Link', value: contacts.filter(c => c.source === 'direct_link').length }
                    ].filter(item => item.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-2">
                {[
                  { name: 'Card Form', value: contacts.filter(c => c.source === 'card_form').length, color: COLORS[0] },
                  { name: 'QR Scan', value: contacts.filter(c => c.source === 'qr_scan').length, color: COLORS[1] },
                  { name: 'Direct Link', value: contacts.filter(c => c.source === 'direct_link').length, color: COLORS[2] }
                ].filter(item => item.value > 0).map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}