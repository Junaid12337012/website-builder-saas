// Utility function to download files without external dependency
const downloadFile = (content, filename, type = 'text/html') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Generate HTML from project data
export const generateHTML = (project) => {
  const { elements, canvas, settings } = project;
  
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${settings?.seo?.title || project.name}</title>`;
    
  if (settings?.seo?.description) {
    html += `\n    <meta name="description" content="${settings.seo.description}">`;
  }
  
  if (settings?.seo?.keywords?.length) {
    html += `\n    <meta name="keywords" content="${settings.seo.keywords.join(', ')}">`;
  }
  
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
            width: ${canvas.width || 1200}px;
            height: ${canvas.height || 800}px;
            background-color: ${canvas.backgroundColor || '#ffffff'};
            margin: 0 auto;
        }
        
        .element {
            position: absolute;
        }
        
        ${generateElementCSS(elements)}
        
        ${settings?.customCSS || ''}
    </style>`;
  
  html += `\n</head>
<body>
    <div class="canvas">`;
    
  // Generate elements HTML
  elements.forEach(element => {
    html += generateElementHTML(element);
  });
  
  html += `\n    </div>`;
  
  if (settings?.customJS) {
    html += `\n    <script>
        ${settings.customJS}
    </script>`;
  }
  
  html += `\n</body>
</html>`;
  
  return html;
};

// Generate CSS for elements
const generateElementCSS = (elements) => {
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
};

// Generate HTML for individual elements
const generateElementHTML = (element) => {
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
        html += `\n            <!-- Nested elements would go here -->`;
      }
      html += `\n        </div>`;
      break;
      
    default:
      html = `\n        <div class="element element-${id}">${content.text || 'Element'}</div>`;
  }
  
  return html;
};

// Generate React component
export const generateReactComponent = (project) => {
  const componentName = project.name.replace(/[^a-z0-9]/gi, '').replace(/^./, str => str.toUpperCase()) || 'WebsiteComponent';
  
  let component = `import React from 'react';\nimport './${componentName}.css';\n\n`;
  component += `const ${componentName} = () => {\n`;
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
  
  const styles = generateReactCSS(project);
  
  return { component, styles, componentName };
};

// Generate JSX for elements
const generateElementJSX = (element) => {
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
};

// Generate CSS for React component
const generateReactCSS = (project) => {
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
};

// Export using the downloadFile function defined above

// Export project as HTML
export const exportAsHTML = (project) => {
  const html = generateHTML(project);
  const filename = `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
  downloadFile(html, filename, 'text/html');
};

// Export project as React
export const exportAsReact = (project) => {
  const { component, styles, componentName } = generateReactComponent(project);
  
  // Download component file
  downloadFile(component, `${componentName}.jsx`, 'text/javascript');
  
  // Download styles file
  downloadFile(styles, `${componentName}.css`, 'text/css');
};
