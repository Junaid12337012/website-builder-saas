import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Download, 
  Share2, 
  Undo, 
  Redo,
  Settings,
  Play
} from 'lucide-react';

import projectService from '../services/projectService';
import { useAuthStore } from '../stores/authStore';
import LoadingSpinner from '../components/LoadingSpinner';
import ElementsSidebar from '../components/editor/ElementsSidebar';
import PropertiesSidebar from '../components/editor/PropertiesSidebar';
import Canvas from '../components/editor/Canvas';
import TopBar from '../components/editor/TopBar';
import { useEditorStore } from '../stores/editorStore';

const EditorPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    elements,
    selectedElement,
    canvas,
    history,
    historyIndex,
    setProject,
    addElement,
    updateElement,
    deleteElement,
    selectElement,
    updateCanvas,
    undo,
    redo,
    canUndo,
    canRedo,
    saveToHistory
  } = useEditorStore();

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch project data
  const { data: projectData, isLoading, error } = useQuery(
    ['project', projectId],
    () => projectService.getProject(projectId),
    {
      enabled: !!projectId,
      onSuccess: (data) => {
        setProject(data.project);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to load project');
        navigate('/dashboard');
      }
    }
  );

  // Auto-save mutation
  const autoSaveMutation = useMutation(
    ({ elements, canvas }) => projectService.updateElements(projectId, elements, 'auto_save'),
    {
      onSuccess: () => {
        setLastSaved(new Date());
      },
      onError: (error) => {
        console.error('Auto-save failed:', error);
      }
    }
  );

  // Manual save mutation
  const saveMutation = useMutation(
    (projectData) => projectService.updateProject(projectId, projectData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['project', projectId]);
        toast.success('Project saved successfully');
        setLastSaved(new Date());
        setIsSaving(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to save project');
        setIsSaving(false);
      }
    }
  );

  // Auto-save functionality
  useEffect(() => {
    if (!elements.length && !Object.keys(canvas).length) return;

    const autoSaveTimer = setTimeout(() => {
      autoSaveMutation.mutate({ elements, canvas });
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [elements, canvas, autoSaveMutation]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          default:
            break;
        }
      }
      
      // Delete selected element
      if (e.key === 'Delete' && selectedElement) {
        deleteElement(selectedElement.id);
        saveToHistory('delete_element');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, undo, redo, deleteElement, saveToHistory]);

  const handleSave = useCallback(() => {
    if (isSaving) return;
    
    setIsSaving(true);
    saveMutation.mutate({
      elements,
      canvas,
      settings: projectData?.project?.settings || {}
    });
  }, [elements, canvas, projectData, saveMutation, isSaving]);

  const handlePreview = () => {
    const previewUrl = projectService.getPreviewUrl(projectId);
    window.open(previewUrl, '_blank');
  };

  const handleBackToDashboard = () => {
    if (autoSaveMutation.isLoading || saveMutation.isLoading) {
      toast.error('Please wait for save to complete');
      return;
    }
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load project</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const project = projectData?.project;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Bar */}
      <TopBar
        project={project}
        onBack={handleBackToDashboard}
        onSave={handleSave}
        onPreview={handlePreview}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        isSaving={isSaving || autoSaveMutation.isLoading}
        lastSaved={lastSaved}
      />

      {/* Main Editor Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Elements */}
        <div className="w-64 sidebar">
          <ElementsSidebar
            onAddElement={(elementType) => {
              const newElement = createNewElement(elementType);
              addElement(newElement);
              saveToHistory('add_element');
            }}
          />
        </div>

        {/* Canvas Area */}
        <div className="flex-1 canvas-container">
          <Canvas
            elements={elements}
            canvas={canvas}
            selectedElement={selectedElement}
            onSelectElement={selectElement}
            onUpdateElement={(id, updates) => {
              updateElement(id, updates);
              saveToHistory('update_element');
            }}
            onUpdateCanvas={(canvasUpdates) => {
              updateCanvas(canvasUpdates);
              saveToHistory('update_canvas');
            }}
            onAddElement={(element) => {
              addElement(element);
              saveToHistory('add_element');
            }}
          />
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 sidebar">
          <PropertiesSidebar
            selectedElement={selectedElement}
            canvas={canvas}
            onUpdateElement={(updates) => {
              if (selectedElement) {
                updateElement(selectedElement.id, updates);
                saveToHistory('update_properties');
              }
            }}
            onUpdateCanvas={(canvasUpdates) => {
              updateCanvas(canvasUpdates);
              saveToHistory('update_canvas');
            }}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <span>{elements.length} elements</span>
          <span>Canvas: {canvas.width || 1200}×{canvas.height || 800}</span>
          {selectedElement && (
            <span>Selected: {selectedElement.type}</span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {lastSaved && (
            <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
          )}
          {(isSaving || autoSaveMutation.isLoading) && (
            <div className="flex items-center">
              <LoadingSpinner size="sm" className="mr-2" />
              Saving...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to create new elements
const createNewElement = (type) => {
  const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseElement = {
    id,
    type,
    position: { x: 100, y: 100, z: 1 },
    dimensions: { width: 200, height: 100 },
    styles: {}
  };

  switch (type) {
    case 'text':
      return {
        ...baseElement,
        content: { text: 'New Text Element' },
        dimensions: { width: 200, height: 50 },
        styles: {
          fontSize: '16px',
          color: '#000000',
          fontFamily: 'Inter, sans-serif'
        }
      };
    
    case 'image':
      return {
        ...baseElement,
        content: { 
          src: 'https://via.placeholder.com/200x100', 
          alt: 'Placeholder image' 
        },
        dimensions: { width: 200, height: 100 }
      };
    
    case 'button':
      return {
        ...baseElement,
        content: { text: 'Button', href: '#' },
        dimensions: { width: 120, height: 40 },
        styles: {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500',
          textAlign: 'center',
          padding: '8px 16px'
        }
      };
    
    case 'section':
      return {
        ...baseElement,
        content: {},
        dimensions: { width: 400, height: 200 },
        styles: {
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px'
        },
        children: []
      };
    
    default:
      return baseElement;
  }
};

export default EditorPage;
