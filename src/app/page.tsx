"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bot, Brain, TrendingUp, Users, Shield, Zap, CheckCircle, Clock, MessageSquare, Activity, BarChart3, MapPin, Target, Group } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { API_ENDPOINT } from "@/utils/endpoints";
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

// Custom hook for typing effect
const useTypingEffect = (text: string, speed: number = 50) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayedText, isComplete };
};

interface InsightStats {
  totalClusters: number;
  totalHouseholds: number;
  totalRegions: number;
  totalDistricts: number;
  avgIncome: number;
  riskAlerts: number;
  successRate: number;
}

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<InsightStats>({
    totalHouseholds: 0,
    totalRegions: 0,
    totalDistricts: 0,
    totalClusters: 0,
    avgIncome: 0,
    riskAlerts: 0,
    successRate: 0,
  });

  // Default content for when API is unavailable
  const defaultStats: InsightStats = {
    totalHouseholds: 12500,
    totalRegions: 8,
    totalDistricts: 42,
    totalClusters: 15,
    avgIncome: 2350,
    riskAlerts: 850,
    successRate: 93.2,
  };

  // Use default stats when API fails or returns empty data
  const displayStats = stats.totalHouseholds === 0 ? defaultStats : stats;
  const isUsingDefaults = stats.totalHouseholds === 0;

  // Typing effect content
  const typingContent = isUsingDefaults 
    ? "Experience WorkMate's powerful analytics with real-time insights from our poverty alleviation programs. These sample metrics demonstrate our comprehensive monitoring capabilities."
    : `See WorkMate's analytics in action with live data from our poverty alleviation programs across ${displayStats.totalRegions} regions and ${displayStats.totalDistricts} districts.`;

  const { displayedText: typedText, isComplete: typingComplete } = useTypingEffect(typingContent, 30);

  // Chart data processing from actual API data
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartLoading, setChartLoading] = useState(true);

  const isAchieved = (value: any): boolean =>
    value === 1 || value === "1" || value === true;

  const fetchAllStandardEvaluations = async (startUrl?: string): Promise<any[]> => {
    let url = startUrl || `${API_ENDPOINT}/standard-evaluations/?limit=1000`;
    const aggregated: any[] = [];
    while (url) {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (!response.ok) break;
      const result = await response.json();
      const page = result.predictions || result.results || [];
      aggregated.push(...page);
      url = result.next || null;
    }
    return aggregated;
  };

  const fetchChartData = async () => {
    try {
      setChartLoading(true);
      const predictions = await fetchAllStandardEvaluations();
      setChartData(predictions);
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  // Process chart data from API or use defaults
  const processedChartData = chartData.length > 0 ? chartData : [
    { region: 'Northern', district: 'Kampala', prediction: 1, predicted_income: 2500, cluster: 'A' },
    { region: 'Central', district: 'Wakiso', prediction: 0, predicted_income: 1800, cluster: 'B' },
    { region: 'Eastern', district: 'Jinja', prediction: 1, predicted_income: 3200, cluster: 'C' },
    { region: 'Western', district: 'Mbarara', prediction: 1, predicted_income: 2800, cluster: 'D' },
    { region: 'Northern', district: 'Gulu', prediction: 1, predicted_income: 2300, cluster: 'A' },
    { region: 'Central', district: 'Mukono', prediction: 1, predicted_income: 2900, cluster: 'B' }
  ];

  // Achievement data from actual API
  const achievedCount = processedChartData.filter(d => d.prediction === 1).length;
  const notAchievedCount = processedChartData.length - achievedCount;

  // Regional performance aggregation
  const regionStats = processedChartData.reduce((acc: any, item: any) => {
    const region = item.region || 'Unknown';
    if (!acc[region]) {
      acc[region] = { households: 0, totalIncome: 0, achieved: 0 };
    }
    acc[region].households++;
    acc[region].totalIncome += item.predicted_income || 0;
    if (isAchieved(item.prediction)) acc[region].achieved++;
    return acc;
  }, {});


  
  // Hero title cycling insights
  const heroInsights = [
    "Transforming Insights into Impact  for Last-Mile Communities",
    `Monitoring ${displayStats.totalHouseholds.toLocaleString()} Households Across ${displayStats.totalRegions} Regions`,
    `${displayStats.successRate.toFixed(1)}% Average Achievement Rate`,
    `AI-Powered Analytics for Sustainable Development Goals`,
    `Real-time Risk Assessment for ${displayStats.totalHouseholds.toLocaleString()} Households`
  ];

  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const { displayedText: typedHeroTitle, isComplete: heroTypingComplete } = useTypingEffect(
    heroInsights[currentInsightIndex], 
    60
  );

  // Cycle through insights every 4 seconds after typing completes
  useEffect(() => {
    if (heroTypingComplete) {
      const timer = setTimeout(() => {
        setCurrentInsightIndex((prev) => (prev + 1) % heroInsights.length);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [heroTypingComplete, currentInsightIndex, heroInsights.length]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const predictions = await fetchAllStandardEvaluations();
      if (predictions.length > 0) {
        const regions = new Set(predictions.map((p: any) => p.region)).size;
        const districts = new Set(predictions.map((p: any) => p.district)).size;
        const households = predictions.length;
        const avgIncome = predictions.reduce((sum: number, p: any) => sum + (p.predicted_income || 0), 0) / predictions.length;
        const riskAlerts = predictions.filter((p: any) => !isAchieved(p.prediction)).length;
        const successRate = ((households - riskAlerts) / households * 100);
        const clusters = new Set(predictions.map((p: any) => p.cluster)).size;
        setStats({
          totalHouseholds: households,
          totalRegions: regions,
          totalDistricts: districts,
          avgIncome: avgIncome,
          riskAlerts: riskAlerts,
          successRate: successRate,
          totalClusters: clusters,
        });
      } else {
        throw new Error('No data received from API');
      }
    } catch (error) {
      console.error("Failed to fetch insights:", error);
      setStats({
        totalHouseholds: 0,
        totalRegions: 0,
        totalDistricts: 0,
        avgIncome: 0,
        riskAlerts: 0,
        successRate: 0,
        totalClusters: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const availableFeatures = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI Chatbot System",
      description: "Knowledge management and decision support with AI-powered, human-like responses",
      status: "available"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "ML Interpretability Dashboard",
      description: "Visual representation of program data drivers, outcomes, and progress with model analysis tools",
      status: "available"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Risk Assessment System",
      description: "Predictive analytics with early warnings and targeted interventions for household graduation programs",
      status: "available"
    }
  ];

  const comingSoonFeatures = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Image-Based Evaluation",
      description: "Automated classification system for visual assessment and evaluation of program outcomes",
      status: "coming-soon"
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: "Insight Triggered Messaging",
      description: "Data-driven insights with targeted messaging and automated communication systems",
      status: "coming-soon"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "USSD Quick Help",
      description: "Quick access to helpful information, even when offline, through USSD technology",
      status: "coming-soon"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Mobile Companion",
      description: "Mobile version for the AI system with both online and offline features for remote areas",
      status: "coming-soon"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Partner Portal",
      description: "Secure access point for donors and partners to view project progress and impact metrics",
      status: "coming-soon"
    }
  ];

  const quickInsights = [
    {
      title: "AI Chat Assistant",
      description: "Get instant help with data analysis and insights",
      icon: <MessageSquare className="h-6 w-6" />,
      href: "/chat",
      color: "bg-blue-50 text-blue-600 border-blue-200",
      hoverColor: "hover:bg-blue-100",
    },
    {
      title: "Prediction Analytics",
      description: "View comprehensive prediction data and trends",
      icon: <BarChart3 className="h-6 w-6" />,
      href: "/individual-predictions",
      color: "bg-green-50 text-green-600 border-green-200",
      hoverColor: "hover:bg-green-100",
    },
    {
      title: "Risk Assessment",
      description: "Monitor households at risk and intervention needs",
      icon: <Shield className="h-6 w-6" />,
      href: "/cluster-trends",
      color: "bg-orange-50 text-orange-600 border-orange-200",
      hoverColor: "hover:bg-orange-100",
    },
    {
      title: "Trend Analysis",
      description: "Analyze cluster performance and income trends",
      icon: <TrendingUp className="h-6 w-6" />,
      href: "/superuser/cluster-trends",
      color: "bg-purple-50 text-purple-600 border-purple-200",
      hoverColor: "hover:bg-purple-100",
    },
    {
      title: "Model Performance",
      description: "Review ML model metrics and interpretability",
      icon: <Brain className="h-6 w-6" />,
      href: "/model-metrics",
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
      hoverColor: "hover:bg-indigo-100",
    },
    {
      title: "Feature Importance",
      description: "Understand key factors driving predictions",
      icon: <Activity className="h-6 w-6" />,
      href: "/feature-importance",
      color: "bg-pink-50 text-pink-600 border-pink-200",
      hoverColor: "hover:bg-pink-100",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink">
              <Image 
                src="/RTV_Logo.png"
                alt="Raising the Village Logo"
                width={32}
                height={32}
                className="rounded-lg sm:w-10 sm:h-10 flex-shrink-0"
              />
              <h1 className="text-lg sm:text-2xl font-bold truncate">
                WorkMate
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <Link href="/sign-in">
                <Button className="text-white shadow-lg text-sm sm:text-base px-2 sm:px-4" style={{backgroundColor: '#d65a31'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c14d26'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#d65a31'}>
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-white text-sm font-medium mb-8" style={{backgroundColor: '#2c5f82'}}>
              <Zap className="w-4 h-4 mr-2" />
              RTV Work Mate - AI-Powered Analytics Platform
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 min-h-[8rem] lg:min-h-[12rem] flex flex-col justify-center">
              <span className="inline-block text-center">
                {currentInsightIndex === 0 ? (
                  // Original styled title for the first insight
                  <>
                    {typedHeroTitle.substring(0, 13)}
                    {typedHeroTitle.length > 13 && (
                      <span style={{color: '#d65a31'}}>
                        {typedHeroTitle.substring(13, 35)}
                      </span>
                    )}
                    {typedHeroTitle.length > 35 && (
                      <>
                        <br />
                        {typedHeroTitle.substring(35)}
                      </>
                    )}
                    {!heroTypingComplete && <span className="animate-pulse" style={{color: '#d65a31'}}>|</span>}
                  </>
                ) : (
                  // Dynamic insights with highlighted numbers/percentages
                  <>
                    {typedHeroTitle.split(/(\d+[,\d]*\.?\d*%?)/g).map((part, index) => 
                      /\d/.test(part) ? (
                        <span key={index} style={{color: '#d65a31'}}>{part}</span>
                      ) : (
                        <span key={index}>{part}</span>
                      )
                    )}
                    {!heroTypingComplete && <span className="animate-pulse" style={{color: '#d65a31'}}>|</span>}
                  </>
                )}
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              A comprehensive, integrated AI platform that unifies chatbot, risk assessment tools, 
              machine learning models, and other AI projects into a single, coherent system for 
              poverty alleviation efforts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-in">
                <Button size="lg" className="text-white shadow-lg px-8" style={{backgroundColor: '#d65a31'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c14d26'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#d65a31'}>
                  Sign In to WorkMate
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-teal-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Vision</h3>
                <p className="text-gray-600">Create a unified AI ecosystem that empowers and maximizes impact for last-mile communities worldwide</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mission</h3>
                <p className="text-gray-600">Transforming insights into impact for last-mile communities through innovative AI solutions</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-slate-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Purpose</h3>
                <p className="text-gray-600">Integrating diverse AI capabilities to drive informed decision-making and enhance operational efficiency</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Insights Section
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-100 text-teal-800 text-sm font-medium mb-4">
              <Activity className="w-4 h-4 mr-2" />
              {isUsingDefaults ? "Sample Analytics" : "Live Analytics"}
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Real-time Impact Insights</h2>
            <div className="text-xl text-gray-600 max-w-3xl mx-auto min-h-[3rem] flex items-center justify-center">
              <p className="leading-relaxed">
                {typedText}
                {!typingComplete && <span className="animate-pulse">|</span>}
              </p>
            </div>
          </div>
          
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
              <Card className="border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Households</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {displayStats.totalHouseholds.toLocaleString()}
                      </p>
                      
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <MapPin className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Regions</p>
                      <p className="text-2xl font-bold text-gray-900">{displayStats.totalRegions}</p>
                    
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Districts</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {displayStats.totalDistricts}
                      </p>
                     
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <Group className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Clusters</p>
                      <p className="text-2xl font-bold text-gray-900">{displayStats.totalClusters.toLocaleString()}</p>
                      
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {chartLoading ? (
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {Array.from({ length: 2}).map((_, i) => (
                <Card key={i} className="border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="h-80 flex items-center justify-center">
                      <div className="flex items-center gap-2 text-gray-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                        Loading analytics...
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid lg:grid-cols-2 gap-8 mb-12">
                
                <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="h-5 w-5 text-purple-600" />
                      Achievement Rate Distribution
                    </CardTitle>
                    <CardDescription>
                      Real-time breakdown of household graduation success rates ({processedChartData.length.toLocaleString()} households)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Plot
                        data={[
                          {
                            type: 'pie',
                            values: [achievedCount, notAchievedCount],
                            labels: ['Achieved Target', 'At Risk'],
                            hole: 0.4,
                            marker: {
                              colors: ['#2c5f82', '#d65a31']
                            },
                            //@ts-ignore
                            textinfo: 'percent+label',
                            textposition: 'auto',
                            hovertemplate: '<b>%{label}</b><br>Count: %{value}<br>Percentage: %{percent}<extra></extra>'
                          }
                        ]}
                        layout={{
                          autosize: true,
                          margin: { t: 30, b: 30, l: 30, r: 30 },
                          showlegend: true,
                          legend: {
                            orientation: 'h',
                            xanchor: 'center',
                            x: 0.5,
                            y: -0.1
                          },
                          font: { family: 'Arial, sans-serif', size: 12 },
                          paper_bgcolor: 'rgba(0,0,0,0)',
                          plot_bgcolor: 'rgba(0,0,0,0)'
                        }}
                        config={{
                          responsive: true,
                          displayModeBar: false,
                          displaylogo: false
                        }}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="text-2xl font-bold" style={{color: '#2c5f82'}}>
                          {achievedCount.toLocaleString()}
                        </div>
                        <div className="text-sm" style={{color: '#2c5f82'}}>Achieved Target</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="text-2xl font-bold" style={{color: '#d65a31'}}>
                          {notAchievedCount.toLocaleString()}
                        </div>
                        <div className="text-sm" style={{color: '#d65a31'}}>At Risk</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                
                <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5 text-teal-600" />
                      Predicted Regional Performance Analysis
                    </CardTitle>
                    <CardDescription>
                      Live data showing household distribution and success rates across regions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Plot
                        data={[
                          {
                            x: Object.keys(regionStats),
                            y: Object.values(regionStats).map((stat: any) => stat.achieved),
                            type: 'bar',
                            name: 'Achieved Target',
                            marker: { color: '#2c5f82' },
                            hovertemplate: '<b>%{x}</b><br>Achieved Target: %{y}<extra></extra>'
                          },
                          {
                            x: Object.keys(regionStats),
                            y: Object.values(regionStats).map((stat: any) => stat.households - stat.achieved),
                            type: 'bar',
                            name: 'At Risk',
                            marker: { color: '#d65a31' },
                            hovertemplate: '<b>%{x}</b><br>At Risk: %{y}<extra></extra>'
                          }
                        ]}
                        layout={{
                          autosize: true,
                          margin: { t: 30, b: 50, l: 50, r: 30 },
                          barmode: 'stack',
                          xaxis: { 
                            title: 'Region',
                            tickangle: -45
                          },
                          yaxis: { 
                            title: 'Number of Households'
                          },
                          legend: {
                            orientation: 'h',
                            xanchor: 'center',
                            x: 0.5,
                            y: -0.2
                          },
                          font: { family: 'Arial, sans-serif', size: 12 },
                          paper_bgcolor: 'rgba(0,0,0,0)',
                          plot_bgcolor: 'rgba(0,0,0,0)'
                        }}
                        config={{
                          responsive: true,
                          displayModeBar: false,
                          displaylogo: false
                        }}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-sm">
                        <Activity className="w-3 h-3 mr-1" />
                        Live Regional Monitoring
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>


            </>
          )}
        </div>
      </section> */}

      {/* Available Features */}
      <section className="py-16 bg-teal-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-100 text-teal-800 text-sm font-medium mb-4">
              <CheckCircle className="w-4 h-4 mr-2" />
              Available Now
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Current Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These powerful AI-driven features are already helping organizations make data-driven decisions
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                      <div className="text-teal-700">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900 group-hover:text-teal-700 transition-colors">
                        {feature.title}
                      </CardTitle>
                      <div className="flex items-center mt-1">
                        <CheckCircle className="w-4 h-4 text-teal-600 mr-2" />
                        <span className="text-sm text-teal-600 font-medium">Available</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4">
                    {feature.description}
                  </CardDescription>
                  <Link href={
                    feature.title === "AI Chatbot System" ? "/chat" :
                    feature.title === "ML Interpretability Dashboard" ? "/model-metrics" :
                    feature.title === "Real-time Predictions" ? "/individual-predictions" :
                    feature.title === "Risk Assessment System" ? "/cluster-trends" :
                    feature.title === "Multi-role Access" ? "/sign-up" : "/dashboard"
                  }>
                    <Button size="sm" variant="outline" className="w-full group-inner hover:bg-teal-50 hover:border-teal-300">
                      Explore {feature.title.split(' ')[0]}
                      <ArrowRight className="h-4 w-4 ml-2 group-inner-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Features */}
      <section className="py-16 bg-orange-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-800 text-sm font-medium mb-4">
              <Clock className="w-4 h-4 mr-2" />
              Coming Soon
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Future Innovations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Exciting new features in development to further enhance your AI-powered analytics experience
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {comingSoonFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
                    <Clock className="w-3 h-3 mr-1" />
                    Soon
                  </span>
                </div>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                      <div className="text-orange-600">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900 group-hover:text-orange-700 transition-colors">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <Image 
                  src="/RTV_Logo.png"
                  alt="Raising the Village Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <h3 className="text-2xl font-bold">WorkMate</h3>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
                WorkMate is RTV's comprehensive AI platform that transforms insights into impact for last-mile communities. 
                Our integrated system unifies analytics, predictions, and decision support to maximize poverty alleviation efforts.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Analytics System</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Access</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/chat" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    AI Chat Assistant
                    <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link href="/model-metrics" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                    <Brain className="w-4 h-4 mr-2" />
                    ML Dashboard
                    <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link href="/superuser/cluster-trends" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                    <Shield className="w-4 h-4 mr-2" />
                    Risk Assessment
                    <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link href="/sign-in" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                    <Users className="w-4 h-4 mr-2" />
                    Get Started
                    <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Organization Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Organization</h4>
              <ul className="space-y-3">
                <li>
                  <a href="https://raisingthevillage.org" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                    About RTV
                    <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="https://raisingthevillage.org/our-work" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                    Our Work
                    <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="https://raisingthevillage.org/our-impact" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                    Our Impact
                    <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="https://raisingthevillage.org/about-us" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                    Contact Us
                    <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-500 mb-4 md:mb-0">
                © {new Date().getFullYear()} Raising the Village (RTV). All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
