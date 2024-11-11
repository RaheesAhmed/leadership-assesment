"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Save, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [demographic, setDemographic] = useState<Demographic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Demographic | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/users/demographics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update");

      setDemographic(formData);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Demographics updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update demographics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const renderForm = () => (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid gap-6 md:grid-cols-2"
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select
            value={formData?.industry}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev!, industry: value }))
            }
          >
            <SelectTrigger id="industry">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companySize">Company Size</Label>
          <Select
            value={formData?.companySize}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev!, companySize: value }))
            }
          >
            <SelectTrigger id="companySize">
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-50">1-50 employees</SelectItem>
              <SelectItem value="51-200">51-200 employees</SelectItem>
              <SelectItem value="201-1000">201-1000 employees</SelectItem>
              <SelectItem value="1001+">1001+ employees</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Add similar Select components for other fields */}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Select
            value={formData?.jobTitle}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev!, jobTitle: value }))
            }
          >
            <SelectTrigger id="jobTitle">
              <SelectValue placeholder="Select job title" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="director">Director</SelectItem>
              <SelectItem value="vp">Vice President</SelectItem>
              <SelectItem value="c-level">C-Level Executive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="decisionLevel">Decision Making Level</Label>
          <Select
            value={formData?.decisionLevel}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev!, decisionLevel: value }))
            }
          >
            <SelectTrigger id="decisionLevel">
              <SelectValue placeholder="Select decision level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual Contributor</SelectItem>
              <SelectItem value="team">Team Level</SelectItem>
              <SelectItem value="department">Department Level</SelectItem>
              <SelectItem value="organization">Organization Level</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="md:col-span-2 flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsEditing(false)}
          disabled={loading}
        >
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>
    </motion.form>
  );

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
          {!isEditing && (
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => {
                setFormData(demographic);
                setIsEditing(true);
              }}
            >
              Edit Demographics
            </Button>
          )}
        </motion.div>

        <Card className="bg-white dark:bg-gray-800 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-6 rounded-t-xl">
            <CardTitle className="text-2xl font-bold">
              Your Demographic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isEditing ? (
              renderForm()
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
