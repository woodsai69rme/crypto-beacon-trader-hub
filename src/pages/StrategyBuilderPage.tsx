
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Save, 
  PlayCircle, 
  ArrowLeft,
  Plus,
  ChevronDown,
  X,
  Copy
} from "lucide-react";

interface BlockType {
  id: string;
  type: string;
  name: string;
  description: string;
  category: string;
  icon?: React.ReactNode;
  color: string;
  inputs?: number;
  outputs?: number;
}

const blocks: BlockType[] = [
  { id: 'buy', type: 'action', name: 'Buy', description: 'Buy a specific amount or percentage', category: 'Actions', color: 'bg-green-500', inputs: 1, outputs: 1 },
  { id: 'sell', type: 'action', name: 'Sell', description: 'Sell a specific amount or percentage', category: 'Actions', color: 'bg-red-500', inputs: 1, outputs: 1 },
  { id: 'if', type: 'logic', name: 'If Condition', description: 'Execute based on condition', category: 'Logic', color: 'bg-blue-500', inputs: 1, outputs: 2 },
  { id: 'rsi', type: 'indicator', name: 'RSI', description: 'Relative Strength Index', category: 'Indicators', color: 'bg-purple-500', inputs: 0, outputs: 1 },
  { id: 'macd', type: 'indicator', name: 'MACD', description: 'Moving Average Convergence Divergence', category: 'Indicators', color: 'bg-purple-500', inputs: 0, outputs: 1 },
  { id: 'price-crosses', type: 'condition', name: 'Price Crosses', description: 'When price crosses a value', category: 'Conditions', color: 'bg-yellow-500', inputs: 1, outputs: 1 },
  { id: 'timeframe', type: 'setting', name: 'Timeframe', description: 'Set the timeframe for analysis', category: 'Settings', color: 'bg-gray-500', inputs: 0, outputs: 1 },
];

