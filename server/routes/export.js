const express = require('express');
const { auth, projectOwner } = require('../middleware/auth');
const { checkSubscriptionLimit } = require('../middleware/subscription');

const router = express.Router();

// @route   POST /api/export/html/:id
// @desc    Export project as HTML
// @access  Private
router.post('/html/:id', auth, projectOwner, checkSubscriptionLimit('codeExport'), async (req, res) => {
  try {
    const project = req.project;
    const { includeCSS = true, minify = false } = req.body;
    
    const html = generateHTML(project, { includeCSS, minify });
    
    // Add to project history
    project.addToHistory('exported_html', { 
      includeCSS, 
      minify,
      exportedBy: req.user.email 
    });
    await project.save();
    
    res.json({
      html,
      filename: `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`,
      size: Buffer.byteLength(html, 'utf8')
    });
  } catch (error) {
    console.error('HTML export error:', error);
    res.status(500).json({ message: 'Export failed' });
  }
});

// @route   POST /api/export/react/:id
// @desc    Export project as React component
// @access  Private
router.post('/react/:id', auth, projectOwner, checkSubscriptionLimit('codeExport'), async (req, res) => {
  try {
    const project = req.project;
    const { typescript = false, includeStyles = true } = req.body;
    
    const reactCode = generateReactComponent(project, { typescript, includeStyles });
    
    // Add to project history
    project.addToHistory('exported_react', { 
      typescript, 
      includeStyles,
      exportedBy: req.user.email 
    });
    await project.save();
    
    const extension = typescript ? 'tsx' : 'jsx';
    
    res.json({
      component: reactCode.component,
      styles: reactCode.styles,
      filename: `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${extension}`,
      stylesFilename: `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.css`
    });
  } catch (error) {
    console.error('React export error:', error);
    res.status(500).json({ message: 'Export failed' });
  }
});

// @route   GET /api/export/preview/:id
// @desc    Generate preview HTML for project
// @access  Private
router.get('/preview/:id', auth, projectOwner, async (req, res) => {
  try {
    const project = req.project;
    const html = generateHTML(project, { includeCSS: true, preview: true });
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({ message: 'Preview generation failed' });
  }
});

// Helper function to generate HTML from project elements
function generateHTML(project, options = {}) {
  const { includeCSS = true, minify = false, preview = false } = options;
  
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.settings?.seo?.title || project.name}</title>`;
    
  if (project.settings?.seo?.description) {
    html += `\n    <meta name="description" content="${project.settings.seo.description}">`;
  }
  
  if (project.settings?.seo?.keywords?.length) {
    html += `\n    <meta name="keywords" content="${project.settings.seo.keywords.join(', ')}">`;
  }
  
  if (includeCSS) {
    html += `\n    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
        }
        
        .canvas {
            position: relative;
            width: ${project.canvas.width || 1200}px;
            height: ${project.canvas.height || 800}px;
            background-color: ${project.canvas.backgroundColor || '#ffffff'};
            ${project.canvas.backgroundImage ? `background-image: url(${project.canvas.backgroundImage});` : ''}
            margin: 0 auto;
        }
        
        .element {
            position: absolute;
        }
        
        ${generateElementCSS(project.elements)}
        
        ${project.settings?.customCSS || ''}
    </style>`;
  }
  
  html += `\n</head>
<body>
    <div class="canvas">`;
    
  // Generate elements HTML
  project.elements.forEach(element => {
    html += generateElementHTML(element);
  });
  
  html += `\n    </div>`;
  
  if (project.settings?.customJS) {
    html += `\n    <script>
        ${project.settings.customJS}
    </script>`;
  }
  
  html += `\n</body>
