"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Briefcase,
  FileText,
  TrendingUp,
  ChevronRight,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StylishDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data for demonstration
  const data = [
    { name: "Jan", value: 85 },
    { name: "Feb", value: 78 },
    { name: "Mar", value: 92 },
    { name: "Apr", value: 88 },
    { name: "May", value: 95 },
    { name: "Jun", value: 89 },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-indigo-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-indigo-900 dark:text-indigo-100">
            Leadership Dashboard
          </h1>
          <p className="text-xl text-indigo-700 dark:text-indigo-300 mt-2">
            Track your progress and development
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Profile Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-6 rounded-t-xl">
                <CardTitle className="flex items-center text-2xl">
                  <User className="w-6 h-6 mr-2" />
                  Profile Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Level
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                      Senior Leader
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Team Size
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                      15 members
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Experience
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                      8 years
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Skills Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-xl">
                <CardTitle className="flex items-center text-2xl">
                  <Briefcase className="w-6 h-6 mr-2" />
                  Key Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Strategic Planning
                    </span>
                    <div className="flex">
                      {[1, 2, 3, 4].map((star) => (
                        <Star
                          key={star}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                      <Star className="w-5 h-5 text-yellow-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Team Leadership
                    </span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Communication
                    </span>
                    <div className="flex">
                      {[1, 2, 3, 4].map((star) => (
                        <Star
                          key={star}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                      <Star className="w-5 h-5 text-yellow-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Growth Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-t-xl">
                <CardTitle className="flex items-center text-2xl">
                  <TrendingUp className="w-6 h-6 mr-2" />
                  Growth Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#4F46E5"
                        strokeWidth={2}
                        dot={{ fill: "#4F46E5", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex justify-center space-x-4"
        >
          <Button className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center">
            Start Assessment
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center">
            View Development Plan
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default StylishDashboard;
