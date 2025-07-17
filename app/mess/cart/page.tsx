"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/use-auth';
import { createMessApi, createMockMessApi } from '../lib/api';
import type { VendorPlanSummaryDto, CartItem, DietPreference } from '../types';
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function MessCartPage() {
  const { fetchWithAuth } = useAuth();
  const [vendorPlans, setVendorPlans] = useState<VendorPlanSummaryDto[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState('Uniworld');
  const [dietPreferences, setDietPreferences] = useState<DietPreference[]>([
    { type: 'Veg', selected: true },
    { type: 'Non Veg', selected: false },
    { type: 'Egg', selected: false }
  ]);
  const [roomNumber, setRoomNumber] = useState('');
  const [sstMail, setSstMail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Use real API for production or mock for development
  const messApi = process.env.NODE_ENV === 'development' ? createMockMessApi() : createMessApi(fetchWithAuth);

  useEffect(() => {
    const loadVendorPlans = async () => {
      try {
        setIsLoading(true);
        const plans = await messApi.vendorPlanApi.fetchAll();
        setVendorPlans(plans);
      } catch (error) {
        console.error('Failed to load vendor plans:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVendorPlans();
  }, []);

  const addToCart = (plan: VendorPlanSummaryDto) => {
    const cartItem: CartItem = {
      vendorName: plan.vendorName,
      planName: plan.planName,
      fee: plan.fee,
      vendorPlanId: 0, // This would come from the plan data
      mealTypes: plan.mealTypes
    };

    setCartItems(prev => {
      // Remove existing item from same vendor and add new one
      const filtered = prev.filter(item => item.vendorName !== plan.vendorName);
      return [...filtered, cartItem];
    });
  };

  const removeFromCart = (vendorName: string) => {
    setCartItems(prev => prev.filter(item => item.vendorName !== vendorName));
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.fee, 0);

  const toggleDietPreference = (type: DietPreference['type']) => {
    setDietPreferences(prev =>
      prev.map(pref =>
        pref.type === type ? { ...pref, selected: !pref.selected } : pref
      )
    );
  };

  const handleSubmitPreference = async () => {
    if (cartItems.length === 0 || !roomNumber.trim() || !sstMail.trim()) {
      alert('Please fill all required fields and add items to cart');
      return;
    }

    try {
      // Here you would call the API to submit the vendor plan selection
      console.log('Submitting preference:', {
        cartItems,
        dietPreferences: dietPreferences.filter(p => p.selected),
        roomNumber,
        sstMail
      });

      alert('Preference submitted successfully!');
    } catch (error) {
      console.error('Failed to submit preference:', error);
      alert('Failed to submit preference. Please try again.');
    }
  };

  const vendorPlansForActiveTab = vendorPlans.filter(plan => plan.vendorName === activeTab);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-blue-50 dark:bg-[#161616] flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-blue-50 dark:bg-[#161616] py-6">
        {/* Header */}
        <div className="w-full max-w-6xl px-4 sm:px-8 mx-auto mb-6">
          <div className="bg-[linear-gradient(90.57deg,#2E4CEE_9.91%,#221EBF_53.29%,#040F75_91.56%)] px-6 py-6 rounded-2xl shadow-md">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-blue-100 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Mess Service Cart</h1>
            <p className="text-blue-100">Choose your meal plans and add them to cart</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-6xl px-4 sm:px-8 mx-auto">
          <div className="bg-white dark:bg-black rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            
            {/* Vendor Selection Tabs */}
            <div className="mb-8">
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                {['Uniworld', 'GSR', 'Other Vendor'].map((vendor) => (
                  <button
                    key={vendor}
                    onClick={() => setActiveTab(vendor)}
                    className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                      activeTab === vendor
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {vendor}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Plans */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {vendorPlansForActiveTab.map((plan, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{plan.planName}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{plan.mealTypes?.join(', ')}</p>
                      <p className="text-2xl font-bold text-blue-600 mb-4">₹ {plan.fee.toLocaleString()}</p>
                      <button
                        onClick={() => addToCart(plan)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>

                {/* Your Cart Section */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 8l-2-8m2 8v6a1 1 0 001 1h10a1 1 0 001-1v-6m-10 0h10" />
                      </svg>
                      Your Cart ({cartItems.length})
                    </h2>
                  </div>

                  {cartItems.length > 0 ? (
                    <div className="space-y-4">
                      {cartItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg"
                        >
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{item.vendorName}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{item.planName}</p>
                            <p className="text-lg font-bold text-blue-600">₹ {item.fee.toLocaleString()}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.vendorName)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 8l-2-8m2 8v6a1 1 0 001 1h10a1 1 0 001-1v-6m-10 0h10" />
                      </svg>
                      <p className="text-lg font-medium">Your cart is empty</p>
                      <p className="text-sm">Add meal plans from the options above</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Checkout */}
              <div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  <div className="flex items-center mb-6">
                    <svg className="w-5 h-5 mr-2 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Checkout Details</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Diet Preference */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Diet Preference</label>
                      <div className="flex space-x-3">
                        {dietPreferences.map((pref) => (
                          <button
                            key={pref.type}
                            onClick={() => toggleDietPreference(pref.type)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              pref.selected
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {pref.type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Room Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Room Number</label>
                      <input
                        type="text"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        placeholder="Enter your room number"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* SST Mail */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SST Mail</label>
                      <input
                        type="email"
                        value={sstMail}
                        onChange={(e) => setSstMail(e.target.value)}
                        placeholder="Enter student SST mail id"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Total Amount */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">Total Amount</span>
                        <span className="text-2xl font-bold text-blue-600">₹ {totalAmount.toLocaleString()}</span>
                      </div>

                      <button
                        onClick={handleSubmitPreference}
                        disabled={cartItems.length === 0 || !roomNumber.trim() || !sstMail.trim()}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-3 px-6 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-800 transition-colors"
                      >
                        Submit Preference
                      </button>

                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Note:</strong> Meal plan changes will be effective from the 1st of the next month.
                          You can make changes to your plan until the 25th of the current month.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
