import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Copy, Plus, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanels,
  ResizableSeparator,
} from "@/components/ui/resizable";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Progress,
} from "@/components/ui/progress";
import {
  RangeCalendar,
} from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Listbox,
  ListboxItem,
  ListboxContent,
  ListboxTrigger,
} from "@/components/ui/listbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Aspectratio,
} from "@/components/ui/aspect-ratio";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  CommandMenu,
} from "@/components/ui/command-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import {
  SkeletonAvatar,
} from "@/components/ui/skeleton-avatar";
import {
  SkeletonText,
} from "@/components/ui/skeleton-text";
import {
  SkeletonBlock,
} from "@/components/ui/skeleton-block";
import {
  SkeletonTable,
} from "@/components/ui/skeleton-table";
import {
  SkeletonCard,
} from "@/components/ui/skeleton-card";
import {
  SkeletonList,
} from "@/components/ui/skeleton-list";
import {
  SkeletonGrid,
} from "@/components/ui/skeleton-grid";
import {
  SkeletonForm,
} from "@/components/ui/skeleton-form";
import {
  SkeletonTabs,
} from "@/components/ui/skeleton-tabs";
import {
  SkeletonAccordion,
} from "@/components/ui/skeleton-accordion";
import {
  SkeletonNavigationMenu,
} from "@/components/ui/skeleton-navigation-menu";
import {
  SkeletonCommandMenu,
} from "@/components/ui/skeleton-command-menu";
import {
  SkeletonDropdownMenu,
} from "@/components/ui/skeleton-dropdown-menu";
import {
  SkeletonContextMenu,
} from "@/components/ui/skeleton-context-menu";
import {
  SkeletonHoverCard,
} from "@/components/ui/skeleton-hover-card";
import {
  SkeletonPopover,
} from "@/components/ui/skeleton-popover";
import {
  SkeletonDialog,
} from "@/components/ui/skeleton-dialog";
import {
  SkeletonSheet,
} from "@/components/ui/skeleton-sheet";
import {
  SkeletonTooltip,
} from "@/components/ui/skeleton-tooltip";
import {
  SkeletonProgress,
} from "@/components/ui/skeleton-progress";
import {
  SkeletonRangeCalendar,
} from "@/components/ui/skeleton-range-calendar";
import {
  SkeletonListbox,
} from "@/components/ui/skeleton-listbox";
import {
  SkeletonAspectratio,
} from "@/components/ui/skeleton-aspect-ratio";
import {
  SkeletonResizable,
} from "@/components/ui/skeleton-resizable";
import {
  SkeletonCollapsible,
} from "@/components/ui/skeleton-collapsible";
import {
  SkeletonCommand,
} from "@/components/ui/skeleton-command";
import {
  SkeletonDrawer,
} from "@/components/ui/skeleton-drawer";
import {
  SkeletonAlert,
} from "@/components/ui/skeleton-alert";
import {
  SkeletonToast,
} from "@/components/ui/skeleton-toast";
import {
  SkeletonSonner,
} from "@/components/ui/skeleton-sonner";
import {
  SkeletonScrollArea,
} from "@/components/ui/skeleton-scroll-area";
import {
  SkeletonTableScrollArea,
} from "@/components/ui/skeleton-table-scroll-area";
import {
  SkeletonResizablePanels,
} from "@/components/ui/skeleton-resizable-panels";
import {
  SkeletonResizablePanel,
} from "@/components/ui/skeleton-resizable-panel";
import {
  SkeletonResizableSeparator,
} from "@/components/ui/skeleton-resizable-separator";
import {
  SkeletonResizableHandle,
} from "@/components/ui/skeleton-resizable-handle";
import {
  SkeletonCollapsibleTrigger,
} from "@/components/ui/skeleton-collapsible-trigger";
import {
  SkeletonCollapsibleContent,
} from "@/components/ui/skeleton-collapsible-content";
import {
  SkeletonCommandDialog,
} from "@/components/ui/skeleton-command-dialog";
import {
  SkeletonCommandEmpty,
} from "@/components/ui/skeleton-command-empty";
import {
  SkeletonCommandGroup,
} from "@/components/ui/skeleton-command-group";
import {
  SkeletonCommandInput,
} from "@/components/ui/skeleton-command-input";
import {
  SkeletonCommandItem,
} from "@/components/ui/skeleton-command-item";
import {
  SkeletonCommandList,
} from "@/components/ui/skeleton-command-list";
import {
  SkeletonCommandSeparator,
} from "@/components/ui/skeleton-command-separator";
import {
  SkeletonCommandShortcut,
} from "@/components/ui/skeleton-command-shortcut";
import {
  SkeletonDropdownMenuContent,
} from "@/components/ui/skeleton-dropdown-menu-content";
import {
  SkeletonDropdownMenuItem,
} from "@/components/ui/skeleton-dropdown-menu-item";
import {
  SkeletonDropdownMenuLabel,
} from "@/components/ui/skeleton-dropdown-menu-label";
import {
  SkeletonDropdownMenuSeparator,
} from "@/components/ui/skeleton-dropdown-menu-separator";
import {
  SkeletonDropdownMenuTrigger,
} from "@/components/ui/skeleton-dropdown-menu-trigger";
import {
  SkeletonDropdownMenuShortcut,
} from "@/components/ui/skeleton-dropdown-menu-shortcut";
import {
  SkeletonContextMenuContent,
} from "@/components/ui/skeleton-context-menu-content";
import {
  SkeletonContextMenuItem,
} from "@/components/ui/skeleton-context-menu-item";
import {
  SkeletonContextMenuLabel,
} from "@/components/ui/skeleton-context-menu-label";
import {
  SkeletonContextMenuSeparator,
} from "@/components/ui/skeleton-context-menu-separator";
import {
  SkeletonContextMenuSub,
} from "@/components/ui/skeleton-context-menu-sub";
import {
  SkeletonContextMenuSubContent,
} from "@/components/ui/skeleton-context-menu-sub-content";
import {
  SkeletonContextMenuSubTrigger,
} from "@/components/ui/skeleton-context-menu-sub-trigger";
import {
  SkeletonContextMenuTrigger,
} from "@/components/ui/skeleton-context-menu-trigger";
import {
  SkeletonHoverCardContent,
} from "@/components/ui/skeleton-hover-card-content";
import {
  SkeletonHoverCardTrigger,
} from "@/components/ui/skeleton-hover-card-trigger";
import {
  SkeletonPopoverContent,
} from "@/components/ui/skeleton-popover-content";
import {
  SkeletonPopoverTrigger,
} from "@/components/ui/skeleton-popover-trigger";
import {
  SkeletonDialogContent,
} from "@/components/ui/skeleton-dialog-content";
import {
  SkeletonDialogTrigger,
} from "@/components/ui/skeleton-dialog-trigger";
import {
  SkeletonSheetContent,
} from "@/components/ui/skeleton-sheet-content";
import {
  SkeletonSheetTrigger,
} from "@/components/ui/skeleton-sheet-trigger";
import {
  SkeletonTooltipContent,
} from "@/components/ui/skeleton-tooltip-content";
import {
  SkeletonTooltipTrigger,
} from "@/components/ui/skeleton-tooltip-trigger";
import {
  SkeletonAlertDescription,
} from "@/components/ui/skeleton-alert-description";
import {
  SkeletonAlertTitle,
} from "@/components/ui/skeleton-alert-title";
import {
  SkeletonAlertDialog,
} from "@/components/ui/skeleton-alert-dialog";
import {
  SkeletonAlertDialogAction,
} from "@/components/ui/skeleton-alert-dialog-action";
import {
  SkeletonAlertDialogCancel,
} from "@/components/ui/skeleton-alert-dialog-cancel";
import {
  SkeletonAlertDialogContent,
} from "@/components/ui/skeleton-alert-dialog-content";
import {
  SkeletonAlertDialogDescription,
} from "@/components/ui/skeleton-alert-dialog-description";
import {
  SkeletonAlertDialogFooter,
} from "@/components/ui/skeleton-alert-dialog-footer";
import {
  SkeletonAlertDialogHeader,
} from "@/components/ui/skeleton-alert-dialog-header";
import {
  SkeletonAlertDialogTitle,
} from "@/components/ui/skeleton-alert-dialog-title";
import {
  SkeletonAlertDialogTrigger,
} from "@/components/ui/skeleton-alert-dialog-trigger";
import {
  SkeletonToastAction,
} from "@/components/ui/skeleton-toast-action";
import {
  SkeletonToastClose,
} from "@/components/ui/skeleton-toast-close";
import {
  SkeletonToastDescription,
} from "@/components/ui/skeleton-toast-description";
import {
  SkeletonToastTitle,
} from "@/components/ui/skeleton-toast-title";
import {
  SkeletonToastViewport,
} from "@/components/ui/skeleton-toast-viewport";
import {
  SkeletonSonnerCloseButton,
} from "@/components/ui/skeleton-sonner-close-button";
import {
  SkeletonSonnerDescription,
} from "@/components/ui/skeleton-sonner-description";
import {
  SkeletonSonnerIcon,
} from "@/components/ui/skeleton-sonner-icon";
import {
  SkeletonSonnerMessage,
} from "@/components/ui/skeleton-sonner-message";
import {
  SkeletonSonnerTitle,
} from "@/components/ui/skeleton-sonner-title";
import {
  SkeletonSonnerToast,
} from "@/components/ui/skeleton-sonner-toast";
import {
  SkeletonSonnerToaster,
} from "@/components/ui/skeleton-sonner-toaster";
import {
  SkeletonScrollAreaViewport,
} from "@/components/ui/skeleton-scroll-area-viewport";
import {
  SkeletonScrollAreaScrollbarHorizontal,
} from "@/components/ui/skeleton-scroll-area-scrollbar-horizontal";
import {
  SkeletonScrollAreaScrollbarVertical,
} from "@/components/ui/skeleton-scroll-area-scrollbar-vertical";
import {
  SkeletonTableScrollAreaViewport,
} from "@/components/ui/skeleton-table-scroll-area-viewport";
import {
  SkeletonTableScrollAreaScrollbarHorizontal,
} from "@/components/ui/skeleton-table-scroll-area-scrollbar-horizontal";
import {
  SkeletonTableScrollAreaScrollbarVertical,
} from "@/components/ui/skeleton-table-scroll-area-scrollbar-vertical";
import {
  SkeletonResizablePanelsRoot,
} from "@/components/ui/skeleton-resizable-panels-root";
import {
  SkeletonResizablePanelRoot,
} from "@/components/ui/skeleton-resizable-panel-root";
import {
  SkeletonResizableSeparatorRoot,
} from "@/components/ui/skeleton-resizable-separator-root";
import {
  SkeletonResizableHandleRoot,
} from "@/components/ui/skeleton-resizable-handle-root";
import {
  SkeletonCollapsibleRoot,
} from "@/components/ui/skeleton-collapsible-root";
import {
  SkeletonCollapsibleTriggerRoot,
} from "@/components/ui/skeleton-collapsible-trigger-root";
import {
  SkeletonCollapsibleContentRoot,
} from "@/components/ui/skeleton-collapsible-content-root";
import {
  SkeletonCommandDialogRoot,
} from "@/components/ui/skeleton-command-dialog-root";
import {
  SkeletonCommandEmptyRoot,
} from "@/components/ui/skeleton-command-empty-root";
import {
  SkeletonCommandGroupRoot,
} from "@/components/ui/skeleton-command-group-root";
import {
  SkeletonCommandInputRoot,
} from "@/components/ui/skeleton-command-input-root";
import {
  SkeletonCommandItemRoot,
} from "@/components/ui/skeleton-command-item-root";
import {
  SkeletonCommandListRoot,
} from "@/components/ui/skeleton-command-list-root";
import {
  SkeletonCommandSeparatorRoot,
} from "@/components/ui/skeleton-command-separator-root";
import {
  SkeletonCommandShortcutRoot,
} from "@/components/ui/skeleton-command-shortcut-root";
import {
  SkeletonDropdownMenuContentRoot,
} from "@/components/ui/skeleton-dropdown-menu-content-root";
import {
  SkeletonDropdownMenuItemRoot,
} from "@/components/ui/skeleton-dropdown-menu-item-root";
import {
  SkeletonDropdownMenuLabelRoot,
} from "@/components/ui/skeleton-dropdown-menu-label-root";
import {
  SkeletonDropdownMenuSeparatorRoot,
} from "@/components/ui/skeleton-dropdown-menu-separator-root";
import {
  SkeletonDropdownMenuTriggerRoot,
} from "@/components/ui/skeleton-dropdown-menu-trigger-root";
import {
  SkeletonDropdownMenuShortcutRoot,
} from "@/components/ui/skeleton-dropdown-menu-shortcut-root";
import {
  SkeletonContextMenuContentRoot,
} from "@/components/ui/skeleton-context-menu-content-root";
import {
  SkeletonContextMenuItemRoot,
} from "@/components/ui/skeleton-context-menu-item-root";
import {
  SkeletonContextMenuLabelRoot,
} from "@/components/ui/skeleton-context-menu-label-root";
import {
  SkeletonContextMenuSeparatorRoot,
} from "@/components/ui/skeleton-context-menu-separator-root";
import {
  SkeletonContextMenuSubRoot,
} from "@/components/ui/skeleton-context-menu-sub-root";
import {
  SkeletonContextMenuSubContentRoot,
} from "@/components/ui/skeleton-context-menu-sub-content-root";
import {
  SkeletonContextMenuSubTriggerRoot,
} from "@/components/ui/skeleton-context-menu-sub-trigger-root";
import {
  SkeletonContextMenuTriggerRoot,
} from "@/components/ui/skeleton-context-menu-trigger-root";
import {
  SkeletonHoverCardContentRoot,
} from "@/components/ui/skeleton-hover-card-content-root";
import {
  SkeletonHoverCardTriggerRoot,
} from "@/components/ui/skeleton-hover-card-trigger-root";
import {
  SkeletonPopoverContentRoot,
} from "@/components/ui/skeleton-popover-content-root";
import {
  SkeletonPopoverTriggerRoot,
} from "@/components/ui/skeleton-popover-trigger-root";
import {
  SkeletonDialogContentRoot,
} from "@/components/ui/skeleton-dialog-content-root";
import {
  SkeletonDialogTriggerRoot,
} from "@/components/ui/skeleton-dialog-trigger-root";
import {
  SkeletonSheetContentRoot,
} from "@/components/ui/skeleton-sheet-content-root";
import {
  SkeletonSheetTriggerRoot,
} from "@/components/ui/skeleton-sheet-trigger-root";
import {
  SkeletonTooltipContentRoot,
} from "@/components/ui/skeleton-tooltip-content-root";
import {
  SkeletonTooltipTriggerRoot,
} from "@/components/ui/skeleton-tooltip-trigger-root";
import {
  SkeletonAlertDescriptionRoot,
} from "@/components/ui/skeleton-alert-description-root";
import {
  SkeletonAlertTitleRoot,
} from "@/components/ui/skeleton-alert-title-root";
import {
  SkeletonAlertDialogRoot,
} from "@/components/ui/skeleton-alert-dialog-root";
import {
  SkeletonAlertDialogActionRoot,
} from "@/components/ui/skeleton-alert-dialog-action-root";
import {
  SkeletonAlertDialogCancelRoot,
} from "@/components/ui/skeleton-alert-dialog-cancel-root";
import {
  SkeletonAlertDialogContentRoot,
} from "@/components/ui/skeleton-alert-dialog-content-root";
import {
  SkeletonAlertDialogDescriptionRoot,
} from "@/components/ui/skeleton-alert-dialog-description-root";
import {
  SkeletonAlertDialogFooterRoot,
} from "@/components/ui/skeleton-alert-dialog-footer-root";
import {
  SkeletonAlertDialogHeaderRoot,
} from "@/components/ui/skeleton-alert-dialog-header-root";
import {
  SkeletonAlertDialogTitleRoot,
} from "@/components/ui/skeleton-alert-dialog-title-root";
import {
  SkeletonAlertDialogTriggerRoot,
} from "@/components/ui/skeleton-alert-dialog-trigger-root";
import {
  SkeletonToastActionRoot,
} from "@/components/ui/skeleton-toast-action-root";
import {
  SkeletonToastCloseRoot,
} from "@/components/ui/skeleton-toast-close-root";
import {
  SkeletonToastDescriptionRoot,
} from "@/components/ui/skeleton-toast-description-root";
import {
  SkeletonToastTitleRoot,
} from "@/components/ui/skeleton-toast-title-root";
import {
  SkeletonToastViewportRoot,
} from "@/components/ui/skeleton-toast-viewport-root";
import {
  SkeletonSonnerCloseButtonRoot,
} from "@/components/ui/skeleton-sonner-close-button-root";
import {
  SkeletonSonnerDescriptionRoot,
} from "@/components/ui/skeleton-sonner-description-root";
import {
  SkeletonSonnerIconRoot,
} from "@/components/ui/skeleton-sonner-icon-root";
import {
  SkeletonSonnerMessageRoot,
} from "@/components/ui/skeleton-sonner-message-root";
import {
  SkeletonSonnerTitleRoot,
} from "@/components/ui/skeleton-sonner-title-root";
import {
  SkeletonSonnerToastRoot,
} from "@/components/ui/skeleton-sonner-toast-root";
import {
  SkeletonSonnerToasterRoot,
} from "@/components/ui/skeleton-sonner-toaster-root";
import {
  SkeletonScrollAreaViewportRoot,
} from "@/components/ui/skeleton-scroll-area-viewport-root";
import {
  SkeletonScrollAreaScrollbarHorizontalRoot,
} from "@/components/ui/skeleton-scroll-area-scrollbar-horizontal-root";
import {
  SkeletonScrollAreaScrollbarVerticalRoot,
} from "@/components/ui/skeleton-scroll-area-scrollbar-vertical-root";
import {
  SkeletonTableScrollAreaViewportRoot,
} from "@/components/ui/skeleton-table-scroll-area-viewport-root";
import {
  SkeletonTableScrollAreaScrollbarHorizontalRoot,
} from "@/components/ui/skeleton-table-scroll-area-scrollbar-horizontal-root";
import {
  SkeletonTableScrollAreaScrollbarVerticalRoot,
} from "@/components/ui/skeleton-table-scroll-area-scrollbar-vertical-root";

