import React from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const UpgradeModal = ({ isOpen, onClose, feature, currentPlan, availablePlans }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    onClose();
    navigate('/billing');
  };

  const getFeatureMessage = (feature) => {
    switch (feature) {
      case 'project':
        return 'You\'ve reached your project limit. Upgrade to create more projects.';
      case 'customDomain':
        return 'Custom domains are available with Pro and Team plans.';
      case 'codeExport':
        return 'Code export is available with Pro and Team plans.';
      case 'cms':
        return 'CMS features are available with the Team plan.';
      case 'collaboration':
        return 'Team collaboration is available with the Team plan.';
      case 'storage':
        return 'You\'ve reached your storage limit. Upgrade for more space.';
      default:
        return 'This feature requires a plan upgrade.';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <StarIcon className="w-6 h-6 text-yellow-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Upgrade Required</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              {getFeatureMessage(feature)}
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Current Plan:</strong> {currentPlan?.toUpperCase() || 'FREE'}
              </p>
              {availablePlans && availablePlans.length > 0 && (
                <p className="text-sm text-blue-800 mt-1">
                  <strong>Available in:</strong> {availablePlans.map(plan => plan.toUpperCase()).join(', ')}
                </p>
              )}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Maybe Later
            </button>
            <button
              onClick={handleUpgrade}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Upgrade Now
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UpgradeModal;