const StrategyBuilderPage: React.FC = () => {
  const [strategyName, setStrategyName] = useState('New Strategy');
  const [strategyDescription, setStrategyDescription] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<string[]>(['bitcoin']);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1h');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggedBlock, setDraggedBlock] = useState<BlockType | null>(null);
  const [placedBlocks, setPlacedBlocks] = useState<Array<{block: BlockType, x: number, y: number, id: string}>>([]);
  const [connections, setConnections] = useState<Array<{from: string, to: string, fromPoint: string, toPoint: string}>>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawingFrom, setDrawingFrom] = useState<{blockId: string, point: string} | null>(null);
  const [mousePos, setMousePos] = useState({x: 0, y: 0});
  const [blockCategories, setBlockCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Extract unique categories from blocks
  useEffect(() => {
    const categories = ['All', ...Array.from(new Set(blocks.map(block => block.category)))];
    setBlockCategories(categories);
  }, []);
  
  const filteredBlocks = selectedCategory === 'All'
    ? blocks
    : blocks.filter(block => block.category === selectedCategory);
  
  const handleDragStart = (block: BlockType) => {
    setIsDragging(true);
    setDraggedBlock(block);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedBlock(null);
  };
  
  const handleCanvasDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleCanvasDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggedBlock) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPlacedBlocks([
      ...placedBlocks,
      {
        block: draggedBlock,
        x,
        y,
        id: `block-${draggedBlock.id}-${Date.now()}`
      }
    ]);
    setDraggedBlock(null);
    setIsDragging(false);
  };
  
  const handleBlockMouseDown = (e: React.MouseEvent, blockId: string, point: string) => {
    e.stopPropagation();
    
    // Start drawing a connection
    setIsDrawing(true);
    setDrawingFrom({blockId, point});
    setMousePos({x: e.clientX, y: e.clientY});
  };
  
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDrawing) {
      setMousePos({x: e.clientX, y: e.clientY});
    }
  };
  
  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDrawing(false);
    setDrawingFrom(null);
  };
  
  const handleConnectionPoint = (e: React.MouseEvent, blockId: string, point: string) => {
    e.stopPropagation();
    
    if (isDrawing && drawingFrom) {
      // Don't connect to the same block
      if (drawingFrom.blockId === blockId) {
        setIsDrawing(false);
        setDrawingFrom(null);
        return;
      }
      
      // Create new connection
      setConnections([
        ...connections,
        {
          from: drawingFrom.blockId,
          to: blockId,
          fromPoint: drawingFrom.point,
          toPoint: point
        }
      ]);
      
      setIsDrawing(false);
      setDrawingFrom(null);
    }
  };
  
  const handleDeleteBlock = (id: string) => {
    // Remove block
    setPlacedBlocks(placedBlocks.filter(block => block.id !== id));
    
    // Remove associated connections
    setConnections(connections.filter(conn => conn.from !== id && conn.to !== id));
  };
  
  const handleDeleteConnection = (index: number) => {
    const newConnections = [...connections];
    newConnections.splice(index, 1);
    setConnections(newConnections);
  };
  
  const handleSaveStrategy = () => {
    // In a real app, we would save the strategy to the database
    toast({
      title: "Strategy Saved",
      description: `Successfully saved strategy: ${strategyName}`
    });
    
    setTimeout(() => {
      navigate('/ai-strategies');
    }, 1000);
  };
  
  const handleBacktest = () => {
    // In a real app, we would start the backtesting process
    toast({
      title: "Starting Backtest",
      description: "Preparing backtesting environment..."
    });
    
    setTimeout(() => {
      navigate('/backtest');
    }, 1000);
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" onClick={() => navigate('/ai-strategies')} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6" />
            Strategy Builder
          </h1>
          <p className="text-muted-foreground">Create and customize trading strategies</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Strategy Configuration */}
        <Card className="order-2 lg:order-1">
          <CardHeader>
            <CardTitle>Strategy Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="strategy-name">Strategy Name</Label>
              <Input
                id="strategy-name"
                placeholder="Enter strategy name"
                value={strategyName}
                onChange={(e) => setStrategyName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="strategy-description">Description</Label>
              <Textarea
                id="strategy-description"
                placeholder="Describe your strategy"
                value={strategyDescription}
                onChange={(e) => setStrategyDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Assets</Label>
              <Select value={selectedAssets[0]} onValueChange={(value) => setSelectedAssets([value])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                  <SelectItem value="solana">Solana (SOL)</SelectItem>
                  <SelectItem value="ripple">XRP (XRP)</SelectItem>
                  <SelectItem value="cardano">Cardano (ADA)</SelectItem>
                  <SelectItem value="dogecoin">Dogecoin (DOGE)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Timeframe</Label>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Minute</SelectItem>
                  <SelectItem value="5m">5 Minutes</SelectItem>
                  <SelectItem value="15m">15 Minutes</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="4h">4 Hours</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4 pt-4">
              <Label>Available Blocks</Label>
              <div className="space-y-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {blockCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {filteredBlocks.map((block) => (
                  <div
                    key={block.id}
                    className={`${block.color} text-white p-3 rounded-md cursor-grab active:cursor-grabbing transition-transform hover:scale-[1.02] relative group`}
                    draggable
                    onDragStart={() => handleDragStart(block)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{block.name}</span>
                      <span className="text-xs opacity-80">{block.category}</span>
                    </div>
                    <p className="text-xs mt-1 opacity-80">{block.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Main Canvas */}
        <Card className="lg:col-span-2 order-1 lg:order-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Visual Editor</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleBacktest}>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Backtest
                </Button>
                <Button size="sm" onClick={handleSaveStrategy}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Strategy
                </Button>
              </div>
            </div>
            <CardDescription>
              Drag and drop blocks to build your strategy. Connect blocks by dragging from output to input points.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              ref={canvasRef}
              className="w-full h-[600px] bg-muted/30 rounded-lg border-2 border-dashed relative overflow-auto"
              onDragOver={handleCanvasDragOver}
              onDrop={handleCanvasDrop}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
            >
              {/* Placed blocks */}
              {placedBlocks.map((item) => (
                <div
                  key={item.id}
                  className={`absolute ${item.block.color} text-white p-3 rounded-md shadow-md cursor-move`}
                  style={{
                    left: `${item.x}px`,
                    top: `${item.y}px`,
                    zIndex: 10
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{item.block.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-white hover:bg-white/20"
                      onClick={() => handleDeleteBlock(item.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {/* Input connection points */}
                  {item.block.inputs && item.block.inputs > 0 && (
                    <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2">
                      <div
                        className="w-4 h-4 bg-white rounded-full border-2 border-gray-800 cursor-pointer"
                        onMouseUp={(e) => handleConnectionPoint(e, item.id, 'input')}
                      />
                    </div>
                  )}
                  
                  {/* Output connection points */}
                  {item.block.outputs && item.block.outputs > 0 && (
                    <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <div
                        className="w-4 h-4 bg-white rounded-full border-2 border-gray-800 cursor-pointer"
                        onMouseDown={(e) => handleBlockMouseDown(e, item.id, 'output')}
                      />
                    </div>
                  )}
                </div>
              ))}
              
              {/* Connections */}
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                {connections.map((conn, index) => {
                  const fromBlock = placedBlocks.find(b => b.id === conn.from);
                  const toBlock = placedBlocks.find(b => b.id === conn.to);
                  
                  if (!fromBlock || !toBlock) return null;
                  
                  const fromPoint = { x: fromBlock.x + 120, y: fromBlock.y + 28 };
                  const toPoint = { x: toBlock.x, y: toBlock.y + 28 };
                  
                  return (
                    <g key={`conn-${index}`}>
                      <path
                        d={`M ${fromPoint.x} ${fromPoint.y} C ${fromPoint.x + 50} ${fromPoint.y}, ${toPoint.x - 50} ${toPoint.y}, ${toPoint.x} ${toPoint.y}`}
                        stroke="rgba(59, 130, 246, 0.7)"
                        strokeWidth="2"
                        fill="none"
                        onClick={() => handleDeleteConnection(index)}
                      />
                    </g>
                  );
                })}
                
                {/* Drawing connection line */}
                {isDrawing && drawingFrom && (
                  (() => {
                    const fromBlock = placedBlocks.find(b => b.id === drawingFrom.blockId);
                    if (!fromBlock) return null;
                    
                    const fromPoint = { x: fromBlock.x + 120, y: fromBlock.y + 28 };
                    const canvas = canvasRef.current;
                    if (!canvas) return null;
                    
                    const rect = canvas.getBoundingClientRect();
                    const toPoint = { 
                      x: mousePos.x - rect.left, 
                      y: mousePos.y - rect.top 
                    };
                    
                    return (
                      <path
                        d={`M ${fromPoint.x} ${fromPoint.y} C ${fromPoint.x + 50} ${fromPoint.y}, ${toPoint.x - 50} ${toPoint.y}, ${toPoint.x} ${toPoint.y}`}
                        stroke="rgba(59, 130, 246, 0.4)"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        fill="none"
                      />
                    );
                  })()
                )}
              </svg>
              
              {/* Empty state */}
              {placedBlocks.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                  <div className="max-w-xs">
                    <Plus className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <h3 className="text-lg font-medium">Start Building</h3>
                    <p className="text-sm text-muted-foreground">
                      Drag blocks from the left panel and drop them here to start building your strategy
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StrategyBuilderPage;
