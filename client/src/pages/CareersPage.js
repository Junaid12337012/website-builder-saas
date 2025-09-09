import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Users, 
  ArrowRight,
  Briefcase,
  Heart,
  Coffee,
  Zap,
  Code,
  Palette,
  BarChart3,
  Headphones,
  Globe,
  Star,
  CheckCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CareersPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departments = [
    { id: 'all', name: 'All Positions', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'engineering', name: 'Engineering', icon: <Code className="w-4 h-4" /> },
    { id: 'design', name: 'Design', icon: <Palette className="w-4 h-4" /> },
    { id: 'marketing', name: 'Marketing', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'support', name: 'Support', icon: <Headphones className="w-4 h-4" /> },
    { id: 'sales', name: 'Sales', icon: <Users className="w-4 h-4" /> }
  ];

  const jobOpenings = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'engineering',
      location: 'San Francisco, CA / Remote',
      type: 'Full-time',
      experience: '5+ years',
      description: 'Join our engineering team to build the next generation of web building tools.',
      requirements: ['React/JavaScript expertise', 'CSS/HTML mastery', 'API integration experience'],
      featured: true
    },
    {
      id: 2,
      title: 'Product Designer',
      department: 'design',
      location: 'San Francisco, CA / Remote',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Shape the user experience of our drag-and-drop website builder.',
      requirements: ['UI/UX design skills', 'Figma proficiency', 'User research experience'],
      featured: false
    },
    {
      id: 3,
      title: 'DevOps Engineer',
      department: 'engineering',
      location: 'Remote',
      type: 'Full-time',
      experience: '4+ years',
      description: 'Scale our infrastructure to serve millions of websites worldwide.',
      requirements: ['AWS/Cloud experience', 'Docker/Kubernetes', 'CI/CD pipelines'],
      featured: false
    },
    {
      id: 4,
      title: 'Customer Success Manager',
      department: 'support',
      location: 'San Francisco, CA',
      type: 'Full-time',
      experience: '2+ years',
      description: 'Help our customers succeed with their website building journey.',
      requirements: ['Customer service excellence', 'SaaS experience', 'Problem-solving skills'],
      featured: true
    },
    {
      id: 5,
      title: 'Growth Marketing Specialist',
      department: 'marketing',
      location: 'Remote',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Drive user acquisition and retention through data-driven marketing.',
      requirements: ['Digital marketing expertise', 'Analytics proficiency', 'A/B testing experience'],
      featured: false
    }
  ];

  const benefits = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance, dental, vision, and wellness programs'
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: 'Flexible Work',
      description: 'Remote-first culture with flexible hours and unlimited PTO'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Growth & Learning',
      description: 'Professional development budget and conference attendance'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Great Team',
      description: 'Work with talented, passionate people who love what they do'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Impact',
      description: 'Help millions of people build their online presence'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Equity & Bonuses',
      description: 'Competitive salary, equity package, and performance bonuses'
    }
  ];

  const filteredJobs = jobOpenings.filter(job => 
    selectedDepartment === 'all' || job.department === selectedDepartment
  );

  const JobCard = ({ job }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {job.title}
            </h3>
            {job.featured && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                Featured
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Briefcase className="w-4 h-4" />
              <span>{job.experience}</span>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">{job.description}</p>
          
          <div className="space-y-2 mb-4">
            <p className="text-sm font-medium text-gray-900">Key Requirements:</p>
            {job.requirements.map((req, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">{req}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
          {departments.find(dept => dept.id === job.department)?.name}
        </span>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          <span>Apply Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Team
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-8">
              Help us democratize web development and empower millions of people 
              to build their online presence without code.
            </p>
            <div className="flex items-center justify-center space-x-8 text-primary-100">
              <div className="text-center">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">15+</div>
                <div className="text-sm">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm">Remote Friendly</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Work With Us?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We believe in creating an environment where everyone can do their best work.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary-600">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Openings */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Open Positions</h2>
            <p className="text-xl text-gray-600">
              Find your next opportunity and help shape the future of web development.
            </p>
          </motion.div>

          {/* Department Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDepartment === dept.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {dept.icon}
                <span>{dept.name}</span>
              </button>
            ))}
          </div>

          {/* Job Listings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No positions available</h3>
              <p className="text-gray-600">Check back soon for new opportunities!</p>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Don't See the Right Role?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We're always looking for talented people to join our team. 
              Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <button className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
              Send Your Resume
            </button>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CareersPage;
