import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";
import { useToast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  Trophy,
  Bell,
  Settings,
  CreditCard,
  Download,
  Send,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Payments = () => {
  const { toast } = useToast();
  
  const recentPayments = [
    { name: "Sarah M.", amount: "$20.00", status: "paid", date: "Jan 15" },
    { name: "Mike T.", amount: "$20.00", status: "paid", date: "Jan 14" },
    { name: "Jenny K.", amount: "$20.00", status: "pending", date: "Due Jan 20" },
    { name: "Tom R.", amount: "$20.00", status: "paid", date: "Jan 13" },
  ];

  const upcomingDues = [
    { title: "Monthly Team Dues", amount: "$20.00", dueDate: "Feb 1", collected: 18, total: 24 },
    { title: "Championship Entry Fee", amount: "$35.00", dueDate: "Jan 25", collected: 12, total: 20 },
  ];

  const handleAction = (action: string) => {
    toast({
      title: action,
      description: "This feature is coming soon!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BackButton />
              <Link to="/dashboard" className="flex items-center gap-2">
                <Trophy className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">GamePlan</span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative" onClick={() => handleAction("Notifications")}>
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-secondary rounded-full" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/settings">
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Payments & Dues</h1>
            <p className="text-muted-foreground">Track team finances and collect payments</p>
          </div>
          <Button variant="hero" size="lg" onClick={() => handleAction("Request Payment")}>
            <Send className="h-5 w-5 mr-2" />
            Request Payment
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <DollarSign className="h-8 w-8 text-primary mb-2" />
            <div className="text-3xl font-bold mb-1">$480</div>
            <div className="text-sm text-muted-foreground">Collected This Month</div>
          </Card>
          <Card className="p-6">
            <Clock className="h-8 w-8 text-secondary mb-2" />
            <div className="text-3xl font-bold mb-1">$140</div>
            <div className="text-sm text-muted-foreground">Pending Payments</div>
          </Card>
          <Card className="p-6">
            <TrendingUp className="h-8 w-8 text-accent mb-2" />
            <div className="text-3xl font-bold mb-1">92%</div>
            <div className="text-sm text-muted-foreground">Collection Rate</div>
          </Card>
          <Card className="p-6">
            <Users className="h-8 w-8 text-primary mb-2" />
            <div className="text-3xl font-bold mb-1">18/24</div>
            <div className="text-sm text-muted-foreground">Members Paid</div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upcoming Dues */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-primary" />
              Active Payment Requests
            </h2>
            <div className="space-y-6">
              {upcomingDues.map((due, index) => (
                <div key={index} className="space-y-3 pb-6 border-b last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{due.title}</h3>
                      <p className="text-sm text-muted-foreground">Due {due.dueDate}</p>
                    </div>
                    <Badge variant="secondary" className="text-lg font-bold px-3 py-1">
                      {due.amount}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {due.collected} of {due.total} members paid
                      </span>
                      <span className="font-semibold">
                        {Math.round((due.collected / due.total) * 100)}%
                      </span>
                    </div>
                    <Progress value={(due.collected / due.total) * 100} className="h-2" />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleAction("Send Reminder")}>
                      <Send className="h-4 w-4 mr-1" />
                      Send Reminder
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleAction("View Details")}>
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button variant="hero" className="w-full" onClick={() => handleAction("Create New Payment Request")}>
                Create New Payment Request
              </Button>
            </div>
          </Card>

          {/* Recent Payments */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-accent" />
                Recent Payments
              </h2>
              <Button variant="ghost" size="sm" onClick={() => handleAction("Export")}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
            
            <div className="space-y-3">
              {recentPayments.map((payment, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {payment.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{payment.name}</div>
                      <div className="text-sm text-muted-foreground">{payment.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{payment.amount}</div>
                    <Badge 
                      variant={payment.status === "paid" ? "default" : "secondary"}
                      className="mt-1"
                    >
                      {payment.status === "paid" ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Paid
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4" onClick={() => handleAction("View All Transactions")}>
              View All Transactions
            </Button>
          </Card>
        </div>

        {/* Payment Methods */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Payment Methods</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border-2 border-primary/20 rounded-lg bg-primary/5">
              <div className="flex items-center justify-between mb-4">
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <Badge variant="default">Active</Badge>
              </div>
              <h3 className="font-bold mb-1">Stripe</h3>
              <p className="text-sm text-muted-foreground">2.9% + $0.30 per transaction</p>
            </div>

            <div className="p-6 border-2 border-border rounded-lg hover:border-primary/20 hover:bg-muted/50 transition-all cursor-pointer" onClick={() => handleAction("PayPal Setup")}>
              <div className="flex items-center justify-between mb-4">
                <svg className="h-8 w-8 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
                </svg>
                <Badge variant="outline">Setup</Badge>
              </div>
              <h3 className="font-bold mb-1">PayPal</h3>
              <p className="text-sm text-muted-foreground">2.99% + $0.49 per transaction</p>
            </div>

            <div className="p-6 border-2 border-border rounded-lg hover:border-primary/20 hover:bg-muted/50 transition-all cursor-pointer" onClick={() => handleAction("Bank Transfer Setup")}>
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="h-8 w-8 text-muted-foreground" />
                <Badge variant="outline">Setup</Badge>
              </div>
              <h3 className="font-bold mb-1">Bank Transfer</h3>
              <p className="text-sm text-muted-foreground">Free, manual tracking</p>
            </div>
          </div>
        </Card>

        {/* Upgrade CTA */}
        <Card className="p-8 bg-gradient-to-r from-secondary/10 to-accent/10 border-secondary/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">Automate Your Collections</h3>
              <p className="text-muted-foreground">
                Upgrade to enable recurring payments, automated reminders, and detailed analytics
              </p>
            </div>
            <Button variant="accent" size="lg" onClick={() => handleAction("Upgrade to Premium")}>
              Upgrade to Premium
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Payments;
