const express = require('express');
const axios = require('axios');
const Project = require('../models/Project');
const { auth, projectOwner } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/publish/netlify/:id
// @desc    Publish project to Netlify
// @access  Private
router.post('/netlify/:id', auth, projectOwner, async (req, res) => {
  try {
    const project = req.project;
    const { siteName, customDomain } = req.body;
    
    if (!process.env.NETLIFY_ACCESS_TOKEN) {
      return res.status(400).json({ message: 'Netlify integration not configured' });
    }
    
    // Generate HTML for deployment
    const { generateHTML } = require('./export');
    const html = generateHTML(project, { includeCSS: true });
    
    // Create or update Netlify site
    const netlifyResponse = await deployToNetlify(html, {
      siteName: siteName || project.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      customDomain,
      accessToken: process.env.NETLIFY_ACCESS_TOKEN
    });
    
    // Update project with published info
    project.published = {
      isPublished: true,
      url: netlifyResponse.url,
      platform: 'netlify',
      publishedAt: project.published.publishedAt || new Date(),
      lastPublishedAt: new Date()
    };
    
    project.addToHistory('published_netlify', {
      url: netlifyResponse.url,
      siteName,
      publishedBy: req.user.email
    });
    
    await project.save();
    
    res.json({
      message: 'Successfully published to Netlify',
      url: netlifyResponse.url,
      deployId: netlifyResponse.deployId
    });
  } catch (error) {
    console.error('Netlify publish error:', error);
    res.status(500).json({ 
      message: 'Failed to publish to Netlify',
      error: error.response?.data?.message || error.message
    });
  }
});

// @route   POST /api/publish/vercel/:id
// @desc    Publish project to Vercel
// @access  Private
router.post('/vercel/:id', auth, projectOwner, async (req, res) => {
  try {
    const project = req.project;
    const { projectName, customDomain } = req.body;
    
    if (!process.env.VERCEL_ACCESS_TOKEN) {
      return res.status(400).json({ message: 'Vercel integration not configured' });
    }
    
    // Generate HTML for deployment
    const { generateHTML } = require('./export');
    const html = generateHTML(project, { includeCSS: true });
    
    // Deploy to Vercel
    const vercelResponse = await deployToVercel(html, {
      projectName: projectName || project.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      customDomain,
      accessToken: process.env.VERCEL_ACCESS_TOKEN
    });
    
    // Update project with published info
    project.published = {
      isPublished: true,
      url: vercelResponse.url,
      platform: 'vercel',
      publishedAt: project.published.publishedAt || new Date(),
      lastPublishedAt: new Date()
    };
    
    project.addToHistory('published_vercel', {
      url: vercelResponse.url,
      projectName,
      publishedBy: req.user.email
    });
    
    await project.save();
    
    res.json({
      message: 'Successfully published to Vercel',
      url: vercelResponse.url,
      deploymentId: vercelResponse.deploymentId
    });
  } catch (error) {
    console.error('Vercel publish error:', error);
    res.status(500).json({ 
      message: 'Failed to publish to Vercel',
      error: error.response?.data?.error?.message || error.message
    });
  }
});

// @route   GET /api/publish/status/:id
// @desc    Get publish status for project
// @access  Private
router.get('/status/:id', auth, projectOwner, async (req, res) => {
  try {
    const project = req.project;
    
    if (!project.published.isPublished) {
      return res.json({ 
        isPublished: false,
        message: 'Project has not been published yet'
      });
    }
    
    let status = 'unknown';
    let lastChecked = new Date();
    
    // Check deployment status based on platform
    if (project.published.platform === 'netlify') {
      status = await checkNetlifyStatus(project.published.url);
    } else if (project.published.platform === 'vercel') {
      status = await checkVercelStatus(project.published.url);
    }
    
    res.json({
      isPublished: true,
      platform: project.published.platform,
      url: project.published.url,
      publishedAt: project.published.publishedAt,
      lastPublishedAt: project.published.lastPublishedAt,
      status,
      lastChecked
    });
  } catch (error) {
    console.error('Get publish status error:', error);
    res.status(500).json({ message: 'Failed to get publish status' });
  }
});

