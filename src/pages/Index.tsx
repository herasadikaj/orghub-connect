import { Building2, Heart, Palette, Dumbbell, Music, Camera, Book } from "lucide-react";
import { CompanyCard } from "@/components/CompanyCard";
import { CommunityCard } from "@/components/CommunityCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const companies = [
    {
      id: "1",
      name: "TechCorp Solutions",
      description: "Leading technology solutions provider specializing in enterprise software",
      businessUnits: [
        {
          id: "bu1",
          name: "Product Development",
          teams: [
            {
              id: "t1",
              name: "Frontend Team",
              people: [
                { id: "p1", name: "Sarah Johnson", role: "Senior Frontend Developer" },
                { id: "p2", name: "Mike Chen", role: "UI/UX Designer" },
                { id: "p3", name: "Emily Davis", role: "Frontend Developer" },
              ],
            },
            {
              id: "t2",
              name: "Backend Team",
              people: [
                { id: "p4", name: "James Wilson", role: "Lead Backend Developer" },
                { id: "p5", name: "Lisa Anderson", role: "DevOps Engineer" },
              ],
            },
          ],
        },
        {
          id: "bu2",
          name: "Sales & Marketing",
          teams: [
            {
              id: "t3",
              name: "Digital Marketing",
              people: [
                { id: "p6", name: "David Brown", role: "Marketing Manager" },
                { id: "p7", name: "Anna Martinez", role: "Content Strategist" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "2",
      name: "InnovateLabs",
      description: "Research and development company focused on AI and machine learning",
      businessUnits: [
        {
          id: "bu3",
          name: "AI Research",
          teams: [
            {
              id: "t4",
              name: "Machine Learning",
              people: [
                { id: "p8", name: "Dr. Robert Lee", role: "ML Research Lead" },
                { id: "p9", name: "Sophia Wang", role: "Data Scientist" },
                { id: "p10", name: "Alex Thompson", role: "ML Engineer" },
              ],
            },
          ],
        },
      ],
    },
  ];

  const communities = [
    {
      id: "c1",
      name: "Photography Club",
      description: "Capture moments and share your passion for photography with fellow enthusiasts",
      icon: Camera,
      memberCount: 234,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "c2",
      name: "Fitness & Wellness",
      description: "Stay active and healthy together with workout tips and motivation",
      icon: Dumbbell,
      memberCount: 567,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "c3",
      name: "Music Lovers",
      description: "Share your favorite tunes and discover new music from around the world",
      icon: Music,
      memberCount: 892,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "c4",
      name: "Art & Design",
      description: "Express your creativity and get inspired by amazing artworks",
      icon: Palette,
      memberCount: 445,
      color: "from-orange-500 to-red-500",
    },
    {
      id: "c5",
      name: "Book Club",
      description: "Discuss your favorite books and discover new literary adventures",
      icon: Book,
      memberCount: 321,
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: "c6",
      name: "Volunteer Network",
      description: "Make a difference in your community through volunteer opportunities",
      icon: Heart,
      memberCount: 178,
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">OrgConnect</h1>
              <p className="text-sm text-muted-foreground">Connect with your organization and community</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="companies" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="communities">Communities</TabsTrigger>
          </TabsList>

          <TabsContent value="companies" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Organization Structure</h2>
              <p className="text-muted-foreground">
                Explore companies, business units, teams, and team members
              </p>
            </div>
            <div className="space-y-6 max-w-4xl mx-auto">
              {companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="communities" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Hobby Communities</h2>
              <p className="text-muted-foreground">
                Join communities based on your interests and connect with like-minded people
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {communities.map((community) => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
