import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCardIcon, 
  CheckIcon, 
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'react-toastify';

const BillingPage = () => {
  const { user, token } = useAuthStore();
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState({});
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const [subscriptionRes, plansRes, usageRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/billing/subscription`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${process.env.REACT_APP_API_URL}/billing/plans`),
        fetch(`${process.env.REACT_APP_API_URL}/billing/usage`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const subscriptionData = await subscriptionRes.json();
      const plansData = await plansRes.json();
      const usageData = await usageRes.json();

      if (subscriptionData.success) setSubscription(subscriptionData.subscription);
      if (plansData.success) setPlans(plansData.plans);
      if (usageData.success) setUsage(usageData.usage);
    } catch (error) {
      console.error('Error fetching billing data:', error);
      toast.error('Failed to load billing information');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/billing/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ planId })
      });

      const data = await response.json();
      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start upgrade process');
    } finally {
      setActionLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/billing/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || 'Failed to access billing portal');
      }
    } catch (error) {
      console.error('Error accessing billing portal:', error);
      toast.error('Failed to access billing portal');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/billing/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ cancelAtPeriodEnd: true })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchBillingData();
      } else {
        toast.error(data.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/billing/reactivate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchBillingData();
      } else {
        toast.error(data.message || 'Failed to reactivate subscription');
      }
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      toast.error('Failed to reactivate subscription');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Billing & Subscription
          </h1>
          <p className="text-xl text-gray-600">
            Manage your subscription and billing information
          </p>
        </div>

        {/* Current Subscription Status */}
        {subscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Current Plan</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                subscription.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {plans[subscription.plan]?.name || subscription.plan.toUpperCase()}
                </h3>
                <p className="text-gray-600 mb-4">
                  ${plans[subscription.plan]?.price || 0}/month
                </p>
                
                {subscription.cancelAtPeriodEnd && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
                      <p className="text-yellow-800">
                        Your subscription will be cancelled on{' '}
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {subscription.currentPeriodEnd && (
                    <p className="text-sm text-gray-600">
                      Next billing: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {subscription.plan !== 'free' && (
                  <button
                    onClick={handleManageBilling}
                    disabled={actionLoading}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Manage Billing
                  </button>
                )}
                
                {subscription.cancelAtPeriodEnd ? (
                  <button
                    onClick={handleReactivate}
                    disabled={actionLoading}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    Reactivate Subscription
                  </button>
                ) : subscription.plan !== 'free' && (
                  <button
                    onClick={handleCancelSubscription}
                    disabled={actionLoading}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    Cancel Subscription
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Usage Statistics */}
        {usage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Usage Statistics</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Projects</span>
                  <span className="text-sm text-gray-500">
                    {usage.projects.used}/{usage.projects.limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      usage.projects.percentage > 80 ? 'bg-red-600' :
                      usage.projects.percentage > 60 ? 'bg-yellow-600' : 'bg-green-600'
                    }`}
                    style={{ width: `${Math.min(usage.projects.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Storage</span>
                  <span className="text-sm text-gray-500">
                    {usage.storage.used}MB/{usage.storage.limit}MB
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      usage.storage.percentage > 80 ? 'bg-red-600' :
                      usage.storage.percentage > 60 ? 'bg-yellow-600' : 'bg-green-600'
                    }`}
                    style={{ width: `${Math.min(usage.storage.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Pricing Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-lg text-gray-600">
              Upgrade or downgrade your subscription at any time
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(plans).map(([planId, plan]) => (
              <motion.div
                key={planId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`relative rounded-lg border-2 p-6 ${
                  subscription?.plan === planId
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {subscription?.plan === planId && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    ${plan.price}
                    <span className="text-lg font-normal text-gray-600">/month</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  {subscription?.plan === planId ? (
                    <div className="w-full bg-gray-100 text-gray-500 px-4 py-2 rounded-lg text-center font-medium">
                      Current Plan
                    </div>
                  ) : planId === 'free' ? (
                    <button
                      onClick={() => handleUpgrade('free')}
                      disabled={actionLoading}
                      className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 font-medium"
                    >
                      Downgrade to Free
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(planId)}
                      disabled={actionLoading}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                    >
                      {subscription?.plan === 'free' ? 'Upgrade' : 'Change Plan'}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BillingPage;