// @route   DELETE /api/publish/:id
// @desc    Unpublish project
// @access  Private
router.delete('/:id', auth, projectOwner, async (req, res) => {
  try {
    const project = req.project;
    
    if (!project.published.isPublished) {
      return res.status(400).json({ message: 'Project is not published' });
    }
    
    // Note: This doesn't actually delete from hosting platforms
    // In a real implementation, you'd call the platform APIs to delete
    
    project.published = {
      isPublished: false,
      url: '',
      platform: null,
      publishedAt: null,
      lastPublishedAt: null
    };
    
    project.addToHistory('unpublished', {
      previousUrl: project.published.url,
      unpublishedBy: req.user.email
    });
    
    await project.save();
    
    res.json({ message: 'Project unpublished successfully' });
  } catch (error) {
    console.error('Unpublish error:', error);
    res.status(500).json({ message: 'Failed to unpublish project' });
  }
});

// Helper function to deploy to Netlify
async function deployToNetlify(html, options) {
  const { siteName, customDomain, accessToken } = options;
  
  try {
    // Create a zip file with the HTML content
    const files = {
      'index.html': html
    };
    
    // First, try to find existing site
    let siteId = null;
    try {
      const sitesResponse = await axios.get('https://api.netlify.com/api/v1/sites', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      const existingSite = sitesResponse.data.find(site => 
        site.name === siteName || site.custom_domain === customDomain
      );
      
      if (existingSite) {
        siteId = existingSite.id;
      }
    } catch (error) {
      console.log('No existing site found, will create new one');
    }
    
    // Deploy to Netlify
    const deployResponse = await axios.post(
      siteId 
        ? `https://api.netlify.com/api/v1/sites/${siteId}/deploys`
        : 'https://api.netlify.com/api/v1/sites',
      {
        files,
        ...(customDomain && { custom_domain: customDomain })
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return {
      url: deployResponse.data.ssl_url || deployResponse.data.url,
      deployId: deployResponse.data.id
    };
  } catch (error) {
    throw new Error(`Netlify deployment failed: ${error.response?.data?.message || error.message}`);
  }
}

// Helper function to deploy to Vercel
async function deployToVercel(html, options) {
  const { projectName, customDomain, accessToken } = options;
  
  try {
    // Create deployment
    const deployResponse = await axios.post(
      'https://api.vercel.com/v13/deployments',
      {
        name: projectName,
        files: [
          {
            file: 'index.html',
            data: Buffer.from(html).toString('base64')
          }
        ],
        projectSettings: {
          framework: null
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const deploymentUrl = `https://${deployResponse.data.url}`;
    
    // If custom domain is provided, add it (this would require additional API calls)
    if (customDomain) {
      // In a real implementation, you'd add the custom domain here
      console.log(`Custom domain ${customDomain} would be configured for ${deploymentUrl}`);
    }
    
    return {
      url: deploymentUrl,
      deploymentId: deployResponse.data.id
    };
  } catch (error) {
    throw new Error(`Vercel deployment failed: ${error.response?.data?.error?.message || error.message}`);
  }
}

// Helper function to check Netlify deployment status
async function checkNetlifyStatus(url) {
  try {
    const response = await axios.get(url, { timeout: 5000 });
    return response.status === 200 ? 'live' : 'error';
  } catch (error) {
    return 'error';
  }
}

// Helper function to check Vercel deployment status
async function checkVercelStatus(url) {
  try {
    const response = await axios.get(url, { timeout: 5000 });
    return response.status === 200 ? 'live' : 'error';
  } catch (error) {
    return 'error';
  }
}

module.exports = router;
