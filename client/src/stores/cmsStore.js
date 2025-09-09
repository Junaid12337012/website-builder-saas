import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import cmsService from '../services/cmsService';

export const useCMSStore = create(
  subscribeWithSelector((set, get) => ({
    // Collections
    collections: [],
    currentCollection: null,
    collectionsLoading: false,
    collectionsError: null,

    // Content
    content: [],
    currentContent: null,
    contentLoading: false,
    contentError: null,
    contentPagination: {
      currentPage: 1,
      totalPages: 1,
      total: 0
    },

    // Media
    media: [],
    mediaLoading: false,
    mediaError: null,
    mediaPagination: {
      currentPage: 1,
      totalPages: 1,
      total: 0
    },

    // UI State
    selectedContentIds: [],
    selectedMediaIds: [],
    viewMode: 'grid', // grid | list
    filters: {
      status: 'all',
      search: '',
      type: 'all'
    },

    // Collections Actions
    fetchCollections: async () => {
      set({ collectionsLoading: true, collectionsError: null });
      try {
        const collections = await cmsService.getCollections();
        set({ collections, collectionsLoading: false });
      } catch (error) {
        set({ collectionsError: error.message, collectionsLoading: false });
      }
    },

    createCollection: async (data) => {
      try {
        const collection = await cmsService.createCollection(data);
        set(state => ({
          collections: [collection, ...state.collections]
        }));
        return collection;
      } catch (error) {
        set({ collectionsError: error.message });
        throw error;
      }
    },

    updateCollection: async (id, data) => {
      try {
        const updatedCollection = await cmsService.updateCollection(id, data);
        set(state => ({
          collections: state.collections.map(c => 
            c._id === id ? updatedCollection : c
          ),
          currentCollection: state.currentCollection?._id === id ? updatedCollection : state.currentCollection
        }));
        return updatedCollection;
      } catch (error) {
        set({ collectionsError: error.message });
        throw error;
      }
    },

    deleteCollection: async (id) => {
      try {
        await cmsService.deleteCollection(id);
        set(state => ({
          collections: state.collections.filter(c => c._id !== id),
          currentCollection: state.currentCollection?._id === id ? null : state.currentCollection
        }));
      } catch (error) {
        set({ collectionsError: error.message });
        throw error;
      }
    },

    setCurrentCollection: (collection) => {
      set({ currentCollection: collection });
    },

    // Content Actions
    fetchContent: async (collectionId, params = {}) => {
      set({ contentLoading: true, contentError: null });
      try {
        const response = await cmsService.getContent(collectionId, {
          ...params,
          ...get().filters
        });
        set({
          content: response.content,
          contentPagination: {
            currentPage: response.currentPage,
            totalPages: response.totalPages,
            total: response.total
          },
          contentLoading: false
        });
      } catch (error) {
        set({ contentError: error.message, contentLoading: false });
      }
    },

    createContent: async (data) => {
      try {
        const content = await cmsService.createContent(data);
        set(state => ({
          content: [content, ...state.content]
        }));
        return content;
      } catch (error) {
        set({ contentError: error.message });
        throw error;
      }
    },

    updateContent: async (id, data) => {
      try {
        const updatedContent = await cmsService.updateContent(id, data);
        set(state => ({
          content: state.content.map(c => 
            c._id === id ? updatedContent : c
          ),
          currentContent: state.currentContent?._id === id ? updatedContent : state.currentContent
        }));
        return updatedContent;
      } catch (error) {
        set({ contentError: error.message });
        throw error;
      }
    },

    deleteContent: async (id) => {
      try {
        await cmsService.deleteContent(id);
        set(state => ({
          content: state.content.filter(c => c._id !== id),
          currentContent: state.currentContent?._id === id ? null : state.currentContent
        }));
      } catch (error) {
        set({ contentError: error.message });
        throw error;
      }
    },

    publishContent: async (id, publish) => {
      try {
        const updatedContent = await cmsService.publishContent(id, publish);
        set(state => ({
          content: state.content.map(c => 
            c._id === id ? updatedContent : c
          )
        }));
        return updatedContent;
      } catch (error) {
        set({ contentError: error.message });
        throw error;
      }
    },

    setCurrentContent: (content) => {
      set({ currentContent: content });
    },

    // Media Actions
    fetchMedia: async (params = {}) => {
      set({ mediaLoading: true, mediaError: null });
      try {
        const response = await cmsService.getMedia(params);
        set({
          media: response.media,
          mediaPagination: {
            currentPage: response.currentPage,
            totalPages: response.totalPages,
            total: response.total
          },
          mediaLoading: false
        });
      } catch (error) {
        set({ mediaError: error.message, mediaLoading: false });
      }
    },

    uploadMedia: async (files, metadata = {}) => {
      try {
        let uploadedMedia;
        if (Array.isArray(files)) {
          uploadedMedia = await cmsService.uploadMultipleMedia(files);
        } else {
          uploadedMedia = await cmsService.uploadMedia(files, metadata);
          uploadedMedia = [uploadedMedia];
        }
        
        set(state => ({
          media: [...uploadedMedia, ...state.media]
        }));
        return uploadedMedia;
      } catch (error) {
        set({ mediaError: error.message });
        throw error;
      }
    },

    updateMedia: async (id, data) => {
      try {
        const updatedMedia = await cmsService.updateMedia(id, data);
        set(state => ({
          media: state.media.map(m => 
            m._id === id ? updatedMedia : m
          )
        }));
        return updatedMedia;
      } catch (error) {
        set({ mediaError: error.message });
        throw error;
      }
    },

    deleteMedia: async (id) => {
      try {
        await cmsService.deleteMedia(id);
        set(state => ({
          media: state.media.filter(m => m._id !== id)
        }));
      } catch (error) {
        set({ mediaError: error.message });
        throw error;
      }
    },

    // Selection Actions
    toggleContentSelection: (id) => {
      set(state => ({
        selectedContentIds: state.selectedContentIds.includes(id)
          ? state.selectedContentIds.filter(cid => cid !== id)
          : [...state.selectedContentIds, id]
      }));
    },

    toggleMediaSelection: (id) => {
      set(state => ({
        selectedMediaIds: state.selectedMediaIds.includes(id)
          ? state.selectedMediaIds.filter(mid => mid !== id)
          : [...state.selectedMediaIds, id]
      }));
    },

    clearSelections: () => {
      set({ selectedContentIds: [], selectedMediaIds: [] });
    },

    // UI Actions
    setViewMode: (mode) => {
      set({ viewMode: mode });
    },

    setFilters: (filters) => {
      set(state => ({
        filters: { ...state.filters, ...filters }
      }));
    },

    clearFilters: () => {
      set({
        filters: {
          status: 'all',
          search: '',
          type: 'all'
        }
      });
    },

    // Bulk Actions
    bulkDeleteContent: async (ids) => {
      try {
        await Promise.all(ids.map(id => cmsService.deleteContent(id)));
        set(state => ({
          content: state.content.filter(c => !ids.includes(c._id)),
          selectedContentIds: []
        }));
      } catch (error) {
        set({ contentError: error.message });
        throw error;
      }
    },

    bulkPublishContent: async (ids, publish) => {
      try {
        await Promise.all(ids.map(id => cmsService.publishContent(id, publish)));
        // Refresh content list
        const { currentCollection } = get();
        if (currentCollection) {
          await get().fetchContent(currentCollection._id);
        }
        set({ selectedContentIds: [] });
      } catch (error) {
        set({ contentError: error.message });
        throw error;
      }
    },

    bulkDeleteMedia: async (ids) => {
      try {
        await Promise.all(ids.map(id => cmsService.deleteMedia(id)));
        set(state => ({
          media: state.media.filter(m => !ids.includes(m._id)),
          selectedMediaIds: []
        }));
      } catch (error) {
        set({ mediaError: error.message });
        throw error;
      }
    }
  }))
);

export default useCMSStore;