</html>`;
  
  return minify ? html.replace(/\s+/g, ' ').trim() : html;
}

// Helper function to generate CSS for elements
function generateElementCSS(elements) {
  return elements.map(element => {
    const styles = element.styles || {};
    let css = `\n        .element-${element.id} {`;
    css += `\n            left: ${element.position?.x || 0}px;`;
    css += `\n            top: ${element.position?.y || 0}px;`;
    css += `\n            width: ${element.dimensions?.width || 100}px;`;
    css += `\n            height: ${element.dimensions?.height || 50}px;`;
    css += `\n            z-index: ${element.position?.z || 0};`;
    
    Object.entries(styles).forEach(([key, value]) => {
      if (value) {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        css += `\n            ${cssKey}: ${value};`;
      }
    });
    
    css += `\n        }`;
    return css;
  }).join('');
}

// Helper function to generate HTML for individual elements
function generateElementHTML(element) {
  const { type, content, id } = element;
  let html = '';
  
  switch (type) {
    case 'text':
      const tag = content.text?.startsWith('#') ? 'h1' : 
                 content.text?.startsWith('##') ? 'h2' : 
                 content.text?.startsWith('###') ? 'h3' : 'p';
      html = `\n        <${tag} class="element element-${id}">${content.text || 'Text Element'}</${tag}>`;
      break;
      
    case 'image':
      html = `\n        <img class="element element-${id}" src="${content.src || 'https://via.placeholder.com/300x200'}" alt="${content.alt || 'Image'}" />`;
      break;
      
    case 'button':
      const href = content.href ? ` href="${content.href}"` : '';
      const tag_btn = content.href ? 'a' : 'button';
      html = `\n        <${tag_btn} class="element element-${id}"${href}>${content.text || 'Button'}</${tag_btn}>`;
      break;
      
    case 'section':
      html = `\n        <div class="element element-${id}">`;
      if (element.children?.length) {
        // This would need recursive handling for nested elements
        html += `\n            <!-- Nested elements would go here -->`;
      }
      html += `\n        </div>`;
      break;
      
    default:
      html = `\n        <div class="element element-${id}">${content.text || 'Element'}</div>`;
  }
  
  return html;
}

// Helper function to generate React component
function generateReactComponent(project, options = {}) {
  const { typescript = false, includeStyles = true } = options;
  
  const componentName = project.name.replace(/[^a-z0-9]/gi, '').replace(/^./, str => str.toUpperCase()) || 'WebsiteComponent';
  
  let component = '';
  
  if (typescript) {
    component += `import React from 'react';\n`;
    if (includeStyles) {
      component += `import './${componentName}.css';\n`;
    }
    component += `\ninterface ${componentName}Props {}\n\n`;
    component += `const ${componentName}: React.FC<${componentName}Props> = () => {\n`;
  } else {
    component += `import React from 'react';\n`;
    if (includeStyles) {
      component += `import './${componentName}.css';\n`;
    }
    component += `\nconst ${componentName} = () => {\n`;
  }
  
  component += `  return (\n`;
  component += `    <div className="canvas">\n`;
  
  // Generate JSX for elements
  project.elements.forEach(element => {
    component += generateElementJSX(element);
  });
  
  component += `    </div>\n`;
  component += `  );\n`;
  component += `};\n\n`;
  component += `export default ${componentName};`;
  
  const styles = includeStyles ? generateReactCSS(project) : '';
  
  return { component, styles };
}

// Helper function to generate JSX for elements
function generateElementJSX(element) {
  const { type, content, id } = element;
  let jsx = '';
  
  switch (type) {
    case 'text':
      const Tag = content.text?.startsWith('#') ? 'h1' : 
                 content.text?.startsWith('##') ? 'h2' : 
                 content.text?.startsWith('###') ? 'h3' : 'p';
      jsx = `      <${Tag} className="element element-${id}">${content.text || 'Text Element'}</${Tag}>\n`;
      break;
      
    case 'image':
      jsx = `      <img className="element element-${id}" src="${content.src || 'https://via.placeholder.com/300x200'}" alt="${content.alt || 'Image'}" />\n`;
      break;
      
    case 'button':
      if (content.href) {
        jsx = `      <a className="element element-${id}" href="${content.href}">${content.text || 'Button'}</a>\n`;
      } else {
        jsx = `      <button className="element element-${id}">${content.text || 'Button'}</button>\n`;
      }
      break;
      
    case 'section':
      jsx = `      <div className="element element-${id}">\n`;
      jsx += `        {/* Nested elements would go here */}\n`;
      jsx += `      </div>\n`;
      break;
      
    default:
      jsx = `      <div className="element element-${id}">${content.text || 'Element'}</div>\n`;
  }
  
  return jsx;
}

// Helper function to generate CSS for React component
function generateReactCSS(project) {
  let css = `/* Generated styles for ${project.name} */\n\n`;
  
  css += `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.canvas {
  position: relative;
  width: ${project.canvas.width || 1200}px;
  height: ${project.canvas.height || 800}px;
  background-color: ${project.canvas.backgroundColor || '#ffffff'};
  ${project.canvas.backgroundImage ? `background-image: url(${project.canvas.backgroundImage});` : ''}
  margin: 0 auto;
}

.element {
  position: absolute;
}

`;
  
  // Add element-specific styles
  css += generateElementCSS(project.elements);
  
  if (project.settings?.customCSS) {
    css += `\n\n/* Custom CSS */\n${project.settings.customCSS}`;
  }
  
  return css;
}

module.exports = router;
