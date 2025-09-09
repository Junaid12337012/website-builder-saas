import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export const useEditorStore = create(
  subscribeWithSelector((set, get) => ({
    // Project data
    project: null,
    elements: [],
    selectedElement: null,
    canvas: {
      width: 1200,
      height: 800,
      backgroundColor: '#ffffff',
      backgroundImage: null,
      gridSize: 10,
      snapToGrid: true
    },

    // History for undo/redo
    history: [],
    historyIndex: -1,
    maxHistorySize: 50,

    // UI state
    zoom: 1,
    panX: 0,
    panY: 0,
    showGrid: true,
    showRulers: false,

    // Actions
    setProject: (project) => {
      set({
        project,
        elements: project.elements || [],
        canvas: { ...get().canvas, ...project.canvas },
        history: [],
        historyIndex: -1
      });
    },

    // Element management
    addElement: (element) => {
      const { elements } = get();
      const newElements = [...elements, element];
      set({ elements: newElements, selectedElement: element });
    },

    updateElement: (id, updates) => {
      const { elements } = get();
      const newElements = elements.map(el => 
        el.id === id ? { ...el, ...updates } : el
      );
      set({ elements: newElements });
      
      // Update selected element if it's the one being updated
      const { selectedElement } = get();
      if (selectedElement && selectedElement.id === id) {
        set({ selectedElement: { ...selectedElement, ...updates } });
      }
    },

    deleteElement: (id) => {
      const { elements } = get();
      const newElements = elements.filter(el => el.id !== id);
      set({ 
        elements: newElements,
        selectedElement: get().selectedElement?.id === id ? null : get().selectedElement
      });
    },

    selectElement: (element) => {
      set({ selectedElement: element });
    },

    duplicateElement: (id) => {
      const { elements } = get();
      const elementToDuplicate = elements.find(el => el.id === id);
      if (elementToDuplicate) {
        const newElement = {
          ...elementToDuplicate,
          id: `${elementToDuplicate.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          position: {
            ...elementToDuplicate.position,
            x: elementToDuplicate.position.x + 20,
            y: elementToDuplicate.position.y + 20
          }
        };
        get().addElement(newElement);
      }
    },

    // Canvas management
    updateCanvas: (canvasUpdates) => {
      set({ canvas: { ...get().canvas, ...canvasUpdates } });
    },

    // Zoom and pan
    setZoom: (zoom) => {
      set({ zoom: Math.max(0.1, Math.min(3, zoom)) });
    },

    setPan: (panX, panY) => {
      set({ panX, panY });
    },

    resetView: () => {
      set({ zoom: 1, panX: 0, panY: 0 });
    },

    // Grid and rulers
    toggleGrid: () => {
      set({ showGrid: !get().showGrid });
    },

    toggleRulers: () => {
      set({ showRulers: !get().showRulers });
    },

    // History management
    saveToHistory: (action) => {
      const { elements, canvas, history, historyIndex, maxHistorySize } = get();
      
      const newHistoryEntry = {
        action,
        elements: JSON.parse(JSON.stringify(elements)),
        canvas: JSON.parse(JSON.stringify(canvas)),
        timestamp: Date.now()
      };

      // Remove any history after current index (when undoing then making new changes)
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newHistoryEntry);

      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
      }

      set({
        history: newHistory,
        historyIndex: newHistory.length - 1
      });
    },

    undo: () => {
      const { history, historyIndex } = get();
      if (historyIndex > 0) {
        const previousState = history[historyIndex - 1];
        set({
          elements: JSON.parse(JSON.stringify(previousState.elements)),
          canvas: JSON.parse(JSON.stringify(previousState.canvas)),
          historyIndex: historyIndex - 1,
          selectedElement: null
        });
      }
    },

    redo: () => {
      const { history, historyIndex } = get();
      if (historyIndex < history.length - 1) {
        const nextState = history[historyIndex + 1];
        set({
          elements: JSON.parse(JSON.stringify(nextState.elements)),
          canvas: JSON.parse(JSON.stringify(nextState.canvas)),
          historyIndex: historyIndex + 1,
          selectedElement: null
        });
      }
    },

    // Computed values
    get canUndo() {
      return get().historyIndex > 0;
    },

    get canRedo() {
      const { history, historyIndex } = get();
      return historyIndex < history.length - 1;
    },

    // Utility functions
    getElementById: (id) => {
      return get().elements.find(el => el.id === id);
    },

    getElementsInArea: (x, y, width, height) => {
      return get().elements.filter(el => {
        const elX = el.position.x;
        const elY = el.position.y;
        const elWidth = el.dimensions.width;
        const elHeight = el.dimensions.height;

        return (
          elX < x + width &&
          elX + elWidth > x &&
          elY < y + height &&
          elY + elHeight > y
        );
      });
    },

    snapToGrid: (value) => {
      const { canvas } = get();
      if (!canvas.snapToGrid) return value;
      return Math.round(value / canvas.gridSize) * canvas.gridSize;
    },

    // Layer management
    bringToFront: (id) => {
      const { elements } = get();
      const maxZ = Math.max(...elements.map(el => el.position.z || 0));
      get().updateElement(id, {
        position: {
          ...get().getElementById(id).position,
          z: maxZ + 1
        }
      });
    },

    sendToBack: (id) => {
      const { elements } = get();
      const minZ = Math.min(...elements.map(el => el.position.z || 0));
      get().updateElement(id, {
        position: {
          ...get().getElementById(id).position,
          z: minZ - 1
        }
      });
    },

    // Selection management
    selectMultiple: (elementIds) => {
      // For future multi-select functionality
      console.log('Multi-select not implemented yet:', elementIds);
    },

    clearSelection: () => {
      set({ selectedElement: null });
    },

    // Export helpers
    getProjectData: () => {
      const { project, elements, canvas } = get();
      return {
        ...project,
        elements,
        canvas
      };
    },

    // Reset store
    reset: () => {
      set({
        project: null,
        elements: [],
        selectedElement: null,
        canvas: {
          width: 1200,
          height: 800,
          backgroundColor: '#ffffff',
          backgroundImage: null,
          gridSize: 10,
          snapToGrid: true
        },
        history: [],
        historyIndex: -1,
        zoom: 1,
        panX: 0,
        panY: 0,
        showGrid: true,
        showRulers: false
      });
    }
  }))
);
