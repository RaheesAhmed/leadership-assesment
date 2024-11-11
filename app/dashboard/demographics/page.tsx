"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Edit, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

interface Demographic {
  industry: string;
  companySize: string;
  department: string;
  jobTitle: string;
  directReports: string;
  decisionLevel: string;
  typicalProject: string;
  levelsToCEO: string;
  managesBudget: string;
}

export default function DemographicsPage() {
  const { isAuthenticated } = useAuth();
  const [demographic, setDemographic] = useState<Demographic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDemographic = async () => {
      try {
        const response = await fetch("/api/users/assessments");
        const data = await response.json();
        setDemographic(data.demographic);
      } catch (error) {
        setError("Failed to load demographic information");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchDemographic();
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-indigo-950">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-indigo-950 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-4xl font-bold text-indigo-900 dark:text-indigo-100">
            Demographics
          </h1>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Edit className="mr-2 h-4 w-4" /> Edit Demographics
          </Button>
        </motion.div>

        <Card className="bg-white dark:bg-gray-800 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-6 rounded-t-xl">
            <CardTitle className="text-2xl font-bold">
              Your Demographic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {demographic ? (
              <motion.div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {Object.entries(demographic).map(([key, value]) => (
                  <motion.div
                    key={key}
                    className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg shadow-md"
                    variants={itemVariants}
                  >
                    <h3 className="font-medium text-indigo-900 dark:text-indigo-200 mb-2">
                      {key.charAt(0).toUpperCase() +
                        key
                          .slice(1)
                          .replace(/([A-Z])/g, " $1")
                          .trim()}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">{value}</p>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-600 dark:text-gray-400 py-8"
              >
                No demographic information available
              </motion.p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
