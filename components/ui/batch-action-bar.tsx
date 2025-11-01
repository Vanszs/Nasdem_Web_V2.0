"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, CheckSquare, Square, Download, Loader2, X, List, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BatchActionBarProps {
  selectedCount: number;
  totalCount: number;
  isAllSelected: boolean;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onDelete?: () => void;
  onExport?: () => void;
  customActions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    className?: string;
    loading?: boolean;
  }>;
  className?: string;
  loading?: boolean;
  loadingMessage?: string;
  onToggleSelection?: (ids: any[]) => void; // New: for custom selection
  availableItems?: any[]; // New: all available items for selection
  onToggleSelectionMode?: () => void; // New: toggle selection mode
  selectionModeActive?: boolean; // New: is selection mode active
}

export function BatchActionBar({
  selectedCount,
  totalCount,
  isAllSelected,
  onSelectAll,
  onClearSelection,
  onDelete,
  onExport,
  customActions = [],
  className,
  loading = false,
  loadingMessage,
  onToggleSelection,
  availableItems = [],
  onToggleSelectionMode,
  selectionModeActive,
}: BatchActionBarProps) {
  const [showSelectionDialog, setShowSelectionDialog] = useState(false);
  const [tempSelectedIds, setTempSelectedIds] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Filter available items based on search term
  const filteredItems = availableItems.filter(item =>
    item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Auto-show selection dialog when Ctrl+A is pressed in selection mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+A or Cmd+A for select all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        if (selectionModeActive && availableItems.length > 0) {
          onToggleSelection?.(availableItems.map(item => item.id));
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectionModeActive, availableItems, onToggleSelection]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+A or Cmd+A for select all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        if (!isAllSelected && totalCount > 0) {
          onSelectAll();
        }
      }
      // Escape to clear selection
      if (e.key === 'Escape' && selectedCount > 0) {
        onClearSelection();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isAllSelected, totalCount, selectedCount, onSelectAll, onClearSelection]);

  // Animate in/out when selection changes
  useEffect(() => {
    if (selectedCount > 0 && !isVisible) {
      setIsVisible(true);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    } else if (selectedCount === 0 && isVisible) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
      }, 200);
    }
  }, [selectedCount, isVisible]);

  if (!isVisible && selectedCount === 0) {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">
            {totalCount} total item
          </span>
          <span className="text-xs text-gray-400">
            Tekan <kbd className="px-1 py-0.5 text-xs bg-gray-100 border rounded">Ctrl+A</kbd> untuk memilih semua
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden transition-all duration-300 ease-in-out",
        isAnimating ? "scale-95 opacity-80" : "scale-100 opacity-100",
        selectedCount > 0
          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md"
          : "bg-gray-50 border-gray-200",
        "rounded-lg border p-4",
        className
      )}
      role="toolbar"
      aria-label="Batch actions toolbar"
    >
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span className="text-sm text-gray-700">{loadingMessage || "Memproses..."}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Selection info */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-gray-900">
              {selectedCount} item terpilih
            </span>
            <span className="text-sm text-gray-500">
              dari {totalCount}
            </span>
          </div>
          
          {selectedCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="h-8 text-xs hover:bg-gray-200 transition-colors"
              aria-label="Clear selection"
            >
              <X className="h-3 w-3 mr-1" />
              Batal Pilih
            </Button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Toggle Selection Mode Button */}
          {onToggleSelectionMode && (
            <Button
              variant={selectionModeActive ? "default" : "outline"}
              size="sm"
              onClick={onToggleSelectionMode}
              disabled={loading}
              className={cn(
                "h-9 text-xs transition-all duration-200",
                selectionModeActive
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  : "border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              )}
              aria-label={selectionModeActive ? "Nonaktifkan mode pemilihan" : "Aktifkan mode pemilihan"}
            >
              <CheckSquare className="h-4 w-4 mr-1" />
              {selectionModeActive ? "Mode Pilih Aktif" : "Mode Pilih"}
            </Button>
          )}

          {/* Select Multiple Button */}
          {onToggleSelection && availableItems.length > 0 && selectionModeActive && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSelectionDialog(true)}
              disabled={loading}
              className="h-9 text-xs border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              aria-label="Pilih beberapa item"
            >
              <List className="h-4 w-4 mr-1" />
              Pilih Beberapa
            </Button>
          )}

          {/* Export Action */}
          {onExport && selectedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              disabled={loading}
              className="h-9 text-xs border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              aria-label={`Export ${selectedCount} selected items`}
            >
              <Download className="h-4 w-4 mr-1" />
              Export ({selectedCount})
            </Button>
          )}

          {/* Custom Actions */}
          {customActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "outline"}
              size="sm"
              onClick={action.onClick}
              disabled={loading || action.loading}
              className={cn(
                "h-9 text-xs transition-all duration-200",
                action.className
              )}
              aria-label={action.label}
            >
              {action.loading ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                action.icon
              )}
              {action.label}
            </Button>
          ))}

          {/* Delete Action */}
          {onDelete && selectedCount > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              disabled={loading}
              className="h-9 text-xs bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label={`Delete ${selectedCount} selected items`}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Hapus ({selectedCount})
            </Button>
          )}

          {/* Select All Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectAll}
            disabled={totalCount === 0 || loading}
            className="h-9 text-xs border-gray-300 hover:bg-gray-50 transition-all duration-200"
            aria-label={isAllSelected ? "Deselect all items" : "Select all items"}
          >
            {isAllSelected ? (
              <>
                <Square className="h-4 w-4 mr-1" />
                Batal Semua
              </>
            ) : (
              <>
                <CheckSquare className="h-4 w-4 mr-1" />
                Pilih Semua
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Selection Dialog */}
      {showSelectionDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pilih Item Tertentu</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowSelectionDialog(false);
                  setSearchTerm("");
                  setTempSelectedIds([]);
                }}
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Search bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari item..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  {tempSelectedIds.length} dari {filteredItems.length} item dipilih
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTempSelectedIds([])}
                    className="text-xs"
                    disabled={loading}
                  >
                    Batal Pilih
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTempSelectedIds(filteredItems.map(item => item.id))}
                    className="text-xs"
                    disabled={loading}
                  >
                    Pilih Semua
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Items list */}
            <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4">
                {filteredItems.map((item) => {
                  const isSelected = tempSelectedIds.includes(item.id);
                  return (
                    <div 
                      key={item.id} 
                      className={cn(
                        "flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-all",
                        isSelected 
                          ? "bg-blue-50 border-blue-300 shadow-sm" 
                          : "bg-white border-gray-200 hover:bg-gray-50"
                      )}
                      onClick={() => {
                        if (isSelected) {
                          setTempSelectedIds(prev => prev.filter(selectedId => selectedId !== item.id));
                        } else {
                          setTempSelectedIds(prev => [...prev, item.id]);
                        }
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 pointer-events-none mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.name || `Item ${item.id}`}
                          </p>
                          {item.description && (
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {item.description}
                            </p>
                          )}
                          {item.email && (
                            <p className="text-xs text-gray-400 truncate mt-1">
                              {item.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSelectionDialog(false);
                  setSearchTerm("");
                  setTempSelectedIds([]);
                }}
                className="px-4 py-2"
                disabled={loading}
              >
                Batal
              </Button>
              <Button
                onClick={() => {
                  onToggleSelection?.(tempSelectedIds);
                  setShowSelectionDialog(false);
                  setTempSelectedIds([]);
                  setSearchTerm("");
                }}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                disabled={loading || tempSelectedIds.length === 0}
              >
                Pilih ({tempSelectedIds.length}) Item
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      {selectedCount > 0 && (
        <div className="mt-2 pt-2 border-t border-blue-100">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>
              <kbd className="px-1 py-0.5 bg-gray-100 border rounded">Ctrl+A</kbd> Pilih semua
            </span>
            <span>
              <kbd className="px-1 py-0.5 bg-gray-100 border rounded">Esc</kbd> Batal pilih
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
