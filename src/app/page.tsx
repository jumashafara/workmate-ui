"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bot, Brain, TrendingUp, Users, Shield, Zap, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  const availableFeatures = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI Chatbot System",
      description: "Comprehensive knowledge management and decision support system with AI capabilities for human-like responses",
      status: "available"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "ML Interpretability Dashboard",
      description: "Visual representation of program data drivers, outcomes, and progress with model analysis tools",
      status: "available"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Real-time Predictions",
      description: "Advanced data analytics and interpretation with real-time decision support functionality",
      status: "available"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Risk Assessment System",
      description: "Predictive analytics with early warnings and targeted interventions for household graduation programs",
      status: "available"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Multi-role Access",
      description: "Role-based access for RTV staff, area managers, project managers, and superusers",
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

      {/* Available Features */}
      <section className="py-16">
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
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Features */}
      <section className="py-16 bg-gray-50/50">
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

      {/* CTA Section */}
      <section className="py-20 bg-teal-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Impact?
          </h2>
          <p className="text-xl text-teal-100 mb-8 leading-relaxed">
            Join organizations worldwide using WorkMate to drive data-driven decisions 
            and maximize impact in poverty alleviation efforts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="bg-white text-teal-700 hover:bg-gray-100 shadow-lg px-8">
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-teal-700 px-8 bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Image 
                src="/RTV_Logo.png"
                alt="Raising the Village Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <h3 className="text-xl font-bold">WorkMate</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Empowering last-mile communities through AI-driven insights and analytics
            </p>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Raising the Village (RTV). All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
