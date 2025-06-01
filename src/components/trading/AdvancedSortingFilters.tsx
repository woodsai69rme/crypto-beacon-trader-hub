
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Search, Filter, SortAsc, SortDesc } from 'lucide-react';

export interface SortOption {
  key: string;
  label: string;
  type: 'number' | 'string' | 'date';
}

export interface FilterOption {
  key: string;
  label: string;
  type: 'range' | 'select' | 'multi-select' | 'date-range';
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
}

interface AdvancedSortingFiltersProps {
  data: any[];
  sortOptions: SortOption[];
  filterOptions: FilterOption[];
  onDataChange: (filteredData: any[]) => void;
  searchPlaceholder?: string;
}

const AdvancedSortingFilters: React.FC<AdvancedSortingFiltersProps> = ({
  data,
  sortOptions,
  filterOptions,
  onDataChange,
  searchPlaceholder = "Search..."
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);

  const processedData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (searchQuery.trim()) {
      result = result.filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply custom filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return;

      const filterOption = filterOptions.find(opt => opt.key === key);
      if (!filterOption) return;

      switch (filterOption.type) {
        case 'range':
          if (value.min !== undefined) {
            result = result.filter(item => Number(item[key]) >= Number(value.min));
          }
          if (value.max !== undefined) {
            result = result.filter(item => Number(item[key]) <= Number(value.max));
          }
          break;
        case 'select':
          result = result.filter(item => item[key] === value);
          break;
        case 'multi-select':
          if (Array.isArray(value) && value.length > 0) {
            result = result.filter(item => value.includes(item[key]));
          }
          break;
        case 'date-range':
          if (value.start) {
            result = result.filter(item => new Date(item[key]) >= new Date(value.start));
          }
          if (value.end) {
            result = result.filter(item => new Date(item[key]) <= new Date(value.end));
          }
          break;
      }
    });

    // Apply sorting
    if (sortBy) {
      const sortOption = sortOptions.find(opt => opt.key === sortBy);
      if (sortOption) {
        result.sort((a, b) => {
          let aVal = a[sortBy];
          let bVal = b[sortBy];

          if (sortOption.type === 'number') {
            aVal = Number(aVal) || 0;
            bVal = Number(bVal) || 0;
          } else if (sortOption.type === 'date') {
            aVal = new Date(aVal).getTime();
            bVal = new Date(bVal).getTime();
          } else {
            aVal = String(aVal).toLowerCase();
            bVal = String(bVal).toLowerCase();
          }

          if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }
    }

    return result;
  }, [data, searchQuery, sortBy, sortDirection, filters, sortOptions, filterOptions]);

  React.useEffect(() => {
    onDataChange(processedData);
  }, [processedData, onDataChange]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilter = (key: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchQuery('');
    setSortBy('');
  };

  const activeFiltersCount = Object.keys(filters).length + (searchQuery ? 1 : 0) + (sortBy ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No sorting</SelectItem>
              {sortOptions.map(option => (
                <SelectItem key={option.key} value={option.key}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {sortBy && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
            >
              {sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{searchQuery}"
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery('')} />
            </Badge>
          )}
          {sortBy && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Sort: {sortOptions.find(opt => opt.key === sortBy)?.label} ({sortDirection})
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSortBy('')} />
            </Badge>
          )}
          {Object.entries(filters).map(([key, value]) => {
            const filterOption = filterOptions.find(opt => opt.key === key);
            return (
              <Badge key={key} variant="secondary" className="flex items-center gap-1">
                {filterOption?.label}: {JSON.stringify(value)}
                <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter(key)} />
              </Badge>
            );
          })}
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear all
          </Button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterOptions.map(option => (
                <div key={option.key} className="space-y-2">
                  <label className="text-sm font-medium">{option.label}</label>
                  {option.type === 'range' && (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters[option.key]?.min || ''}
                        onChange={(e) => handleFilterChange(option.key, {
                          ...filters[option.key],
                          min: e.target.value
                        })}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters[option.key]?.max || ''}
                        onChange={(e) => handleFilterChange(option.key, {
                          ...filters[option.key],
                          max: e.target.value
                        })}
                      />
                    </div>
                  )}
                  {option.type === 'select' && option.options && (
                    <Select 
                      value={filters[option.key] || ''} 
                      onValueChange={(value) => handleFilterChange(option.key, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All</SelectItem>
                        {option.options.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {option.type === 'date-range' && (
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={filters[option.key]?.start || ''}
                        onChange={(e) => handleFilterChange(option.key, {
                          ...filters[option.key],
                          start: e.target.value
                        })}
                      />
                      <Input
                        type="date"
                        value={filters[option.key]?.end || ''}
                        onChange={(e) => handleFilterChange(option.key, {
                          ...filters[option.key],
                          end: e.target.value
                        })}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedSortingFilters;
