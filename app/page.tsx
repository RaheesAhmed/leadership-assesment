"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Sparkles,
  BarChart2,
  Users,
  Target,
  Brain,
  CheckCircle,
  Star,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const staggerChildren = {
    animate: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-indigo-950 font-sans overflow-x-hidden perspective-1000 bg-grid-indigo dark:bg-grid-white animate-gradient">
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              className="flex-1 space-y-8"
              initial="initial"
              animate="animate"
              variants={staggerChildren}
            >
              <motion.div
                variants={fadeIn}
                className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400"
              >
                <Sparkles className="w-4 h-4 animate-spin-slow" />
                <span className="text-sm font-medium">
                  AI-Powered Assessment Platform
                </span>
              </motion.div>
              <motion.h1
                variants={fadeIn}
                className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight"
              >
                <span className="bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent animate-gradient">
                  Transform Your
                </span>
                <br />
                Leadership Journey
              </motion.h1>
              <motion.p
                variants={fadeIn}
                className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl"
              >
                Unlock your leadership potential with our AI-driven assessment
                tool. Get personalized insights and development plans tailored
                to your role.
              </motion.p>
              <motion.div
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-3 rounded-lg transition-all duration-300 group hover:shadow-lg hover:-translate-y-1">
                  Start Assessment
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                <Button
                  variant="outline"
                  className="text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 text-lg px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
            <div className="flex-1 relative h-[600px] w-full mt-12 md:mt-0">
              <motion.div
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="perspective-1000"
              >
                <Card className="absolute top-0 right-0 w-72 md:w-80 transform hover:-translate-y-2 hover:rotate-3 transition-all duration-300 bg-white dark:bg-gray-800 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900">
                        <BarChart2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                          Leadership Score
                        </h3>
                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          92/100
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        "Strategic Thinking",
                        "Team Management",
                        "Decision Making",
                      ].map((skill, index) => (
                        <motion.div
                          key={skill}
                          className="flex items-center justify-between"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{
                            duration: 0.5,
                            delay: 0.5 + index * 0.1,
                          }}
                        >
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {skill}
                          </span>
                          <div className="w-32 h-2 rounded-full bg-indigo-100 dark:bg-indigo-900">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 animate-gradient"
                              initial={{ width: 0 }}
                              animate={{ width: "85%" }}
                              transition={{
                                duration: 0.5,
                                delay: 0.8 + index * 0.1,
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50, rotateX: 15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="perspective-1000"
              >
                <Card className="absolute top-32 left-0 md:left-12 w-64 md:w-72 transform hover:-translate-y-2 hover:rotate-3 transition-all duration-300 bg-white dark:bg-gray-800 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      Key Strengths
                    </h3>
                    <div className="space-y-4">
                      {[
                        { strength: "Team Building", score: 95 },
                        { strength: "Strategic Vision", score: 88 },
                        { strength: "Innovation", score: 92 },
                      ].map((item, index) => (
                        <motion.div
                          key={item.strength}
                          className="space-y-1"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.6 + index * 0.1,
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {item.strength}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                              {item.score}%
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-indigo-100 dark:bg-indigo-900">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 animate-gradient"
                              initial={{ width: 0 }}
                              animate={{ width: `${item.score}%` }}
                              transition={{
                                duration: 0.5,
                                delay: 0.8 + index * 0.1,
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="perspective-1000"
              >
                <Card className="absolute bottom-0 right-0 md:right-12 w-80 md:w-96 transform hover:-translate-y-2 hover:rotate-3 transition-all duration-300 bg-white dark:bg-gray-800 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      Development Focus Areas
                    </h3>
                    <div className="space-y-4">
                      {[
                        { area: "Strategic Planning", progress: 75 },
                        { area: "Team Empowerment", progress: 85 },
                        { area: "Change Management", progress: 65 },
                      ].map((item, index) => (
                        <div key={item.area}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-300">
                              {item.area}
                            </span>
                            <span className="text-indigo-600 dark:text-indigo-400">
                              {item.progress}%
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-indigo-100 dark:bg-indigo-900">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 animate-gradient"
                              initial={{ width: 0 }}
                              animate={{ width: `${item.progress}%` }}
                              transition={{
                                duration: 0.5,
                                delay: 0.8 + index * 0.1,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent animate-gradient">
              Comprehensive Leadership Development
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Our platform provides everything you need to assess and improve
              your leadership capabilities
            </p>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: <Brain />,
                title: "AI Analysis",
                description: "Get deep insights powered by advanced AI",
              },
              {
                icon: <Target />,
                title: "Custom Plans",
                description: "Receive personalized development roadmaps",
              },
              {
                icon: <Users />,
                title: "Team Insights",
                description: "Understand and improve team dynamics",
              },
              {
                icon: <BarChart2 />,
                title: "Progress Tracking",
                description: "Monitor your leadership growth",
              },
              {
                icon: <Star />,
                title: "Best Practices",
                description: "Learn from proven leadership frameworks",
              },
              {
                icon: <ArrowUpRight />,
                title: "Continuous Growth",
                description: "Regular assessments and updates",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="hover:shadow-xl transition-all duration-300 group cursor-pointer bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-950 hover:-translate-y-2 hover:rotate-1">
                  <CardContent className="p-6">
                    <div className="mb-4 p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900 w-fit group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800 transition-colors duration-300">
                      <div className="text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="font-semibold text-xl mb-2 text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="">
        <div className="max-w-full mx-auto px-4 bg-gradient-to-r from-indigo-600 to-blue-500">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-6">
                  Ready to Start Your Leadership Journey?
                </h2>
                <p className="text-xl mb-8 text-indigo-100">
                  Join thousands of professionals who have transformed their
                  leadership capabilities with our platform.
                </p>
                <Link href="/signup">
                  <Button className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-6 text-lg">
                    Start Free Assessment
                  </Button>
                </Link>
              </div>
            </section>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
