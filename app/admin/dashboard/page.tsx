"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserIcon,
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CreditCardIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  department: string;
  createdAt: string;
}

interface Assessment {
  id: string;
  userId: string;
  responsibilityLevel: any;
  demographic: any;
  ratings: Rating[];
  plan: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
}

interface Rating {
  id: string;
  assessmentId: string;
  capability: string;
  rating: number;
  confidence: number;
  explanation: string | null;
  createdAt: string;
  updatedAt: string;
}

interface DevelopmentPlan {
  id: string;
  userId: string;
  title: string | null;
  description: string | null;
  plan: any;
  status: string;
  startDate: string | null;
  endDate: string | null;
  progress: number;
  priority: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

interface Consultant {
  id: string;
  companyName: string;
  website: string;
  user: User;
}

interface Subscription {
  id: string;
  planType: string;
  status: string;
  user: User;
}

interface MultiRaterAssessment {
  id: string;
  userId: string;
  user: User;
}

export default function AdminDashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [developmentPlans, setDevelopmentPlans] = useState<DevelopmentPlan[]>(
    []
  );
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [multiRater, setMultiRater] = useState<MultiRaterAssessment[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          usersRes,
          assessmentsRes,
          developmentPlansRes,
          consultantsRes,
          subscriptionsRes,
          multiRaterRes,
        ] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/assessments"),
          fetch("/api/admin/development-plans"),
          fetch("/api/admin/consultants"),
          fetch("/api/admin/subscriptions"),
          fetch("/api/admin/multi-rater"),
        ]);

        const [
          usersData,
          assessmentsData,
          developmentPlansData,
          consultantsData,
          subscriptionsData,
          multiRaterData,
        ] = await Promise.all([
          usersRes.json(),
          assessmentsRes.json(),
          developmentPlansRes.json(),
          consultantsRes.json(),
          subscriptionsRes.json(),
          multiRaterRes.json(),
        ]);

        setUsers(usersData);
        setAssessments(assessmentsData);
        setDevelopmentPlans(developmentPlansData);
        setConsultants(consultantsData);
        setSubscriptions(subscriptionsData);
        setMultiRater(multiRaterData);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoaded(true);
      }
    };

    fetchData();
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const StatCard = ({ title, count, icon: Icon }) => (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-blue-100 bg-opacity-75">
          <Icon className="h-8 w-8 text-blue-600" />
        </div>
        <div className="ml-5">
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h4 className="text-2xl font-bold text-gray-900">{count}</h4>
        </div>
      </div>
    </div>
  );

  const EmptyState = ({ message }) => (
    <div className="text-center py-12">
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total Users"
              count={users.length}
              icon={UserIcon}
            />
            <StatCard
              title="Assessments"
              count={assessments.length}
              icon={ClipboardDocumentCheckIcon}
            />
            <StatCard
              title="Development Plans"
              count={developmentPlans.length}
              icon={AcademicCapIcon}
            />
            <StatCard
              title="Consultants"
              count={consultants.length}
              icon={BriefcaseIcon}
            />
            <StatCard
              title="Active Subscriptions"
              count={subscriptions.length}
              icon={CreditCardIcon}
            />
            <StatCard
              title="Multi-Rater Assessments"
              count={multiRater.length}
              icon={UsersIcon}
            />
          </div>
        );

      case "users":
        return users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.department}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No users found" />
        );

      case "assessments":
        return assessments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ratings Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assessments.map((assessment) => (
                  <tr key={assessment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {assessment.user.name || assessment.user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {assessment.plan || "No plan"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {assessment.ratings.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(assessment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          assessment.ratings.length > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {assessment.ratings.length > 0 ? "Rated" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No assessments found" />
        );

      case "development-plans":
        return developmentPlans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {developmentPlans.map((plan) => (
                  <tr key={plan.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {plan.user.name || plan.user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {plan.title || "Untitled Plan"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          plan.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : plan.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {plan.status.replace("_", " ").charAt(0).toUpperCase() +
                          plan.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${plan.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {plan.progress}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          plan.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : plan.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {plan.priority.charAt(0).toUpperCase() +
                          plan.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No development plans found" />
        );

      // Add similar cases for other tabs...
      default:
        return <EmptyState message="Select a tab to view data" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your platform's data and users
            </p>
          </div>

          <div className="mb-6">
            <nav className="flex space-x-4">
              {[
                "overview",
                "users",
                "assessments",
                "development-plans",
                "consultants",
                "subscriptions",
                "multi-rater",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === tab
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:bg-blue-50"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1).replace("-", " ")}
                </button>
              ))}
            </nav>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
