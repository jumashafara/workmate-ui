"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bot, Brain, TrendingUp, Users, Shield, Zap, CheckCircle, Clock, MessageSquare, Activity, BarChart3, MapPin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { API_ENDPOINT } from "@/utils/endpoints";

interface InsightStats {
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
    avgIncome: 0,
    riskAlerts: 0,
    successRate: 0,
  });

  const fetchInsights = async () => {
    try {
      setLoading(true);
      // Fetch real data from the API
      const response = await fetch(`${API_ENDPOINT}/standard-evaluations/?limit=1000`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const result = await response.json();
      const predictions = result.predictions || result.results || [];
      
      if (predictions.length > 0) {
        const regions = new Set(predictions.map((p: any) => p.region)).size;
        const districts = new Set(predictions.map((p: any) => p.district)).size;
        const households = predictions.length;
        const avgIncome = predictions.reduce((sum: number, p: any) => sum + (p.predicted_income || 0), 0) / predictions.length;
        const riskAlerts = predictions.filter((p: any) => p.prediction === 0).length;
        const successRate = ((households - riskAlerts) / households * 100);
        
        setStats({
          totalHouseholds: households,
          totalRegions: regions,
          totalDistricts: districts,
          avgIncome: avgIncome,
          riskAlerts: riskAlerts,
          successRate: successRate,
        });
      } else {
        throw new Error('No data received from API');
      }
    } catch (error) {
      console.error("Failed to fetch insights:", error);
      // Keep stats at zero/empty state when API fails
      setStats({
        totalHouseholds: 0,
        totalRegions: 0,
        totalDistricts: 0,
        avgIncome: 0,
        riskAlerts: 0,
        successRate: 0,
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
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Image 
                src="/RTV_Logo.png"
                alt="Raising the Village Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <h1 className="text-2xl font-bold text-teal-700">
                WorkMate
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/sign-in">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
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
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-100 text-teal-800 text-sm font-medium mb-8">
              <Zap className="w-4 h-4 mr-2" />
              RTV Work Mate - AI-Powered Analytics Platform
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Transforming{" "}
              <span className="text-teal-700">
                Insights into Impact
              </span>
              <br />
              for Last-Mile Communities
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              A comprehensive, integrated AI platform that unifies chatbot, risk assessment tools, 
              machine learning models, and other AI projects into a single, coherent system for 
              poverty alleviation efforts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg px-8">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/chat">
                <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8">
                  Try WorkMate
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

      {/* Real-time Insights Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-100 text-teal-800 text-sm font-medium mb-4">
              <Activity className="w-4 h-4 mr-2" />
              Live Analytics
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Real-time Impact Insights</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See WorkMate's analytics in action with live data from our poverty alleviation programs
            </p>
          </div>
          
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
          ) : stats.totalHouseholds === 0 ? (
            <div className="text-center py-12">
              <div className="flex items-center justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Currently Unavailable</h3>
              <p className="text-gray-600 mb-6">
                Unable to fetch live analytics data. Please try refreshing the page or check back later.
              </p>
              <Button 
                onClick={fetchInsights} 
                variant="outline" 
                className="hover:bg-teal-50 hover:border-teal-300"
              >
                <Activity className="h-4 w-4 mr-2" />
                Retry Loading Data
              </Button>
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
                        {stats.totalHouseholds.toLocaleString()}
                      </p>
                      <p className="text-xs text-blue-600">Being monitored</p>
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
                      <p className="text-2xl font-bold text-gray-900">{stats.totalRegions}</p>
                      <p className="text-xs text-green-600">{stats.totalDistricts} districts</p>
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
                      <p className="text-sm font-medium text-gray-600">Avg Income + Production</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${stats.avgIncome >= 100 ? Math.round(stats.avgIncome).toLocaleString() : stats.avgIncome.toFixed(2)}
                      </p>
                      <p className="text-xs text-purple-600">Per household</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <AlertCircle className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Achievement Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.successRate.toFixed(1)}%</p>
                      <p className="text-xs text-orange-600">{stats.riskAlerts} at risk</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Live Data Status */}
          {!loading && stats.totalHouseholds > 0 && (
            <Card className="bg-teal-50 border-teal-200 mb-12">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Activity className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-teal-900 mb-1">
                      Live Data Pipeline
                    </h4>
                    <p className="text-sm text-teal-700">
                      These insights are pulled directly from WorkMate's AI analytics system, 
                      processing real data from {stats.totalHouseholds.toLocaleString()} households across {stats.totalRegions} regions.
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Live
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}


        </div>
      </section>

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
                  <Link href="/cluster-trends" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                    <Shield className="w-4 h-4 mr-2" />
                    Risk Assessment
                    <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link href="/sign-up" className="text-gray-400 hover:text-white transition-colors flex items-center group">
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
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  PEAL Department
                </span>
                <span className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics Unit
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
