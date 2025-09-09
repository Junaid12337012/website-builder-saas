import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export const useSubscription = () => {
  const { token } = useAuthStore();
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!token) return;
    
    try {
      const [subscriptionRes, usageRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/billing/subscription`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${process.env.REACT_APP_API_URL}/billing/usage`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const subscriptionData = await subscriptionRes.json();
      const usageData = await usageRes.json();

      if (subscriptionData.success) setSubscription(subscriptionData.subscription);
      if (usageData.success) setUsage(usageData.usage);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [token]);

  const canCreateProject = () => {
    if (!subscription || !usage) return true;
    return usage.projects.used < subscription.limits.projects;
  };

  const canUseCustomDomain = () => {
    if (!subscription) return false;
    return subscription.limits.customDomain;
  };

  const canExportCode = () => {
    if (!subscription) return false;
    return subscription.limits.codeExport;
  };

  const canUseCMS = () => {
    if (!subscription) return false;
    return subscription.limits.cms;
  };

  const canCollaborate = () => {
    if (!subscription) return false;
    return subscription.limits.collaboration;
  };

  const hasStorageSpace = (sizeInMB = 0) => {
    if (!subscription || !usage) return true;
    return (usage.storage.used + sizeInMB) <= subscription.limits.storage;
  };

  const getStoragePercentage = () => {
    if (!usage) return 0;
    return usage.storage.percentage;
  };

  const getProjectsPercentage = () => {
    if (!usage) return 0;
    return usage.projects.percentage;
  };

  return {
    subscription,
    usage,
    loading,
    refetch: fetchSubscription,
    canCreateProject,
    canUseCustomDomain,
    canExportCode,
    canUseCMS,
    canCollaborate,
    hasStorageSpace,
    getStoragePercentage,
    getProjectsPercentage
  };
};
