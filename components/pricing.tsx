"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Users, Building, User } from "lucide-react";

const PricingSection = () => {
  const tiers = [
    {
      name: "Individual",
      price: "$29",
      period: "per month",
      description: "Perfect for independent leaders and professionals",
      features: [
        "Personal leadership assessment",
        "Custom development plan",
        "Access to learning resources",
        "Monthly progress tracking",
      ],
      icon: <User className="h-6 w-6" />,
    },
    {
      name: "Team",
      price: "$99",
      period: "per month",
      description: "Ideal for small to medium-sized teams",
      features: [
        "All Individual features",
        "Team dynamics assessment",
        "Collaborative goal setting",
        "Peer feedback system",
        "Quarterly team reports",
      ],
      icon: <Users className="h-6 w-6" />,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us for pricing",
      description: "Tailored solutions for large organizations",
      features: [
        "All Team features",
        "Organization-wide analytics",
        "Integration with HR systems",
        "Dedicated account manager",
        "Customized training workshops",
        "Executive coaching sessions",
      ],
      icon: <Building className="h-6 w-6" />,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-indigo-950 bg-grid-indigo dark:bg-grid-white animate-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            <span className="block">
              Choose the right plan for your leadership journey
            </span>
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Unlock your leadership potential with our flexible pricing options
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-x-8"
        >
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className="flex flex-col justify-between h-full bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div>
                  <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-500 dark:to-blue-400 p-6">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-2xl font-semibold text-white">
                        {tier.name}
                      </span>
                      {tier.icon}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-baseline text-gray-900 dark:text-white">
                      <span className="text-5xl font-extrabold tracking-tight">
                        {tier.price}
                      </span>
                      <span className="ml-1 text-xl font-semibold">
                        {tier.period}
                      </span>
                    </div>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                      {tier.description}
                    </p>
                    <ul className="mt-6 space-y-4">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <div className="flex-shrink-0">
                            <Check className="h-6 w-6 text-green-500" />
                          </div>
                          <p className="ml-3 text-base text-gray-700 dark:text-gray-300">
                            {feature}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </div>
                <CardFooter className="px-6 py-8 bg-gray-50 dark:bg-gray-900">
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                    {tier.name === "Enterprise"
                      ? "Contact Sales"
                      : "Get Started"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
