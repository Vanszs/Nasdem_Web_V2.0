import { useCallback, useEffect, useState, useRef } from "react";

export interface UseBatchSelectionOptions<T = any> {
  data: T[];
  idField?: keyof T;
  onBatchAction?: (action: string, selectedIds: any[]) => void | Promise<void>;
  persistKey?: string; // Key for persisting selection in sessionStorage
  enablePersistence?: boolean;
  enableSelectionMode?: boolean; // New: enable selection mode toggle
  onToggleSelection?: (ids: any[]) => void; // New: callback for toggling selection
}

export interface BatchActionState {
  loading: boolean;
  error: string | null;
  progress: number;
  total: number;
}

export function useBatchSelection<T extends Record<string, any>>({
  data,
  idField = "id" as keyof T,
  onBatchAction,
  persistKey,
  enablePersistence = false,
  enableSelectionMode = false,
  onToggleSelection,
}: UseBatchSelectionOptions<T>) {
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectionModeActive, setSelectionModeActive] = useState(false);
  const [actionState, setActionState] = useState<BatchActionState>({
    loading: false,
    error: null,
    progress: 0,
    total: 0,
  });
  const lastActionRef = useRef<string | null>(null);

  // Load persisted selection on mount
  useEffect(() => {
    if (enablePersistence && persistKey) {
      try {
        const persisted = sessionStorage.getItem(`batch-selection-${persistKey}`);
        if (persisted) {
          const parsed = JSON.parse(persisted);
          setSelectedIds(parsed.ids || []);
          lastActionRef.current = parsed.lastAction || null;
        }
      } catch (error) {
        console.warn('Failed to load persisted selection:', error);
      }
    }
  }, [enablePersistence, persistKey]);

  // Save selection to sessionStorage when it changes
  useEffect(() => {
    if (enablePersistence && persistKey) {
      try {
        sessionStorage.setItem(
          `batch-selection-${persistKey}`,
          JSON.stringify({
            ids: selectedIds,
            lastAction: lastActionRef.current,
            timestamp: Date.now(),
          })
        );
      } catch (error) {
        console.warn('Failed to persist selection:', error);
      }
    }
  }, [selectedIds, enablePersistence, persistKey]);

  // Reset selection when data changes significantly
  useEffect(() => {
    const currentIds = data.map((item) => item[idField]);
    const validSelectedIds = selectedIds.filter((id) => currentIds.includes(id));
    
    if (validSelectedIds.length !== selectedIds.length) {
      setSelectedIds(validSelectedIds);
    }
  }, [data, idField, selectedIds]);

  // Update isAllSelected state
  useEffect(() => {
    if (data.length > 0) {
      const allIds = data.map((item) => item[idField]);
      const allSelected = allIds.every((id) => selectedIds.includes(id));
      setIsAllSelected(allSelected && selectedIds.length > 0);
    } else {
      setIsAllSelected(false);
    }
  }, [data, selectedIds, idField]);

  // Toggle individual row selection
  const toggleRowSelection = useCallback(
    (id: any) => {
      setSelectedIds((prev) => {
        if (prev.includes(id)) {
          return prev.filter((selectedId) => selectedId !== id);
        }
        return [...prev, id];
      });
    },
    []
  );

  // Toggle all rows selection
  const toggleAllSelection = useCallback(() => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      const allIds = data.map((item) => item[idField]);
      setSelectedIds(allIds);
    }
  }, [isAllSelected, data, idField]);

  // Toggle selection for specific items
  const toggleSelection = useCallback((ids: any[]) => {
    setSelectedIds((prev) => {
      const newSelection = [...prev];
      ids.forEach((id) => {
        if (newSelection.includes(id)) {
          // Remove if already selected
          return newSelection.filter((selectedId) => selectedId !== id);
        } else {
          // Add if not selected
          newSelection.push(id);
        }
      });
      return newSelection;
    });
    
    // Call the onToggleSelection callback if provided
    if (onToggleSelection) {
      onToggleSelection(ids);
    }
  }, [onToggleSelection]);

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedIds([]);
    setActionState({ loading: false, error: null, progress: 0, total: 0 });
    lastActionRef.current = null;
  }, []);

  // Check if a specific row is selected
  const isRowSelected = useCallback(
    (id: any) => {
      return selectedIds.includes(id);
    },
    [selectedIds]
  );

  // Execute batch action with enhanced error handling and progress tracking
  const executeBatchAction = useCallback(
    async (action: string) => {
      if (selectedIds.length === 0) {
        return false;
      }

      setActionState({
        loading: true,
        error: null,
        progress: 0,
        total: selectedIds.length,
      });
      lastActionRef.current = action;

      try {
        if (onBatchAction) {
          // Simulate progress for better UX (can be removed if real progress is available)
          const progressInterval = setInterval(() => {
            setActionState((prev) => ({
              ...prev,
              progress: Math.min(prev.progress + 1, prev.total - 1),
            }));
          }, 100);

          await onBatchAction(action, selectedIds);
          
          clearInterval(progressInterval);
          setActionState({
            loading: false,
            error: null,
            progress: selectedIds.length,
            total: selectedIds.length,
          });

          // Clear selection after successful action
          setTimeout(() => {
            clearSelection();
          }, 1000);
        }

        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setActionState({
          loading: false,
          error: errorMessage,
          progress: 0,
          total: selectedIds.length,
        });
        
        return false;
      }
    },
    [selectedIds, onBatchAction, clearSelection]
  );

  // Retry last failed action
  const retryLastAction = useCallback(() => {
    if (lastActionRef.current) {
      executeBatchAction(lastActionRef.current);
    }
  }, [executeBatchAction]);

  // Clear error state
  const clearError = useCallback(() => {
    setActionState((prev) => ({ ...prev, error: null }));
  }, []);

  // Toggle selection mode
  const toggleSelectionMode = useCallback(() => {
    setSelectionModeActive((prev) => !prev);
  }, []);

  return {
    selectedIds,
    selectedCount: selectedIds.length,
    isAllSelected,
    isRowSelected,
    toggleRowSelection,
    toggleAllSelection,
    toggleSelection, // New: toggle selection for specific items
    clearSelection,
    executeBatchAction,
    hasSelection: selectedIds.length > 0,
    actionState,
    retryLastAction,
    clearError,
    selectionModeActive, // New: selection mode state
    toggleSelectionMode, // New: toggle selection mode
  };
}
