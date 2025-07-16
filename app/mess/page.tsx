"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/use-auth';
import { createMessApi, createMockMessApi } from './lib/api';
import type { VendorPlanSummaryDto, VendorPlanSelectionSummaryDto } from './types';
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function FoodServicesPage() {
  const { fetchWithAuth } = useAuth();
  const [vendorPlans, setVendorPlans] = useState<VendorPlanSummaryDto[]>([]);
  const [userSelections, setUserSelections] = useState<VendorPlanSelectionSummaryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Uniworld');

  // Use real API for production
  const messApi = createMessApi(fetchWithAuth);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const plans = await messApi.vendorPlanApi.fetchAll();
        setVendorPlans(plans);
        
        // Fetch user's current selections (assuming userId = 1 for now)
        const selections = await messApi.userVendorPlanSelectionApi.fetchByUser(1);
        setUserSelections(selections);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const userCurrentPlan = userSelections[0]; // Assuming user has one active plan

  return (
    <DashboardLayout>
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-lg">Loading...</div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white px-6 py-8 -mx-6 -mt-6 mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Food Services</h1>
                  <p className="text-blue-100">Track your meal plan and preferences</p>
                </div>
                <div className="flex space-x-4">
                  <button className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition-colors">
                    June Mess Form
                  </button>
                  <a 
                    href="/mess/cart"
                    className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Go to Cart
                  </a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Monthly Mess Menu */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Monthly Mess Menu</h2>
                  {/* Vendor Tabs */}
                  <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    {['Uniworld', 'GSR', 'Other Vendor'].map((vendor) => (
                      <button
                        key={vendor}
                        onClick={() => setActiveTab(vendor)}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                          activeTab === vendor
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {vendor}
                      </button>
                    ))}
                  </div>

                {/* Menu Display */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                  <div className="bg-white dark:bg-gray-800 rounded border dark:border-gray-600 shadow-sm">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                      <h3 className="font-bold text-center text-gray-900 dark:text-white">
                        MENU (Wednesday, 4th September to Tuesday, 10th September 2024)
                      </h3>
                    </div>
                    
                    {/* Menu Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b dark:border-gray-600">
                            <th className="p-3 text-left font-semibold text-gray-900 dark:text-white">Date</th>
                            <th className="p-3 text-left font-semibold text-gray-900 dark:text-white">Breakfast</th>
                            <th className="p-3 text-left font-semibold text-gray-900 dark:text-white">Morning Snack</th>
                            <th className="p-3 text-left font-semibold text-gray-900 dark:text-white">Lunch</th>
                            <th className="p-3 text-left font-semibold text-gray-900 dark:text-white">Tea & Snack</th>
                            <th className="p-3 text-left font-semibold text-gray-900 dark:text-white">Dinner</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Sample menu rows */}
                          <tr className="border-b dark:border-gray-600">
                            <td className="p-3 font-medium text-gray-900 dark:text-white">Wednesday, 4th September 2024</td>
                            <td className="p-3 text-gray-700 dark:text-gray-300">Bread, Butter & Jam, Boiled Eggs, Milk with Boururnita, Tea</td>
                            <td className="p-3 text-gray-700 dark:text-gray-300">Fruits</td>
                            <td className="p-3 text-gray-700 dark:text-gray-300">Rice, Lehsa Masala, Seasonal Sabji, Chicken Fickle / Salad, Gulab Jamun</td>
                            <td className="p-3 text-gray-700 dark:text-gray-300">Jeera Kheer Paneer, Tea</td>
                            <td className="p-3 text-gray-700 dark:text-gray-300">Pav Bhaji, Tava Pulao, Boondii Raita, Papad</td>
                          </tr>
                          {/* Add more rows as needed */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                
                {userCurrentPlan ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        GR
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Gaura's Secret Recipe</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Selected plan: {userCurrentPlan.vendorPlanName} ({userCurrentPlan.mealTypes ? Array.from(userCurrentPlan.mealTypes).join(', ') : ''})
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Plan period: {userCurrentPlan.selectedMonth}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Veg
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        Non Veg
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        Egg
                      </span>
                    </div>
                    
                    <div className="pt-4 border-t dark:border-gray-600">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-gray-900 dark:text-white">Payment Status</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">May 2025: Paid</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No active plan selected</p>
                )}
              </div>

              {/* Mess Feedback */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Mess Feedback</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Please rate your experience below</p>
                
                <div className="flex space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="w-8 h-8 text-yellow-400 hover:text-yellow-500"
                    >
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">4/5 stars</span>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional feedback
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Your feedback..."
                  />
                </div>
                
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-800 transition-colors">
                  Submit feedback
                </button>
              </div>
            </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}