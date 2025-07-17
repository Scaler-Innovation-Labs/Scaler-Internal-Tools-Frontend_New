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
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  // Use mock API for development or real API for production
  const messApi = process.env.NODE_ENV === 'development' ? createMockMessApi() : createMessApi(fetchWithAuth);

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

  const handleSubmitFeedback = async () => {
    if (!feedback.trim() || rating === 0) {
      alert('Please provide both rating and feedback');
      return;
    }

    try {
      // Submit feedback and review
      await messApi.reviewApi.create({
        vendorPlanId: 1, // This would come from the selected plan
        userId: 1, // This would come from auth context
        review: feedback,
        rating: rating
      });

      alert('Feedback submitted successfully!');
      setFeedback('');
      setRating(0);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-blue-50 dark:bg-[#161616] py-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-lg">Loading...</div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="w-full max-w-6xl px-4 sm:px-8 mx-auto mb-6">
              <div className="bg-[linear-gradient(90.57deg,#2E4CEE_9.91%,#221EBF_53.29%,#040F75_91.56%)] px-6 py-6 rounded-2xl shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Food Services</h1>
                    <p className="text-blue-100">Track your meal plan and preferences</p>
                  </div>
                  <div className="flex space-x-3">
                    <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium text-white transition-colors">
                      June Mess Form
                    </button>
                    <a 
                      href="/mess/cart"
                      className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-medium text-white transition-colors"
                    >
                      Go to Cart
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-6xl px-4 sm:px-8 mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column - Menu */}
                <div className="lg:col-span-2">
                  {/* Monthly Mess Menu */}
                  <div className="bg-white dark:bg-black rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Monthly Mess Menu</h2>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-blue-600 font-medium">{activeTab}</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-600 dark:text-gray-400">GSR</span>
                      </div>
                    </div>
                    
                    {/* Menu Display */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-800">
                      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 shadow-sm">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                          <h3 className="font-bold text-center text-gray-900 dark:text-white text-sm">
                            MENU (Wednesday, 4th September to Tuesday, 10th September 2024)
                          </h3>
                        </div>
                        
                        {/* Simplified Menu Table for better mobile experience */}
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Breakfast</h4>
                              <p className="text-gray-700 dark:text-gray-300">Bread, Butter & Jam, Poha, Boiled Eggs, Milk with Bournvita, Tea</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Lunch</h4>
                              <p className="text-gray-700 dark:text-gray-300">Rice, Rajma Masala, Seasonal Salad, Chapati, Pickle/Salad, Curd/Sambar</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Dinner</h4>
                              <p className="text-gray-700 dark:text-gray-300">Pav Bhaji, Tawa Pulao, Moong Dal, Pickle/Papad</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Quick Stats & Feedback */}
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="bg-white dark:bg-black rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                    
                    {userCurrentPlan ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-lg">GR</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Gaura's Secret Recipe</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Selected plan: {userCurrentPlan.vendorPlanName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Plan period: {userCurrentPlan.selectedMonth}</p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                            Veg
                          </span>
                          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                            Non Veg
                          </span>
                          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                            Egg
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                          <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Payment Status</p>
                            <p className="text-sm text-green-600">May 2025: Paid</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">No active plan selected</p>
                    )}
                  </div>

                  {/* Mess Feedback */}
                  <div className="bg-white dark:bg-black rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Mess Feedback</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Please rate your experience below</p>
                    
                    {/* Star Rating */}
                    <div className="flex items-center space-x-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`w-8 h-8 ${
                            star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                          } hover:text-yellow-400 transition-colors`}
                        >
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{rating}/5 stars</span>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Additional feedback
                      </label>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Your feedback..."
                      />
                    </div>
                    
                    <button 
                      onClick={handleSubmitFeedback}
                      disabled={!feedback.trim() || rating === 0}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit feedback
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}