interface WalletProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const RealTrading: React.FC = () => {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [activeWallet, setActiveWallet] = useState<string | null>(null);
  const [isTradingEnabled, setIsTradingEnabled] = useState(false);

  const initialCoins = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      price: 62345.67,
      priceChange: 1.23,
      image: "/assets/coins/btc.png",
      marketCap: 1200000000000,
      volume: 25000000000,
      changePercent: 0.02
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      price: 3500.45,
      priceChange: -0.45,
      image: "/assets/coins/eth.png",
      marketCap: 420000000000,
      volume: 15000000000,
      changePercent: -0.01
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      price: 1.23,
      priceChange: 0.12,
      image: "/assets/coins/ada.png",
      marketCap: 40000000000,
      volume: 2000000000,
      changePercent: 0.05
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      price: 180.50,
      priceChange: 2.50,
      image: "/assets/coins/sol.png",
      marketCap: 80000000000,
      volume: 5000000000,
      changePercent: 0.03
    },
    {
      id: "ripple",
      name: "Ripple",
      symbol: "XRP",
      price: 0.85,
      priceChange: -0.05,
      image: "/assets/coins/xrp.png",
      marketCap: 45000000000,
      volume: 3000000000,
      changePercent: -0.02
    },
  ];

  const walletProviders: WalletProvider[] = [
    {
      id: "metamask",
      name: "MetaMask",
      icon: "/assets/wallets/metamask.svg",
      description: "Connect to your MetaMask Wallet",
    },
    {
      id: "walletconnect",
      name: "WalletConnect",
      icon: "/assets/wallets/walletconnect.svg",
      description: "Scan with WalletConnect to connect",
    },
    {
      id: "coinbase",
      name: "Coinbase Wallet",
      icon: "/assets/wallets/coinbase.svg",
      description: "Connect to your Coinbase Wallet",
    },
    {
      id: "ledger",
      name: "Ledger",
      icon: "/assets/wallets/ledger.svg",
      description: "Connect to your Ledger Hardware Wallet",
    },
  ];

  const handleCoinSelect = (coinId: string) => {
    setSelectedCoin(coinId);
  };

  const handleWalletConnect = (walletId: string) => {
    setIsWalletConnected(true);
    setActiveWallet(walletId);
    toast({
      title: "Wallet Connected",
      description: `Successfully connected to ${walletId}`,
    });
  };

  const handleEnableTrading = () => {
    if (!isWalletConnected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to enable trading",
        variant: "destructive",
      });
      return;
    }
    setIsTradingEnabled(true);
    toast({
      title: "Trading Enabled",
      description: "You can now start trading",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>
              Connect your preferred wallet to start trading
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isWalletConnected ? (
              walletProviders.map((wallet) => (
                <div
                  key={wallet.id}
                  className="flex items-center space-x-3 border rounded-md p-3 cursor-pointer hover:bg-secondary"
                  onClick={() => handleWalletConnect(wallet.name)}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={wallet.icon} alt={wallet.name} />
                    <AvatarFallback>{wallet.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{wallet.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {wallet.description}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center space-x-3 border rounded-md p-3 bg-green-100 border-green-200">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`/assets/wallets/${activeWallet?.toLowerCase()}.svg`} alt={activeWallet} />
                  <AvatarFallback>{activeWallet?.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Connected to {activeWallet}</div>
                  <div className="text-sm text-muted-foreground">
                    You are ready to trade
                  </div>
                </div>
              </div>
            )}
            {!isTradingEnabled && (
              <Button onClick={handleEnableTrading} disabled={isTradingEnabled}>
                Enable Trading
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Market Prices</CardTitle>
            <CardDescription>Real-time cryptocurrency prices</CardDescription>
          </CardHeader>
          <CardContent>
            <RealTimePrices
              initialCoins={initialCoins}
              onSelectCoin={handleCoinSelect}
              selectedCoinId={selectedCoin}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTrading;

interface RealTimePricesProps {
  initialCoins: any[];
  onSelectCoin?: (coinId: string) => void;
  selectedCoinId?: string;
}

const RealTimePrices: React.FC<RealTimePricesProps> = ({
  initialCoins,
  onSelectCoin,
  selectedCoinId,
}) => {
  return (
    <div className="space-y-1">
      {initialCoins.map((coin) => (
        <div
          key={coin.id}
          className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted transition-colors ${
            selectedCoinId === coin.id ? "bg-muted" : ""
          }`}
          onClick={() => onSelectCoin && onSelectCoin(coin.id)}
        >
          <div className="flex items-center space-x-3">
            {coin.image && (
              <div className="w-6 h-6 flex-shrink-0">
                <img src={coin.image} alt={coin.name} className="w-full h-full" />
              </div>
            )}
            <div>
              <div className="font-medium">{coin.name}</div>
              <div className="text-xs text-muted-foreground">{coin.symbol}</div>
            </div>
          </div>

          <div className="text-right">
            <div className="font-medium">${coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            <div className={`text-xs ${coin.priceChange >= 0 ? "text-green-500" : "text-red-500"}`}>
              {coin.priceChange >= 0 ? "▲" : "▼"} {Math.abs(coin.priceChange).toFixed(2)}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
